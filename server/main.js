const WebSocket = require('ws')
const ws = new WebSocket.Server({port: 3002})

const connections = []

ws.on('connection', (client) => {
  console.log('New client connected.')
  connections.push(client)
  client.on('message', data => {
    console.log(data)
    connections.push({
      client,
      username: data.username,
      mediaTitleString: data.mediaTitleString
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
