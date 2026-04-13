import { TypedEventEmitter } from './typed-event-emitter.js'
import type { WebSocketChannelEvents, SignalingMessage } from './types.js'

export class WebSocketChannel extends TypedEventEmitter<WebSocketChannelEvents> {
  private static readonly MAX_QUEUED_MESSAGES = 100

  private address: string
  private retries: number
  private socket!: WebSocket
  private messagesToDeliverOnConnect: string[] = []
  private pingInterval: ReturnType<typeof setInterval> | null = null
  private outstandingPongs = 0

  constructor(address: string, retries = 2) {
    super()
    this.address = address
    this.retries = retries
    this.setupWebsocket()
  }

  /** Returns true if socket is in a good state */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  private sendDeliverOnConnectMessages(): void {
    for (const msg of this.messagesToDeliverOnConnect) {
      this.socket.send(msg)
    }
    this.messagesToDeliverOnConnect = []
  }

  private setupWebsocket(): void {
    this.socket = new WebSocket(this.address)

    this.socket.onopen = (handshake) => {
      this.retries = 0
      this.sendDeliverOnConnectMessages()
      this.startClientPings()
      this.emit('open', handshake)
    }

    this.socket.onmessage = (msg) => {
      let parsedMsg: unknown
      try {
        parsedMsg = JSON.parse(msg.data as string)
      } catch (error) {
        this.emit('error', 'invalid_format', error)
        return
      }

      if (
        typeof parsedMsg !== 'object' ||
        parsedMsg === null ||
        typeof (parsedMsg as SignalingMessage).event !== 'string'
      ) {
        this.emit('error', 'invalid_format')
        return
      }

      const signalMsg = parsedMsg as SignalingMessage

      if (signalMsg.event === 'pong') {
        this.outstandingPongs = 0
      } else {
        this.emit('message', signalMsg)
      }
    }

    this.socket.onerror = () => {
      if (this.pingInterval) clearInterval(this.pingInterval)
      if (this.retries > 0) {
        this.retries -= 1
        this.setupWebsocket()
      } else {
        this.emit('error', 'socket')
      }
    }

    this.socket.onclose = () => {
      if (this.pingInterval) clearInterval(this.pingInterval)
      this.emit('close')
    }
  }

  private startClientPings(): void {
    this.outstandingPongs = 0
    this.pingInterval = setInterval(() => {
      if (this.outstandingPongs >= 6) {
        if (this.pingInterval) clearInterval(this.pingInterval)
        this.socket.close()
        this.emit('error', 'missing_pongs')
        return
      }
      this.socket.send(JSON.stringify({ event: 'ping' }))
      this.outstandingPongs += 1
    }, 5000)
  }

  /** Sends the given data through the websocket */
  send(data: SignalingMessage): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      if (this.messagesToDeliverOnConnect.length !== 0) {
        this.sendDeliverOnConnectMessages()
      }
      this.socket.send(JSON.stringify(data))
    } else if (this.socket.readyState > WebSocket.OPEN) {
      // connection closing or closed
      this.emit('not_reachable')
    } else {
      // connection still to be established
      if (this.messagesToDeliverOnConnect.length >= WebSocketChannel.MAX_QUEUED_MESSAGES) {
        this.emit('error', 'queue_full')
        return
      }
      this.messagesToDeliverOnConnect.push(JSON.stringify(data))
    }
  }

  /** Closes the websocket */
  close(): void {
    if (this.pingInterval) clearInterval(this.pingInterval)
    this.socket.close()
  }
}
