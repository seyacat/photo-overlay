import matrix from "../lib/arrayMatrix";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let imageLoader: HTMLInputElement | null;

let onDrag = false;
let pointerId: number | null = null;

interface Item {
  id: number;
  img: HTMLImageElement;
  position: { x: number; y: number };
  w: number;
  h: number;
  z: number;
  selected?: boolean;
}

interface Matrix {
  prod: (matrix: number[]) => number[];
}

let canvasTransformMatrix = matrix.indentity(2);

let items: Item[] = [];

const resolution = { width: 1024, height: 1024 };
const main = () => {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = resolution.width;
  canvas.height = resolution.height;
  resizeCanvas();
  ctx = canvas.getContext("2d");

  //Listeners
  canvas.addEventListener("pointerdown", pointerdown);
  canvas.addEventListener("pointermove", pointermove);
  canvas.addEventListener("pointerup", pointerup);

  //LOAD OBJECTS
  const corona = new Image();
  corona.src = "public/marcob.png";
  addItem({
    id: 1,
    img: corona,
    position: { x: 0, y: 0 },
    w: resolution.width,
    h: resolution.height,
    z: 100,
  });

  const sample = new Image();
  sample.src = "public/sample.png";
  addItem({
    id: 2,
    img: sample,
    position: { x: 0, y: 0 },
    w: resolution.width,
    h: resolution.height,
    z: 1,
  });

  corona.onload = () => {
    refreshCanvas();
  };

  document.getElementById("takePhotoButton")?.addEventListener(
    "click",
    () => {
      document.getElementById("photoLoader")?.click();
    },
    false
  );

  document.getElementById("openPhotoButton")?.addEventListener(
    "click",
    () => {
      document.getElementById("imageLoader")?.click();
    },
    false
  );

  document.getElementById("downloadPhotoButton")?.addEventListener(
    "click",
    () => {
      downloadCanvasAsImage();
    },
    false
  );

  imageLoader = document.getElementById("imageLoader") as HTMLInputElement;
  imageLoader?.addEventListener("change", handleImage, false);

  if (localStorage.getItem("image")) {
    showLoadedImage();
  }
};

const handleImage = (e: any) => {
  var reader = new FileReader();
  reader.onload = function (event) {
    showLoadedImage(`${event?.target?.result}`);
  };

  reader.readAsDataURL(e.target.files[0]);
};

const downloadCanvasAsImage = () => {
  var link = document.createElement("a");
  link.download = `DiaCorazon${new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "")}.png`;
  link.href = canvas.toDataURL();
  link.click();
};

function showLoadedImage(strImage: string | null = null) {
  var img = new Image();
  img.onload = function () {
    const aspect = img.width / img.height;
    let w = resolution.width;
    let h = resolution.height;
    if (img.width > img.height) {
      w = h * aspect;
    } else {
      h = w / aspect;
    }

    addItem({
      id: 2,
      img: img,
      position: { x: 0, y: (resolution.height - h) / 2 },
      w,
      h,
      z: 1,
      selected: true,
    });
  };
  if (strImage) {
    img.src = strImage;
  }
  //img.src = localStorage.getItem("image") + "";
}

const resizeCanvas = () => {
  const { width } = canvas.getBoundingClientRect();
  const height = width;
  canvas.style.height = height + "px";
  const sx = resolution.width / width;
  const sy = resolution.height / height;
  canvasTransformMatrix = [
    [sx, 0],
    [0, sy],
  ];
  console.log({ canvasTransformMatrix });
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
  if (!ctx) return;
  ctx.fillStyle = "white";
  ctx?.clearRect(0, 0, resolution.width, resolution.height);
  ctx.fillRect(0, 0, resolution.width, resolution.height);
  for (const item of items) {
    ctx?.drawImage(item.img, item.position.x, item.position.y, item.w, item.h);
  }
};

//CANVAS LISTENERS
const pointerdown = (e: PointerEvent) => {
  onDrag = true;
  pointerId = e.pointerId;
  e.preventDefault();
};

const pointermove = (e: PointerEvent) => {
  e.preventDefault();

  if (!ctx || !onDrag || pointerId !== e.pointerId) return;
  console.log("pointermove", e);

  const position = (
    matrix.multiply(canvasTransformMatrix, [
      [e.offsetX],
      [e.offsetY],
    ]) as number[]
  ).map((x) => x[0]);

  const delta = (
    matrix.multiply(canvasTransformMatrix, [
      [e.movementX],
      [e.movementY],
    ]) as number[]
  ).map((x) => x[0]);

  console.log({ canvasTransformMatrix, delta });

  ctx.fillStyle = "red";
  ctx.fillRect(position[0] - 10, position[1] - 10, 21, 21);
  const selectItem = items.find((item) => {
    return item.selected;
  });
  if (selectItem) {
    selectItem.position.x = selectItem.position.x + delta[0];
    selectItem.position.y = selectItem.position.y + delta[1];
    refreshCanvas();
  }
};

const pointerup = (e: PointerEvent) => {
  onDrag = false;
  e.preventDefault();
  console.log("pointerup");
};

window.onload = main;
window.onresize = resizeCanvas;

setInterval(() => {
  refreshCanvas();
}, 1000);
