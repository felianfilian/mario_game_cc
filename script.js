const canvas = document.querySelector("canvas");
const c = canvas.getContext("2D");

class Player {
  cosntructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.width = 100;
    this.height = 100;
  }
}
