const NetflixFixer = function() {

  let cards = []

  const tick = () => {
    console.log('Tick.', cards)
    cards = Array.from(document.querySelectorAll('.rowContainer_title_card'))
  }

  const init = () => {
    // tick()
    // setInterval(tick, 5000)
  }

  return {
    init
  }
}

chrome.extension.sendMessage({}, () => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)
      const netflixFixer = new NetflixFixer()
      netflixFixer.init()
    }
  }, 10)
})
