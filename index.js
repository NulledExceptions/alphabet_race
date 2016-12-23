let position = {}
let maxWidth = window.innerWidth

// Register event listeners
window.addEventListener('resize', (e) => {maxWidth = e.target.innerWidth})
window.addEventListener ('keydown', moveTruck)
window.addEventListener('load', drawPage)

function once (fn) {
  var called = false
  return function () {
    if (!called) {
      called = true
      fn()
    }
  }
}

function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function pickRandomN (items, n) {
  if (items.length < n) throw new RangeError(`Not enough elemnts to take. Requested: ${n} Available: ${items.length}`)
  selected = new Set()
  while (n) {
    const i = getRandomInt(0, items.length)
    if (!selected.has(items[i])) {
      selected.add(items[i])
      n--
    }
  }
  return Array.from(selected)
}

function getMilestone (letter) {
  return `<div class="milestone">
    <kbd>${letter}</kbd>
    </div>`
}

function getTrack (letter, truck) {
  return `<div class="track">
    ${truck}
    ${getMilestone(letter)}
  </div>`
}

function getLetters (n) {
  const numbers = ['0', '1', '2', '3','4', '5', '6', '7', '8', '9']
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  return pickRandomN(letters.concat(numbers), n)
}

function getTrucks (letters, n) {
  const truckNames = pickRandomN([...Array(46).keys()], n).map(x => `images/trucking-${x}.png`)
  let trucks = []
  for (let i = 0; i < n ; i++) {
    const truck = `<div data-key="${letters[i].charCodeAt(0)}" class="truck"><img src="${truckNames[i]}"/></div>`
    trucks.push(truck)
  }
  return trucks
}

function drawPage () {
  const n = 3
  const letters = getLetters(n)
  const trucks = getTrucks(letters, n)
  const tracks = document.querySelector(".tracks")
  for (let i = 0; i< n; i++) {
    tracks.innerHTML += getTrack(letters[i], trucks[i])
  }
  const domTrucks = document.querySelectorAll(".truck")
}

var rank = 0
function moveTruck (e) {
  // backspace will reload the page.
  if (e.keyCode === 8) window.location.reload(false)
  const truck = document.querySelector(`.truck[data-key="${e.keyCode}"]`)
  if (!truck || truck.classList.contains('finished')) return
  let pos = position[e.keyCode] || 0
  pos += 200
  // Check for victory
  if (pos >= maxWidth - 200) {
    pos = maxWidth - 200
    truck.classList.add('finished')
    truck.addEventListener('transitionend', once(() => {
      rank++
      truck.classList.add('winner')
      truck.innerHTML += `<div class='score'>${rank}</div>`
      truck.style.transform = `translateX(${pos}px)`
    }))
  } else {
    truck.style.transform = `translateX(${pos}px)`
  }
  position[e.keyCode] = pos
}
