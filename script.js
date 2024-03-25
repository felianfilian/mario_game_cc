const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

let jumpForce = 12;
let isGrounded = true;
let doubleJump = true;

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

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
}

const player = new Player();
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 87: // up
      jump();
      break;
    case 65: // left
      break;
    case 83: // down
      break;
    case 68: // right
      break;
    case 32: // space
      jump();
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
