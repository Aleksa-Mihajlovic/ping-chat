export const ME = { id: 'me', name: 'Aleksa Jović' }

export const CHATS = [
  { id: '1', type: 'direct', name: 'Ana Petrović',    lastMessage: 'Vidimo se sutra!',                    lastTime: '14:32', unread: 2, online: true  },
  { id: '2', type: 'direct', name: 'Marko Nikolić',   lastMessage: 'Jesi video utakmicu?',                lastTime: 'Juče',  unread: 0, online: false },
  { id: '3', type: 'direct', name: 'Jovana Milić',    lastMessage: 'Hvala na pomoći 😊',                  lastTime: 'Juče',  unread: 0, online: true  },
  { id: '4', type: 'direct', name: 'Stefan Đorđević', lastMessage: 'Ok, sutra se čujemo',                 lastTime: 'Pon',   unread: 1, online: false },
  { id: '5', type: 'group',  name: 'Dev Tim 🚀',       lastMessage: 'Jovana: PR je spreman za review',     lastTime: '10:00', unread: 5, members: ['Ana Petrović', 'Marko Nikolić', 'Jovana Milić', 'Stefan Đorđević'] },
  { id: '6', type: 'group',  name: 'Porodica ❤️',      lastMessage: 'Mama: Dođi na ručak u 2',             lastTime: 'Sub',   unread: 0, members: ['Mama', 'Tata', 'Sestra'] },
  { id: '7', type: 'direct', name: 'Nikola Stanković', lastMessage: 'Šaljem ti fajl večeras',             lastTime: 'Sub',   unread: 0, online: false },
  { id: '8', type: 'direct', name: 'Milica Vasić',    lastMessage: 'Super! 👍',                           lastTime: 'Pet',   unread: 0, online: true  },
]

export const MESSAGES = {
  '1': [
    { id: 1, from: '1',  text: 'Zdravo! Kako si?',                       time: '14:20', status: 'read'      },
    { id: 2, from: 'me', text: 'Super, hvala! A ti?',                    time: '14:21', status: 'read'      },
    { id: 3, from: '1',  text: 'I ja odlično! Hoćeš sutra na kafu?',     time: '14:25', status: 'read'      },
    { id: 4, from: 'me', text: 'Naravno, u 10h?',                        time: '14:28', status: 'read'      },
    { id: 5, from: '1',  text: 'Savršeno! Vidimo se sutra!',             time: '14:32', status: 'delivered' },
  ],
  '2': [
    { id: 1, from: '2',  text: 'Brate, jesi gledao utakmicu sinoć?',                  time: '22:15', status: 'read' },
    { id: 2, from: 'me', text: 'Nisam, šta se desilo?',                               time: '22:20', status: 'read' },
    { id: 3, from: '2',  text: 'Neverovatan meč, 3-2 u poslednjoj minuti!',           time: '22:21', status: 'read' },
    { id: 4, from: 'me', text: 'Ma ne budi mi! Gledam highlights odmah',              time: '22:22', status: 'read' },
    { id: 5, from: '2',  text: 'Jesi video utakmicu?',                                time: 'Juče',  status: 'read' },
  ],
  '3': [
    { id: 1, from: 'me', text: 'Evo ga PR link: github.com/ping-chat', time: '09:00', status: 'read' },
    { id: 2, from: '3',  text: 'Super, gledam odmah!',                  time: '09:05', status: 'read' },
    { id: 3, from: '3',  text: 'Sve izgleda dobro, samo jedan komentar', time: '09:30', status: 'read' },
    { id: 4, from: 'me', text: 'Izmenio sam, provjeri opet',            time: '09:45', status: 'read' },
    { id: 5, from: '3',  text: 'Hvala na pomoći 😊',                    time: '10:00', status: 'read' },
  ],
  '4': [
    { id: 1, from: '4',  text: 'Hej, možemo li se naći?',       time: 'Pon 15:00', status: 'read'      },
    { id: 2, from: 'me', text: 'Naravno, kad ti odgovara?',      time: 'Pon 15:05', status: 'read'      },
    { id: 3, from: '4',  text: 'Ok, sutra se čujemo',            time: 'Pon 15:10', status: 'delivered' },
  ],
  '5': [
    { id: 1, from: '3',  senderName: 'Jovana', text: 'Jutro svima! ☀️',                  time: '08:00', status: 'read'      },
    { id: 2, from: '2',  senderName: 'Marko',  text: 'Jutro! Ima li šta novo?',           time: '08:05', status: 'read'      },
    { id: 3, from: 'me',                        text: 'Deploy je prošao uspješno 🎉',      time: '09:00', status: 'read'      },
    { id: 4, from: '1',  senderName: 'Ana',    text: 'Super vijest! 🚀',                  time: '09:01', status: 'read'      },
    { id: 5, from: '3',  senderName: 'Jovana', text: 'PR je spreman za review',           time: '10:00', status: 'delivered' },
  ],
  '6': [
    { id: 1, from: 'mama', senderName: 'Mama', text: 'Sinko, kako si?',          time: 'Sub 11:00', status: 'read' },
    { id: 2, from: 'me',                        text: 'Dobro mama, radim!',       time: 'Sub 11:30', status: 'read' },
    { id: 3, from: 'mama', senderName: 'Mama', text: 'Dođi na ručak u 2',        time: 'Sub 12:00', status: 'read' },
  ],
  '7': [
    { id: 1, from: 'me', text: 'Hej Nikola, trebam onaj fajl',  time: 'Sub 10:00', status: 'read' },
    { id: 2, from: '7',  text: 'Šaljem ti fajl večeras',        time: 'Sub 10:05', status: 'read' },
  ],
  '8': [
    { id: 1, from: '8',  text: 'Vidjela sam prezentaciju, odlično!', time: 'Pet 16:00', status: 'read' },
    { id: 2, from: 'me', text: 'Hvala, puno truda smo uložili',      time: 'Pet 16:10', status: 'read' },
    { id: 3, from: '8',  text: 'Super! 👍',                          time: 'Pet 16:15', status: 'read' },
  ],
}
