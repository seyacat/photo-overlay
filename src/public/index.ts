if (false) import math from "mathjs";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let imageLoader: HTMLInputElement | null;

interface Item {
  id: number;
  img: HTMLImageElement;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  selected?: boolean;
}

const array = [
  [2, 0],
  [-1, 3],
]; // Array
const matrix = math.matrix([
  [7, 1],
  [-2, 3],
]); // Matrix

// perform a calculation on an array and matrix
math.map(array, math.square); // Array,  [[4, 0], [1, 9]]
math.map(matrix, math.square); // Matrix, [[49, 1], [4, 9]]

// perform calculations with mixed array and matrix input
math.add(array, matrix); // Matrix, [[9, 1], [-3, 6]]
math.multiply(array, matrix); // Matrix, [[14, 2], [-13, 8]]

// create a matrix. Type of output of function ones is determined by the
// configuration option `matrix`
math.ones(2, 3);

let items: Item[] = [];

const resolution = { width: 1024, height: 1024 };
const main = () => {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = resolution.width;
  canvas.height = resolution.height;
  resizeCanvas();
  ctx = canvas.getContext("2d");

  //Listeners
  canvas.addEventListener("touchstart", touchstart);
  canvas.addEventListener("touchmove", touchmove);
  canvas.addEventListener("touchend", touchend);

  //LOAD OBJECTS
  const corona = new Image();
  corona.src = "public/corona.png";
  addItem({
    id: 1,
    img: corona,
    x: 0,
    y: 0,
    w: resolution.width,
    h: resolution.height,
    z: 100,
  });
  corona.onload = () => {
    refreshCanvas();
  };

  imageLoader = document.getElementById("imageLoader") as HTMLInputElement;
  imageLoader?.addEventListener("change", handleImage, false);

  if (localStorage.getItem("image")) {
    showLoadedImage();
  }
};
function handleImage(e: any) {
  var reader = new FileReader();
  reader.onload = function (event) {
    localStorage.setItem("image", `${event?.target?.result}`);
    showLoadedImage();
  };

  reader.readAsDataURL(e.target.files[0]);
}

function showLoadedImage() {
  var img = new Image();
  img.onload = function () {
    const aspect = img.width / img.height;
    const h = resolution.width / aspect;
    addItem({
      id: 2,
      img: img,
      x: 0,
      y: (resolution.height - h) / 2,
      w: resolution.width,
      h: resolution.width / aspect,
      z: 1,
      selected: true,
    });
  };
  img.src = `${localStorage.getItem("image")}`;
}

const resizeCanvas = () => {
  const { width } = canvas.getBoundingClientRect();
  canvas.style.height = width + "px";
};

const addItem = (newItem: Item) => {
  const existentItem = items.find((item) => item.id === newItem.id);
  if (existentItem) {
    items.splice(items.indexOf(existentItem), 1);
  }
  items.push(newItem);
  sortItems();
  refreshCanvas();
};
const sortItems = () => {
  items.sort((a, b) => {
    return a.z - b.z;
  });
};
const refreshCanvas = () => {
  ctx?.clearRect(0, 0, resolution.width, resolution.height);
  for (const item of items) {
    ctx?.drawImage(item.img, item.x, item.y, item.w, item.h);
  }
  //showLoadedImage();
};

//CANVAS LISTENERS
const touchstart = (e: TouchEvent) => {
  console.log("touchstart", e.touches);
};

const touchmove = (e: TouchEvent) => {
  console.log("touchmove", e.touches);

  const selectItem = items.find((item) => {
    return item.selected;
  });
};

const touchend = (e: TouchEvent) => {
  console.log("touchend", e.touches);
};

window.onload = main;
window.onresize = resizeCanvas;
