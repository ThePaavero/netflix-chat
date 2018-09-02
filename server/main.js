const WebSocket = require('ws')
const wss = new WebSocket.Server({port: 3002})

const connections = []

wss.on('connection', (client) => {
  console.log('New client connected.')
  client.on('message', (message) => {
    console.log('received:', JSON.stringify(message))
    connections.push(client, message.mediaTitleString)
    client.send('Welcome!')
  })

  client.send('CONNECTED')
})
