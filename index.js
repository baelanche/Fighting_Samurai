const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: {
        x: offset.x,
        y: offset.y
      },
      width: 100,
      height: 50
    }
    this.color = color
    this.isAttacking
    this.health = 100
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    if (this.isAttacking) {
      c.fillStyle = 'green'
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  color: 'blue'
})

const enemy = new Sprite({
  position: {
    x: 974,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: -50,
    y: 0
  },
  color: 'red'
})

const keys = {
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
}

function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x && rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y && rect1.attackBox.position.y <= rect2.position.y + rect2.height
  )
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector("#displayText").style.display = "flex"
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Draw"
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player wins"
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Enemy wins"
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId })
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0

  if (keys.ArrowLeft.pressed && player.lastKey === 'ArrowLeft') {
    player.velocity.x = -5
  } else if (keys.ArrowRight.pressed && player.lastKey === 'ArrowRight') {
    player.velocity.x = 5
  }

  if (rectangularCollision({
        rect1: player,
        rect2: enemy
      }) && player.isAttacking) {
      player.isAttacking = false
      enemy.health -= 10
      document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  if (rectangularCollision({
        rect1: enemy,
        rect2: player
      }) && enemy.isAttacking) {
      enemy.isAttacking = false
      player.health -= 10
      document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      player.lastKey = 'ArrowLeft'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      player.lastKey = 'ArrowRight'
      break
    case 'ArrowUp':
      player.velocity.y = -15
      break
    case 'z':
      player.attack()
      //enemy.attack()
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
  }
})
