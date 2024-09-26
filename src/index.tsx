let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let imageLoader: HTMLInputElement | null;
const main = () => {
  console.log("main");
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d");

  imageLoader = document.getElementById("imageLoader") as HTMLInputElement;
  imageLoader?.addEventListener("change", handleImage, false);

  if (localStorage.getItem("image")) {
    showImage();
  }
};
function handleImage(e: any) {
  console.log("handleImage");
  var reader = new FileReader();
  reader.onload = function (event) {
    /*var img = new Image();

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, 300, 300);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
    localStorage.setItem("image", URL.createObjectURL(e.target.files[0]));
    img.src = `${event?.target?.result}`;*/

    localStorage.setItem("image", `${event?.target?.result}`);
    showImage();
  };

  reader.readAsDataURL(e.target.files[0]);
}

function showImage() {
  var img = new Image();
  img.onload = function () {
    //canvas.width = img.width;
    //canvas.height = img.height;
    ctx?.drawImage(img, 0, 0, 300, 300);
  };
  img.src = `${localStorage.getItem("image")}`;
}

window.onload = main;
