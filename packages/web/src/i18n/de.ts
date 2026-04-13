export default {
  closeAlt: 'Schliessen',
  moreInfoTitle: 'Mehr erfahren',
  moreInfoAlt: 'Mehr erfahren',
  switchLanguageTitle: 'Sprache umschalten',
  switchTheme: 'Farbschema wechseln',
  home: {
    subtitle: 'Peer-to-Peer verschluesselte Videoanrufe. Ohne Anmeldung, ohne Tracking.',
    createRoom: 'Raum erstellen',
    or: 'oder einem bestehenden Raum beitreten',
    join: 'Beitreten',
    roomIdPlaceholder: 'Raumname',
    about: 'Info',
    back: 'Zurueck',
    noSupportMessage: `
      Dein Browser unterstuetzt kein WebRTC, das fuer Videoanrufe benoetigt wird.<br/><br/>
      Bitte verwende einen modernen Browser wie Firefox oder Chrome.
    `,
  },
  room: {
    emptyTitle: 'Meetingraum',
    errorFullHeading: 'Raum ist voll',
    errorFullDescription: 'Die maximale Teilnehmerzahl ist erreicht.',
    errorMaintenanceHeading: 'Serverwartung',
    errorMaintenanceDescription: 'Der Server wird gewartet. Bitte versuche es gleich noch einmal.',
    errorConnectionHeading: 'Verbindung fehlgeschlagen',
    errorConnectionDescription: 'Verbindung zum Server konnte nicht hergestellt werden. Pruefe deine Internetverbindung.',
    tryAgain: 'Erneut versuchen',
    goHome: 'Startseite',
    gumChooseMedia: 'Wie moechtest du beitreten?',
    gumChoiceVideoAndAudio: 'Video & Audio',
    gumChoiceVideo: 'Nur Video',
    gumChoiceAudio: 'Nur Audio',
    gumErrorReasons: `
      <p>Moegliche Gruende:</p>
      <ul>
        <li>Du hast den Zugriff verweigert. Druecke einen der obigen Knoepfe, um es erneut zu versuchen.</li>
        <li>Du hast den Kamera-Zugriff frueher blockiert. Hebe die Blockierung in den Browsereinstellungen auf.</li>
        <li>Ein anderes Programm verwendet die Kamera. Schliesse es und versuche es erneut.</li>
      </ul>
    `,
    gumErrorHeading: 'Zugriff auf Kamera oder Mikrofon nicht moeglich',
    gumHeading: 'Diesem Raum beitreten',
    gumIntro: `
      Du wirst per Peer-to-Peer WebRTC direkt mit allen anderen im Raum verbunden.
      Deine IP-Adresse wird mit anderen Teilnehmern geteilt, um die Verbindung herzustellen.
    `,
    waitingForUserMedia: 'Medienzugriff wird angefragt...',
    waitingForRoomServer: 'Verbindung zum Server wird hergestellt...',
  },
  party: {
    toggleControls: 'Bedienelemente umschalten',
    infoTitle: 'Info',
    copyLinkTitle: 'Raumlink teilen',
    turnOffCameraTitle: 'Kamera abschalten',
    turnOnCameraTitle: 'Kamera anschalten',
    muteMicrophoneTitle: 'Stummschalten',
    unmuteMicrophoneTitle: 'Mikrofon anschalten',
    screenShareTitle: 'Bildschirm teilen',
    chatTitle: 'Chat',
    hangUpTitle: 'Verlassen',
  },
  peer: {
    toggleEnlargeTitle: 'Vergroessern',
    toggleMinimizeTitle: 'Verkleinern',
    fullScreenTitle: 'Vollbild',
    networkInfoTitle: 'Netzwerkinfo',
    muteAudioTitle: 'Stummschalten',
    unmuteAudioTitle: 'Lautschalten',
    placeholderAlt: '{color} Platzhalter',
    errorConnectionClosed: 'Verbindung geschlossen',
    errorConnectionFailed: 'Keine Verbindung',
    errorConnectionDisconnected: 'Getrennt',
    noMedia: 'Keine Medien',
    cameraOff: 'Kamera aus',
    waiting: 'Verbinde...',
    presenceOnline: 'Online',
    presenceAway: 'Abwesend',
    presenceOffline: 'Offline',
  },
  networkInfo: {
    directConnection: 'Direktverbindung',
    relayedConnection: 'Verbindung ueber Relay',
    remoteIps: 'Ferne IPs',
    localIps: 'Deine IPs',
    ipIsRelay: 'Relay',
    unknownConnection: 'Unbekannt',
  },
  chat: {
    title: 'Chat',
    placeholder: 'Nachricht eingeben...',
    send: 'Senden',
    empty: 'Noch keine Nachrichten',
  },
  infoPages: [
    {
      id: 'about',
      title: 'Info',
      content: `
        <h2>Info</h2>
        <p>
          Dies ist eine Peer-to-Peer Videochat-Anwendung. Anrufe werden direkt zwischen
          Teilnehmern ueber WebRTC hergestellt — keine Videodaten laufen ueber einen Server.
        </p>
        <p>
          Basiert auf <a href="https://palava.tv" target="_blank">palava.tv</a> Open-Source-Technologie.
        </p>
      `,
    },
    {
      id: 'contact',
      title: 'Kontakt',
      content: `
        <h2>Kontakt</h2>
        <p>Kontaktinformationen hier eintragen.</p>
      `,
    },
    {
      id: 'network',
      linked: false,
      title: 'Netzwerk',
      content: `
        <h2>Verbindungstyp</h2>
        <p>Es gibt zwei Verbindungsmodi:</p>
        <ul>
          <li><strong>Direkt:</strong> Dein Geraet verbindet sich direkt mit dem anderen Geraet.</li>
          <li><strong>Relay:</strong> Daten werden ueber einen TURN-Relay-Server geleitet. Der Relay kann deine Daten nicht lesen.</li>
        </ul>
        <h2>IP-Adressen</h2>
        <p>
          Um eine Verbindung herzustellen, tauschen beide Seiten IP-Adressen aus, einschliesslich lokaler Netzwerkadressen.
          IPs koennen im IPv4- (X.X.X.X) oder IPv6-Format vorliegen.
        </p>
      `,
    },
    {
      id: 'not-found',
      linked: false,
      title: 'Nicht gefunden',
      content: `
        <h2>Nicht gefunden</h2>
        <p>Diese Seite existiert nicht.</p>
      `,
    },
  ],
}
