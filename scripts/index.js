function setFontSize(elem) {
  elem.style["font-size"] = elem.clientHeight * 0.6 + "px";
}

function copyDimensionsForCanvas(source, canvas) {
  canvas.width = source.clientWidth;
  canvas.height = source.clientWidth;
}

function setup() {
  
  for (let control of controls) {
    if (!control.visible) {
      continue;
    }
    
    let elem = document.createElement("input");
    if (typeof control.value == "boolean") {
      elem.type = "checkbox";
    }
    elem.id = control.id;
    elem.disabled = !control.editable;
    elem.value = control.value;
    
    for (let group of control.groups) {
      elem.classList.add(group);
    }
    
    elem.addEventListener("input", updateControlEventHandler);
    new ResizeObserver(() => { setFontSize(elem); }).observe(elem);
    
    document.getElementById("page1").appendChild(elem);
  }
  for (let control of controls) {
    control.update();
  }
  for (let page of document.querySelectorAll(".sheet")) {
    let img = page.querySelector("img");
    let canvas = document.createElement("canvas");
    //new ResizeObserver(() => { copyDimensionsForCanvas(img, canvas); }).observe(canvas);
    copyDimensionsForCanvas(img, canvas);
    page.appendChild(canvas);
    setupCanvas(canvas);
  }
  
  document.getElementById("cursor").addEventListener("click", function () {
    for (let canvas of document.querySelectorAll(".sheet > canvas")) {
      canvas.style["pointer-events"] = "none";
      canvas.style["cursor"] = "initial";
    }
    mode = "cursor";
  });
  document.getElementById("pen").addEventListener("click", function () {
    for (let canvas of document.querySelectorAll(".sheet > canvas")) {
      canvas.style["pointer-events"] = "auto";
      canvas.style["cursor"] = "crosshair";
    }
    mode = "pen";
  });
  document.getElementById("eraser").addEventListener("click", function () {
    for (let canvas of document.querySelectorAll(".sheet > canvas")) {
      canvas.style["pointer-events"] = "auto";
      canvas.style["cursor"] = "crosshair";
    }
    mode = "eraser";
  });
}

window.addEventListener("load", setup);
