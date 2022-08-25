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
  imageSrc: './img/character/player/Idle.png',
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 180,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/character/player/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/character/player/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/character/player/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/character/player/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/character/player/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/character/player/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/character/player/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 190,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 924,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/character/enemy/Idle.png',
  scale: 2.5,
  framesMax: 4,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/character/enemy/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/character/enemy/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/character/enemy/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/character/enemy/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/character/enemy/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/character/enemy/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/character/enemy/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50
  }
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
    player.switchSprite('run')
  } else if (keys.ArrowRight.pressed && player.lastKey === 'ArrowRight') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  if (rectangularCollision({
        rect1: player,
        rect2: enemy
      }) && player.isAttacking && player.framesCurrent === 4) {
      enemy.takeHit()
      player.isAttacking = false
      document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  if (rectangularCollision({
        rect1: enemy,
        rect2: player
      }) && enemy.isAttacking && enemy.framesCurrent === 1) {
      player.takeHit()
      enemy.isAttacking = false
      document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
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
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case ' ':
        enemy.attack()
        break
    }
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
