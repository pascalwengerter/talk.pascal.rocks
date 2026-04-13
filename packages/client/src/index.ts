export * as browser from './browser.js'

export { TypedEventEmitter } from './typed-event-emitter.js'
export { Gum } from './gum.js'
export { Identity } from './identity.js'
export { Peer } from './peer.js'
export { LocalPeer } from './local-peer.js'
export { RemotePeer } from './remote-peer.js'
export { Room } from './room.js'
export { Session } from './session.js'
export { WebSocketChannel } from './web-socket-channel.js'
export { Distributor } from './distributor.js'
export { DataChannel } from './data-channel.js'

// Shared P2P utilities
export { getRemoteIps, getLocalIps, getRelayIps, getMyRelayStatus } from './network-info.js'
export { ReconnectManager } from './reconnect.js'
export { DEFAULTS } from './defaults.js'
export { attachMediaStream, browserCanUseWebrtc } from './media.js'

export type * from './types.js'

// Version info
export const PROTOCOL_NAME = 'palava'
export const PROTOCOL_VERSION = '1.0.0'
export const LIB_VERSION = '4.0.0'
