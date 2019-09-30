function setFontSize(elem) {
  elem.style["font-size"] = elem.clientHeight * 0.6 + "px";
}

function copyDimensionsForCanvas(source, canvas) {
  canvas.width = source.clientWidth;
  canvas.height = source.clientHeight;
}

function save() {
  
  packed = {
    ids: {},
    scribbles: {},
  };
  
  for (let canvas of document.querySelectorAll(".sheet > canvas")) {
    packed.scribbles[canvas.parentNode.id] = canvas.toDataURL("image/png");
  }
  
  for (let elem of document.querySelectorAll(".sheet > input")) {
    if (getControlById(elem.id).editable) {
      packed.ids[elem.id] = elem.getSheetValue();
    }
  }
  
  let a = document.createElement("a");
  let file = new Blob([JSON.stringify(packed, null, 2)], {type: "text/plain"});
  a.href = URL.createObjectURL(file);
  
  let name = document.getElementById("name").value;
  
  a.download = (name == "" ? "unnamed" : name.toLowerCase().replace(/ /g, "-")) + ".json";
  a.click();
}

function importJsonContent(content) {
  
  packed = JSON.parse(content);
  
  for (let id in packed.ids) {
    let value = packed.ids[id];
    elem = document.getElementById(id);
    elem.setSheetValue(value);
    elem.dispatchEvent(new Event("input"));
  }
  
  for (let pageId in packed.scribbles) {
    let canvas = document.querySelector("#" + pageId + " > canvas");
    let ctx = canvas.getContext("2d");
    
    let img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = packed.scribbles[pageId];
  }
}

function importSheet() {
  let input = document.createElement("input");
  input.type = "file";
  input.click();
  input.onchange = (e) => { 
    let file = e.target.files[0]; 

    let reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = readerEvent => {
      importJsonContent(readerEvent.target.result);
    }
  }
}

function setUpElements() {
  for (let control of controlsList) {
    if (!control.visible) {
      continue;
    }
    
    let elem = createElementForType(typeof control.value);
    elem.id = control.id;
    elem.disabled = !control.editable;
    elem.setSheetValue(control.value);
    
    for (let group of control.groups) {
      elem.classList.add(group);
    }
    
    elem.addEventListener("input", updateControlEventHandler);
    new ResizeObserver(() => { setFontSize(elem); }).observe(elem);
    
    let page = document.getElementById("page1");
    page.appendChild(elem);
  }
  updateAllControls();
}

function setUpCanvases() {
  for (let page of document.querySelectorAll(".sheet")) {
    let img = page.querySelector("img");
    let canvas = document.createElement("canvas");
    //new ResizeObserver(() => { copyDimensionsForCanvas(img, canvas); }).observe(canvas);
    copyDimensionsForCanvas(img, canvas);
    page.appendChild(canvas);
    setupCanvas(canvas);
  }
}

function setup() {
  
  setUpElements();
  setUpCanvases();
  
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
  
  document.getElementById("save").addEventListener("click", function () {
    save();
  });
  document.getElementById("import").addEventListener("click", function () {
    importSheet();
  });
}

window.addEventListener("load", setup);
