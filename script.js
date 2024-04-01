const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

const levelCollider = {
  start: -100,
  end: 2050,
};

init();

/////////////////////
// player vars

let jumpForce = 12;
let isGrounded = true;
let doubleJump = true;

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
      console.log("DEATH");
      setTimeout(() => {
        this.position.x = 100;
        this.position.y = 100;
      }, 1000);
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.img = image;
    this.width = 401;
    this.height = 80;
    this.position = {
      x,
      y: canvas.height - this.height - y,
    };
  }
  draw() {
    c.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

class GenericObjects {
  constructor({ x, y, width, height, image }) {
    this.img = image;
    this.width = width;
    this.height = height;
    this.position = {
      x,
      y,
    };
  }
  draw() {
    c.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

// variables

const imgPlatform = "./assets/platform.png";
const imgHills = "./assets/hills.png";
const imgBackground = "./assets/background.png";

let scrollOffset = 0;

/////////////////////////
// functions

function init() {
  scrollOffset = 0;

  player = new Player();

  isGrounded = true;
  doubleJump = true;

  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };

  backgroundFixed = new GenericObjects({
    x: 0,
    y: -1,
    width: canvas.width,
    height: canvas.height + 2,
    image: createImage(imgBackground),
  });

  backgroundParallax = [
    new GenericObjects({
      x: 0,
      y: canvas.height - 500,
      width: 6000,
      height: 500,
      image: createImage(imgHills),
    }),
  ];

  platforms = [
    new Platform({ x: -400, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 0, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 400, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 1000, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 1600, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 2000, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 2400, y: 0, image: createImage(imgPlatform) }),
    new Platform({ x: 2800, y: 0, image: createImage(imgPlatform) }),
  ];

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  // loop trough platforms
  backgroundFixed.draw();
  backgroundParallax.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();
  // horizontal move
  if (
    keys.right.pressed &&
    player.position.x + player.width < canvas.width - 300
  ) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 150) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed && scrollOffset < levelCollider.end) {
      scrollOffset += 5;
      moveObject(platforms, -5);
      moveObject(backgroundParallax, -2);
    } else if (keys.left.pressed && scrollOffset > levelCollider.start) {
      scrollOffset -= 5;
      moveObject(platforms, 5);
      moveObject(backgroundParallax, 2);
    }
  }

  checkCollission();

  winCheck();
}

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

function moveObject(objectToMove, moveAmount) {
  objectToMove.forEach((genericObject) => {
    genericObject.position.x += moveAmount;
  });
}

function checkCollission() {
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      isGrounded = true;
      doubleJump = true;
    }
  });
}

function winCheck() {
  if (scrollOffset >= 2000) {
    console.log("you win");
  }
}

function jump() {
  if (isGrounded) {
    player.velocity.y -= jumpForce;
  } else if (doubleJump) {
    player.velocity.y -= jumpForce;
    doubleJump = false;
  }
}

function createImage(path) {
  const image = new Image();
  image.src = path;
  return image;
}
