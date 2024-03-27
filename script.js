const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

/////////////////////
// player vars

let jumpForce = 12;
let isGrounded = true;
let doubleJump = true;

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

////////////////////
// Classes

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };

    this.velocity = {
      x: 0,
      y: 1,
    };

    this.width = 30;
    this.height = 30;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
      isGrounded = false;
    } else {
      this.velocity.y = 0;
      isGrounded = true;
      doubleJump = true;
    }
  }
}

class Platform {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 200;
    this.height = 20;
  }
  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

/////////////////////////
// functions

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  // horizontal move
  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else if (keys.left.pressed) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
  }
}

const player = new Player();
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 87: // up
      jump();
      break;
    case 65: // left
      keys.left.pressed = true;
      break;
    case 83: // down
      break;
    case 68: // right
      keys.right.pressed = true;
      break;
    case 32: // space
      jump();
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 87: // up
      // null
      break;
    case 65: // left
      keys.left.pressed = false;
      break;
    case 83: // down
      break;
    case 68: // right
      keys.right.pressed = false;
      break;
    case 32: // space
      //null
      break;
  }
});

function jump() {
  if (isGrounded) {
    player.velocity.y -= jumpForce;
  } else if (doubleJump) {
    player.velocity.y -= jumpForce;
    doubleJump = false;
  }
}
