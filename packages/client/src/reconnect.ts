import { TypedEventEmitter } from './typed-event-emitter.js'

type ReconnectState = 'initial' | 'connected' | 'reconnect_scheduled' | 'trying_to_reconnect'

interface ReconnectEvents {
  'state_changed': [state: ReconnectState]
  'reconnecting': []
  'gave_up': []
}

export class ReconnectManager extends TypedEventEmitter<ReconnectEvents> {
  state: ReconnectState = 'initial'
  private reconnectFn: () => void
  private reconnectTimeout: number
  private onlineHandler: (() => void) | null = null

  constructor(reconnectFn: () => void, reconnectTimeout = 1000) {
    super()
    this.reconnectFn = reconnectFn
    this.reconnectTimeout = reconnectTimeout
  }

  markConnected() {
    this.state = 'connected'
    this.emit('state_changed', this.state)
  }

  scheduleReconnect() {
    if (this.state !== 'initial' && this.state !== 'reconnect_scheduled') {
      this.state = 'reconnect_scheduled'
      this.emit('state_changed', this.state)

      this.onlineHandler = () => {
        window.removeEventListener('online', this.onlineHandler!)
        this.onlineHandler = null

        if (this.state === 'reconnect_scheduled') {
          this.state = 'trying_to_reconnect'
          this.emit('state_changed', this.state)
          this.emit('reconnecting')
          this.reconnectFn()
        } else if (this.state === 'trying_to_reconnect') {
          setTimeout(() => {
            this.emit('reconnecting')
            this.reconnectFn()
          }, this.reconnectTimeout)
        }
      }

      window.addEventListener('online', this.onlineHandler)
      if (navigator.onLine) {
        window.dispatchEvent(new Event('online'))
      }
    } else {
      this.emit('gave_up')
    }
  }

  destroy() {
    if (this.onlineHandler) {
      window.removeEventListener('online', this.onlineHandler)
      this.onlineHandler = null
    }
  }
}
