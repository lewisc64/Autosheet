
mode = "cursor";

function getMousePos(e) {
  let canvas = e.target;
  let rect = canvas.getBoundingClientRect();
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;
  
  return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
}

function canvasMouseDown(e, ctx, memory) {
  memory.lastPosition = getMousePos(e);
  memory.drawing = true;
}

function canvasMouseUp(e, ctx, memory) {
  memory.drawing = false;
}

function canvasMouseMove(e, ctx, memory) {
  if (memory.drawing) {
    [x, y] = getMousePos(e);
    if (mode == "eraser") {
      ctx.clearRect(x - 10, y - 10, 20, 20);
    } else {
      ctx.beginPath();
      ctx.moveTo(...memory.lastPosition);
      ctx.lineTo(x, y);
      ctx.stroke();
      memory.lastPosition = [x, y];
    }
  }
}

function setupCanvas(canvas) {
  let memory = {
    "drawing": false,
  };
  let ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  canvas.addEventListener("mousedown", (e) => { canvasMouseDown(e, ctx, memory); });
  canvas.addEventListener("mouseup", (e) => { canvasMouseUp(e, ctx, memory); });
  canvas.addEventListener("mousemove", (e) => { canvasMouseMove(e, ctx, memory); });
}