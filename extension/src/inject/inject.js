const Extension = function() {

  let mediaId = null
  let mediaTitleString = null

  const getMediaId = () => {
    return window.location.href.split('/')[4].split('?')[0]
  }

  const getMediaTitleString = () => {
    return document.querySelector('.video-title').innerText
  }

  const tick = () => {
    mediaId = getMediaId()
    mediaTitleString = getMediaTitleString()
    console.log(mediaId)
    console.log(mediaTitleString)
  }

  const init = () => {
    console.log('Netflix Chat is enabled.')
    setTimeout(tick, 5000)
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
