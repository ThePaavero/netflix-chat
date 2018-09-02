const WebSocket = require('ws')
const ws = new WebSocket.Server({port: 3002})

const clientsPool = []

ws.on('connection', (client, req) => {
  console.log('New client connected.')
  const username = req.url.split('&username=')[1]
  const mediaTitleString = decodeURIComponent(req.url.split('?mediaTitleString=')[1].split('&')[0])
  console.log('USERNAME: ' + username)
  console.log('MEDIA: ' + mediaTitleString)
  const clientObject = {
    client,
    username,
    mediaTitleString
  }
  clientsPool.push(clientObject)
  clientObject.client.on('message', data => {
    reactToUserMessage(clientObject, data)
  })
  clientObject.client.on('close', () => {
    removeClientObjectFromPool(clientObject)
  })
})

const removeClientObjectFromPool = (clientObject) => {
  const targetClient = clientsPool.filter(o => o.username === clientObject.username)[0]
  const index = clientsPool.indexOf(targetClient)
  clientsPool.splice(index, 1)
  console.log('Removed "' + clientObject.username + '" from pool.')
}

const reactToUserMessage = (actingClient, data) => {
  data = JSON.parse(data)
  clientsPool.filter(c => c.mediaTitleString === actingClient.mediaTitleString).forEach(clientObject => {
    clientObject.client.send(JSON.stringify({
      type: 'userMessage',
      username: clientObject.username,
      message: data.message
    }))
  })
}
