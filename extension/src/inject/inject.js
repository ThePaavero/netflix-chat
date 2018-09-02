const Extension = function() {

  const serverBaseUrl = 'localhost:3002/'

  let mediaId = null
  let mediaTitleString = null

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
  }

  const tick = () => {
    mediaId = getMediaId()
    mediaTitleString = getMediaTitleString()
    console.log(mediaId)
    console.log(mediaTitleString)
    if (!mediaId || !mediaTitleString) {
      setTimeout(tick, 100)
      return false
    }
    connectToChat(mediaId, mediaTitleString)
    return true
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
