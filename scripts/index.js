function setup() {
  for (let control of controls) {
    if (!control.visible) {
      continue;
    }
    
    //TEST
    
    let container = document.createElement("section");
    let newElem = document.createElement("input");
    let p = document.createElement("p");
    p.textContent = control.id + ":";
    p.style.display = "inline-block";
    p.style["margin-right"] = "0.5em";
    newElem.id = control.id;
    container.appendChild(p);
    container.appendChild(newElem);
    document.getElementById("page1").appendChild(newElem);
    
    //END
    
    let elem = document.getElementById(control.id);
    for (let group of control.groups) {
      elem.classList.add(group);
    }
    elem.addEventListener("input", updateControlEventHandler);
    elem.disabled = !control.editable
    elem.value = control.value;
  }
  for (let control of controls) {
    control.update();
  }
}

window.addEventListener("load", setup);
