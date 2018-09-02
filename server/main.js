const WebSocket = require('ws')
const ws = new WebSocket.Server({port: 3002})

const connections = []

ws.on('connection', (client, req) => {
  console.log('New client connected.')
  connections.push(client)
  client.on('message', data => {
    const username = req.url.split('&username=')[1]
    const mediaTitleString = decodeURIComponent(req.url.split('?mediaTitleString=')[1].split('&')[0])
    console.log('USERNAME: ' + username)
    console.log('MEDIA: ' + mediaTitleString)
    connections.push({
      client,
      username,
      mediaTitleString
    })
    client.send('Welcome! You are watching "' + data.mediaTitleString + '" and are now connected to others wathing the same media.')
  })
})

ws.on('message', data => {
  console.log('Incoming:')
  console.log(data)
  connections.forEach(client => {
    console.log(client)
  })
})
