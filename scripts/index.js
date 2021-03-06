function copyDimensionsForCanvas(source, canvas) {
  canvas.width = source.clientWidth;
  canvas.height = source.clientHeight;
}

function save() {
  
  packed = {
    ids: {},
    scribbles: {},
    valueBumps: {},
  };
  
  for (let canvas of document.querySelectorAll(".sheet > canvas")) {
    packed.scribbles[canvas.parentNode.id] = canvas.toDataURL("image/png");
  }
  
  for (let elem of document.querySelectorAll(".sheet > input, .sheet > select")) {
    if (getControlById(elem.id).editable) {
      packed.ids[elem.id] = elem.getSheetValue();
    }
  }
  
  for (let control of controlsList) {
    if (control.getBump() != 0) {
      packed.valueBumps[control.id] = control.getBump();
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
  
  for (let control of controlsList) {
    control.resetBump();
    if (packed.valueBumps != null && packed.valueBumps[control.id] != undefined) {
      control.addBump(packed.valueBumps[control.id]);
    }
  }
  
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
      ctx.clearRect(0, 0, img.width, img.height);
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
    
    let elem = control.createElement();
    
    let page = document.getElementById(control.hasGroup("page-1") ? "page1" : "page2");
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

window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});
