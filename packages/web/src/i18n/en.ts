export default {
  closeAlt: 'close',
  moreInfoTitle: 'More info',
  moreInfoAlt: 'More info',
  switchLanguageTitle: 'Switch language',
  switchTheme: 'Switch theme',
  home: {
    subtitle: 'Peer-to-peer encrypted video calls. No sign-up, no tracking.',
    createRoom: 'Create Room',
    or: 'or join an existing room',
    join: 'Join',
    roomIdPlaceholder: 'Room name',
    about: 'About',
    back: 'Back',
    noSupportMessage: `
      Your browser does not support WebRTC, which is required for video calls.<br/><br/>
      Please use a modern browser like Firefox or Chrome.
    `,
  },
  room: {
    emptyTitle: 'Meeting Room',
    errorFullHeading: 'Room is full',
    errorFullDescription: 'The maximum number of participants has been reached.',
    errorMaintenanceHeading: 'Server maintenance',
    errorMaintenanceDescription: 'The server is undergoing maintenance. Please try again shortly.',
    errorConnectionHeading: 'Connection failed',
    errorConnectionDescription: 'Could not connect to the server. Check your internet connection and try again.',
    tryAgain: 'Try again',
    goHome: 'Go home',
    gumChooseMedia: 'How would you like to join?',
    gumChoiceVideoAndAudio: 'Video & Audio',
    gumChoiceVideo: 'Video only',
    gumChoiceAudio: 'Audio only',
    gumErrorReasons: `
      <p>Possible reasons:</p>
      <ul>
        <li>You denied camera/microphone access. Click one of the buttons above to try again.</li>
        <li>You previously blocked this site from accessing your camera. Unblock it in your browser settings (usually the camera icon in the address bar).</li>
        <li>Another application is using the camera. Close it and try again.</li>
      </ul>
    `,
    gumErrorHeading: 'Could not access camera or microphone',
    gumHeading: 'Join this room',
    gumIntro: `
      You'll be connected directly to everyone else in this room via peer-to-peer WebRTC.
      Your IP address is shared with other participants to establish the connection.
    `,
    waitingForUserMedia: 'Requesting media access...',
    waitingForRoomServer: 'Connecting to server...',
  },
  party: {
    toggleControls: 'Toggle controls',
    infoTitle: 'Info',
    copyLinkTitle: 'Share room link',
    turnOffCameraTitle: 'Turn off camera',
    turnOnCameraTitle: 'Turn on camera',
    muteMicrophoneTitle: 'Mute',
    unmuteMicrophoneTitle: 'Unmute',
    screenShareTitle: 'Share screen',
    chatTitle: 'Chat',
    hangUpTitle: 'Leave',
  },
  peer: {
    toggleEnlargeTitle: 'Enlarge',
    toggleMinimizeTitle: 'Minimize',
    fullScreenTitle: 'Full screen',
    networkInfoTitle: 'Network info',
    muteAudioTitle: 'Mute',
    unmuteAudioTitle: 'Unmute',
    placeholderAlt: '{color} placeholder',
    errorConnectionClosed: 'Connection closed',
    errorConnectionFailed: 'No connection',
    errorConnectionDisconnected: 'Disconnected',
    noMedia: 'No media',
    cameraOff: 'Camera off',
    waiting: 'Connecting...',
    presenceOnline: 'Online',
    presenceAway: 'Away',
    presenceOffline: 'Offline',
  },
  networkInfo: {
    directConnection: 'Direct connection',
    relayedConnection: 'Relayed connection',
    remoteIps: 'Remote IPs',
    localIps: 'Your IPs',
    ipIsRelay: 'relay',
    unknownConnection: 'Unknown',
  },
  chat: {
    title: 'Chat',
    placeholder: 'Type a message...',
    send: 'Send',
    empty: 'No messages yet',
  },
  infoPages: [
    {
      id: 'about',
      title: 'About',
      content: `
        <h2>About</h2>
        <p>
          This is a peer-to-peer video chat application. Calls are established directly between
          participants using WebRTC — no video data passes through any server.
        </p>
        <p>
          Built with <a href="https://palava.tv" target="_blank">palava.tv</a> open-source technology.
        </p>
      `,
    },
    {
      id: 'contact',
      title: 'Contact',
      content: `
        <h2>Contact</h2>
        <p>Contact details here.</p>
      `,
    },
    {
      id: 'network',
      linked: false,
      title: 'Network',
      content: `
        <h2>Connection Type</h2>
        <p>There are two connection modes:</p>
        <ul>
          <li><strong>Direct:</strong> Your device connects directly to the other device.</li>
          <li><strong>Relayed:</strong> Data is routed through a TURN relay server. The relay cannot read your data.</li>
        </ul>
        <h2>IP Addresses</h2>
        <p>
          To establish a connection, both parties exchange IP addresses, including local network addresses.
          IPs can be IPv4 (X.X.X.X) or IPv6 format.
        </p>
      `,
    },
    {
      id: 'not-found',
      linked: false,
      title: 'Not Found',
      content: `
        <h2>Not Found</h2>
        <p>This page doesn't exist.</p>
      `,
    },
  ],
}
