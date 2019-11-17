function updateControlEventHandler(e) {
  
  if (e.target.value == "") {
    return;
  }
  
  let control = getControlById(e.target.id);
  
  if (typeof control.value == "number") {
    control.value = parseInt(e.target.value);
  } else {
    control.value = e.target.value;
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
    
    this.affects = [];
  }

  hasGroup(name) {
    return this.groups.indexOf(name) != -1
  }
  
  configureElement(elem) {
    elem.id = this.id;
    elem.disabled = !this.editable;
    elem.setSheetValue(this.value);
    
    for (let group of this.groups) {
      elem.classList.add(group);
    }
    
    elem.addEventListener("input", updateControlEventHandler);
    
    let setFontSize = (elem) => {
      elem.style["font-size"] = elem.clientHeight * 0.6 + "px";
    }
    
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
    this.aggregateValuesIn();
    
    if (!this.editable) {
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
  
  aggregateValuesIn() {
    let total = getControlById(this.scoreControlId).value;
    this.value = Math.floor(total / 2) - 5;
  }
}

class CopyControl extends Control {
  aggregateValuesIn() {
    this.value = getControlById(this.aggregate[0]).value;
  }
}

class SumControl extends Control {
  aggregateValuesIn() {
    let total = 0;
    for (let id of this.aggregate) {
      total += getControlById(id).value;
    }
    this.value = total;
  }
}

class MapControl extends Control {
  constructor(id, groups, value, control, map) {
    super(id, groups, value, [control]);
    this.map = map;
  }
  
  aggregateValuesIn() {
    this.value = this.map[getControlById(this.aggregate[0]).value];
  }
}
