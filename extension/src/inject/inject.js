const Extension = function() {

  const serverBaseUrl = 'ws://localhost:3002/'
  const username = 'Pekka'

  let mediaId = null
  let mediaTitleString = null
  let socketConnection = null
  const outputRows = []

  const createChatBox = () => {
    const chatElement = document.createElement('div')
    chatElement.id = 'netflix-chat-box'
    chatElement.innerHTML = `
      <div class="netflix-chat-messages-container">
        <p>Initiating chat, just a second...</p>
      </div>
      <form id="netflix-chat-box-prompt-form">
        <input type="text" id="netflix-chat-box-prompt-form-text-field" autocomplete="off" required/>      
      </form>
    `
    document.body.append(chatElement)
  }

  const updateChatBox = () => {
    document.querySelector('.netflix-chat-messages-container').innerHTML = outputRows.join('<br/>')
  }

  const getMediaId = () => {
    return window.location.href.split('/')[4].split('?')[0]
  }

  const getMediaTitleString = () => {
    const element = document.querySelector('.video-title')
    if (element) {
      return element.innerText.trim()
    }
    return null
  }

  const sendChatMessage = (message) => {
    if (!socketConnection) {
      return console.warn('Could not send message, no connection available.')
    }
    socketConnection.send(JSON.stringify({
      type: 'message',
      message
    }))
  }

  const receiveMessageFromServer = (message) => {
    message = JSON.parse(message)
    console.log('SERVER SAYS:')
    console.log(message)
    outputRows.push(`
      <div class="row">
        <span class="username">${message.username}</span>:
        <span class="message">${message.message}</span>
      </div>
    `)
    updateChatBox()
  }

  const connectToChat = (mediaId, mediaTitleString) => {
    console.log(mediaId, mediaTitleString)
    console.log('Connecting to chat...')
    socketConnection = new WebSocket(serverBaseUrl + 'connect?mediaTitleString=' + encodeURIComponent(mediaTitleString) + '&username=' + encodeURIComponent(username))
    socketConnection.onopen = () => {
      console.log('Connected to chat server.')
      socketConnection.onmessage = (e) => {
        receiveMessageFromServer(e.data)
      }
      sendChatMessage(`Hello!`)
    }
  }

  const listenToChatPrompt = () => {
    const promptField = document.querySelector('#netflix-chat-box-prompt-form-text-field')
    const form = document.querySelector('#netflix-chat-box-prompt-form')
    form.addEventListener('submit', e => {
      e.preventDefault()
      const messageToSend = promptField.value.trim()
      const messageTrimmed = messageToSend.trim()
      if (messageTrimmed === '') {
        return
      }
      sendChatMessage(messageTrimmed)
      promptField.value = ''
    })
  }

  const tick = () => {
    mediaId = getMediaId()
    mediaTitleString = getMediaTitleString()
    if (!mediaId || !mediaTitleString) {
      setTimeout(tick, 100)
      return
    }
    connectToChat(mediaId, mediaTitleString)
    createChatBox()
    listenToChatPrompt()
  }

  const init = () => {
    console.log('Netflix Chat is enabled.')
    tick()
  }

  return {
    init
  }
}

chrome.extension.sendMessage({}, () => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)
      const netflixFixer = new Extension()
      netflixFixer.init()
    }
  }, 10)
})
