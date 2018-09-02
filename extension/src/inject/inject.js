const Extension = function() {

  const serverBaseUrl = 'ws://localhost:3002/'

  let mediaId = null
  let mediaTitleString = null
  let socketConnection = null

  const getMediaId = () => {
    return window.location.href.split('/')[4].split('?')[0]
  }

  const getMediaTitleString = () => {
    const element = document.querySelector('.video-title')
    if (element) {
      return element.innerText
    }
    return null
  }

  const connectToChat = (mediaId, mediaTitleString) => {
    console.log(mediaId, mediaTitleString)
    console.log('Connecting to chat...')
    socketConnection = new WebSocket(serverBaseUrl + 'connect')
    socketConnection.onopen = (e) => {
      socketConnection.send({
        name: 'Some user',
        mediaId,
        mediaTitleString
      })
    }
    socketConnection.onmessage = (e) => {
      const response = e.data
      console.log('Socket sent message:')
      console.log(response)
    }
  }

  const tick = () => {
    mediaId = getMediaId()
    mediaTitleString = getMediaTitleString()
    console.log(mediaId)
    console.log(mediaTitleString)
    if (!mediaId || !mediaTitleString) {
      setTimeout(tick, 100)
      return
    }
    connectToChat(mediaId, mediaTitleString)
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
