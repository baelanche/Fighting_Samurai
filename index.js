const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/decorations/shop_anim.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
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

const enemy = new Fighter({
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

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
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
