function updateControlEventHandler(e) {
  let control = getControlById(e.target.id);
  
  if (typeof control.value == "number") {
    if (e.target.value == "") {
      control.value = 0;
    } else {
      control.value = parseInt(e.target.value);
    }
  } else if (e.target.value != "") {
    control.value = e.target.value;
  } else {
    return;
  }
  
  control.update();
}

function getControlById(id) {
  return controls[id];
}

function updateAllControls() {
  for (let control of controlsList) {
    control.update();
  }
}

class Control {
  constructor(id, groups, value, aggregate=[]) {
    this.id = id;
    this.groups = groups;
    this.value = value;
    this.aggregate = aggregate;
    this.visible = true;
    this.editable = false;
    this.page = 1;
    this.bump = 0;
    
    this.affects = [];
  }

  hasGroup(name) {
    return this.groups.indexOf(name) != -1
  }
  
  isBumpable() {
    return false;
  }
  
  addBump(n) {
    this.bump += n;
    this.update();
  }
  
  resetBump() {
    this.bump = 0;
    this.update();
  }
  
  getBump() {
    return this.bump;
  }
  
  configureElement(elem) {
    elem.id = this.id;
    //elem.disabled = !this.editable;
    if (!this.editable) {
      elem.style["background"] = "none";
    }
    elem.setSheetValue(this.value);
    
    for (let group of this.groups) {
      elem.classList.add(group);
    }
    
    if (this.editable) {
      elem.addEventListener("input", updateControlEventHandler); 
    }
    else {
      elem.addEventListener("focus", function () {
        document.activeElement.blur();
      });
      elem.style.cursor = this.isBumpable() ? "pointer" : "default";
    }
    
    let setFontSize = (elem) => {
      elem.style["font-size"] = elem.clientHeight * 0.6 + "px";
    }
    
    let bumpDialogOpen = false;
    let bumpDialogId = elem.id + "-bump-dialog";
    
    elem.addEventListener("click", (e) => {
      if (!this.isBumpable()) {
        return;
      }
      
      let existingDialogElem = document.getElementById(bumpDialogId);
      if (existingDialogElem != null) {
        existingDialogElem.parentElement.removeChild(existingDialogElem);
      }
      
      if (bumpDialogOpen) {
        bumpDialogOpen = false;
        return;
      }
      bumpDialogOpen = true;
      
      let bumpDialog = document.createElement("section");
      bumpDialog.classList.add("bump-dialog");
      bumpDialog.classList.add("dialog");
      bumpDialog.id = bumpDialogId;
      
      for (let buttonInfo of [["-", () => this.addBump(-1)], ["R", () => this.resetBump()], ["+", () => this.addBump(1)]]) {
        let bumpButton = document.createElement("button");
        bumpButton.classList.add("bump-button");
        bumpButton.textContent = buttonInfo[0];
        bumpButton.addEventListener("click", () => {
          buttonInfo[1]();
        });
        bumpDialog.appendChild(bumpButton);
      }
      
      bumpDialog.style.position = "absolute";
      bumpDialog.style.left = e.pageX - 50 + "px";
      bumpDialog.style.top = e.pageY - 50 + "px";
      
      document.body.appendChild(bumpDialog);
    });
    
    new ResizeObserver(() => { setFontSize(elem); }).observe(elem);
  }
  
  createElement() {
    let elem = createTextBox();
    this.configureElement(elem)
    return elem;
  }
  
  aggregateValuesIn() {}
  
  updateAffects() {
    this.affects = [];
    for (let id in controls) {
      let control = controls[id];
      if (control.aggregate.indexOf(this.id) != -1) {
        this.affects.push(control.id);
      }
    }
  }
  
  update() {
    
    let elem = document.getElementById(this.id);
    
    if (elem) {
      if (this.getBump() > 0) {
        elem.style.color = "blue";
      } else if (this.getBump() < 0) {
        elem.style.color = "red";
      } else {
        elem.style.color = null;
      }
    }
    
    this.aggregateValuesIn();
    
    if (!this.editable && this.visible) {
      this.getElement().setSheetValue(this.value);
    }
    
    for (let id of this.affects) {
      getControlById(id).update();
    }
  }
  
  inGroup(groupName) {
    return this.groups.indexOf(groupName) != -1;
  }
  
  getElement() {
    return document.getElementById(this.id);
  }
}

class EditableControl extends Control {
  constructor(id, groups, value) {
    super(id, groups, value);
    this.editable = true;
  }
}

class EditableSelectionControl extends EditableControl {
  constructor(id, groups, value, values) {
    super(id, groups, value)
    this.values = values;
  }
  
  createElement() {
    let elem = createComboBox(this.values);
    this.configureElement(elem)
    return elem;
  }
}

class EditableBooleanControl extends EditableControl {
  createElement() {
    let elem = createCheckBox();
    this.configureElement(elem)
    return elem;
  }
}

class StaticValueControl extends Control {
  constructor(id, groups, value) {
    super(id, groups, value);
    this.visible = false;
  }
  
  aggregateValuesIn() {}
  
  update() {}
}

class AbilityModifierControl extends Control {
  constructor(id, groups, value, controls) {
    super(id, groups, value, [controls.score]);
    this.scoreControlId = controls.score;
  }
  
  isBumpable() {
    return true;
  }
  
  aggregateValuesIn() {
    let total = getControlById(this.scoreControlId).value;
    this.value = Math.floor(total / 2) - 5 + this.getBump();
  }
}

class HeavyLoadControl extends Control {
  constructor(id, groups, value, strengthControlId) {
    super(id, groups, value, [strengthControlId]);
    this.strengthControlId = strengthControlId;
  }
  
  isBumpable() {
    return true;
  }
  
  aggregateValuesIn() {
    let str = getControlById(this.strengthControlId).value;
    this.value = this.getHeavyLoad(str) + this.getBump();
  }
  
  getHeavyLoad(str) {
    if (str >= 0 && str <= 10) {
      return 10 * str;
    } else if (str >= 15) {
      return 2 * this.getHeavyLoad(str - 5);
    }
    return [115, 130, 150, 175][str - 11];
  }
}

class CopyControl extends Control {
  aggregateValuesIn() {
    this.value = getControlById(this.aggregate[0]).value;
  }
}

class PageTitleFakeControl extends Control {
  constructor(id, groups, value, aggregate) {
    super(id, groups, value, aggregate);
    this.editable = false;
    this.visible = false;
  }
  
  aggregateValuesIn() {
    let value = getControlById(this.aggregate[0]).value;
    if (value) {
      document.title = value + " - Autosheet";
    }
    else {
      document.title = "Autosheet";
    }
  }
}

class SumControl extends Control {
  isBumpable() {
    return true;
  }
  
  aggregateValuesIn() {
    let total = 0;
    for (let id of this.aggregate) {
      total += getControlById(id).value;
    }
    this.value = total + this.getBump();
  }
}

class DivideControl extends Control {
  constructor(id, groups, value, aggregate=[], decimalPlaces=2) {
    super(id, groups, value, aggregate, )
    this.decimalPlaces = decimalPlaces;
  }
  
  isBumpable() {
    return true;
  }
  
  aggregateValuesIn() {
    this.value = this.round(getControlById(this.aggregate[0]).value / getControlById(this.aggregate[1]).value + this.getBump());
  }
  
  round(n) {
    return Math.trunc(n * Math.pow(10, this.decimalPlaces)) / Math.pow(10, this.decimalPlaces);
  }
}

class MultiplyControl extends DivideControl {
  isBumpable() {
    return true;
  }
  
  aggregateValuesIn() {
    let product = 1;
    for (let id of this.aggregate) {
      product *= getControlById(id).value;
    }
    this.value = this.round(product + this.getBump());
  }
}

class MapControl extends Control {
  constructor(id, groups, value, control, map) {
    super(id, groups, value, [control]);
    this.map = map;
  }
  
  isBumpable() {
    return (typeof value) == "number";
  }
  
  aggregateValuesIn() {
    this.value = this.map[getControlById(this.aggregate[0]).value];
  }
}
