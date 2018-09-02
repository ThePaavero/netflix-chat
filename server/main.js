const WebSocket = require('ws')
const ws = new WebSocket.Server({port: 3002})

const clientsPool = []

ws.on('connection', (client, req) => {
  console.log('New client connected.')
  client.username = req.url.split('&username=')[1]
  client.mediaTitleString = decodeURIComponent(req.url.split('?mediaTitleString=')[1].split('&')[0])
  console.log('USERNAME: ' + client.username)
  console.log('MEDIA: ' + client.mediaTitleString)
  client.send('Welcome! You are watching "' + client.mediaTitleString + '" and are now connected to others watching the same media.')
  clientsPool.push(client)
  client.on('message', data => {
    reactToUserMessage(client, data)
  })
})

const reactToUserMessage = (actingClient, data) => {
  data = JSON.parse(data)
  console.log(actingClient.username + ' says "' + data.message + '"')
  clientsPool.filter(c => c.mediaTitleString === actingClient.mediaTitleString).forEach(client => {
    client.send(JSON.stringify({
      type: 'userMessage',
      username: actingClient.username,
      message: data.message
    }))
  })
}
