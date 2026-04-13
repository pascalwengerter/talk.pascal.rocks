import { TypedEventEmitter } from './typed-event-emitter.js'
import type { DataChannelEvents } from './types.js'

export class DataChannel extends TypedEventEmitter<DataChannelEvents> {
  private static readonly MAX_BUFFER = 1024 * 1024

  private channel: RTCDataChannel
  private sendBuffer: Array<[data: unknown, cb?: () => void]> = []
  private pendingSendTimeout: ReturnType<typeof setTimeout> | null = null

  constructor(channel: RTCDataChannel) {
    super()
    this.channel = channel
    this.channel.onmessage = (event) => this.emit('message', event.data)
    this.channel.onclose = () => {
      if (this.pendingSendTimeout) {
        clearTimeout(this.pendingSendTimeout)
        this.pendingSendTimeout = null
      }
      this.sendBuffer = []
      this.emit('close')
    }
    this.channel.onerror = (e) => this.emit('error', e)
  }

  close(): void {
    this.channel.close()
  }

  send(data: unknown, cb?: () => void): void {
    this.sendBuffer.push([data, cb])
    if (this.sendBuffer.length === 1) {
      this.actualSend()
    }
  }

  private actualSend(): void {
    this.pendingSendTimeout = null

    if (this.channel.readyState !== 'open') {
      return
    }

    while (this.sendBuffer.length) {
      if (this.channel.bufferedAmount > DataChannel.MAX_BUFFER) {
        this.pendingSendTimeout = setTimeout(() => this.actualSend(), 1)
        return
      }

      const [data, cb] = this.sendBuffer[0]!

      try {
        this.channel.send(data as string)
      } catch (e) {
        this.emit('error', new ErrorEvent('error', { error: e }))
        this.pendingSendTimeout = setTimeout(() => this.actualSend(), 1)
        return
      }

      try {
        cb?.()
      } catch (e) {
        console.error('Exception in write callback:', e)
      }

      this.sendBuffer.shift()
    }
  }
}
