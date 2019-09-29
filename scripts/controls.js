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
  for (let control of controls) {
    if (control.id == id) {
      return control;
    }
  }
}

function copy(source, target) {
  target.value = source.value;
  update(target);
}

function calculateAbilityModifier(score, modifier) {
  modifier.value = math.floor(score.value / 2) - 5;
}

class Control {
  constructor(id, groups, value, aggregate=[]) {
    this.id = id;
    this.groups = groups;
    this.value = value;
    this.aggregate = aggregate;
    this.visible = true;
    this.editable = false;
  }
  
  aggregateValuesIn() {}
  
  update() {
    this.aggregateValuesIn();
    
    this.getElement().value = this.value;
    
    for (let control of controls) {
      if (control.aggregate.indexOf(this.id) != -1) {
        control.update();
      }
    }
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
    super(id, groups, value, [controls.score, ...controls.modifiers]);
    this.scoreControlId = controls.score;
    this.modifierControlIds = controls.modifiers;
  }
  
  aggregateValuesIn() {
    let total = getControlById(this.scoreControlId).value;
    for (let id of this.modifierControlIds) {
      total += getControlById(id).value;
    }
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

controls = [
  new EditableControl("name", [], ""),
  new EditableControl("alignment", [], ""),
  new EditableControl("player", [], ""),
  new EditableControl("class-and-level", [], ""),
  new EditableControl("deity", [], ""),
  new EditableControl("homeland", [], ""),
  new EditableControl("race", [], ""),
  new EditableControl("size", [], ""),
  new EditableControl("gender", [], ""),
  new EditableControl("age", [], ""),
  new EditableControl("height", [], ""),
  new EditableControl("weight", [], ""),
  new EditableControl("hair", [], ""),
  new EditableControl("eyes", [], ""),
  
  new EditableControl("speed", ["speed"], ""),
  new EditableControl("speed-squares", ["speed"], ""),
  new EditableControl("speed-with-armor", ["speed"], ""),
  new EditableControl("speed-squares-with-armor", ["speed"], ""),
  new EditableControl("speed-fly", ["speed"], ""),
  new EditableControl("speed-fly-maneuverability", ["speed"], ""),
  new EditableControl("speed-swim", ["speed"], ""),
  new EditableControl("speed-climb", ["speed"], ""),
  new EditableControl("speed-burrow", ["speed"], ""),
  
  new EditableControl("str-ability-score", ["ability", "ability-score"], 10),
  new EditableControl("dex-ability-score", ["ability", "ability-score"], 10),
  new EditableControl("con-ability-score", ["ability", "ability-score"], 10),
  new EditableControl("int-ability-score", ["ability", "ability-score"], 10),
  new EditableControl("wis-ability-score", ["ability", "ability-score"], 10),
  new EditableControl("cha-ability-score", ["ability", "ability-score"], 10),
  new AbilityModifierControl("str-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "str-ability-score", "modifiers": [] }),
  new AbilityModifierControl("dex-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "dex-ability-score", "modifiers": [] }),
  new AbilityModifierControl("con-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "con-ability-score", "modifiers": [] }),
  new AbilityModifierControl("int-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "int-ability-score", "modifiers": [] }),
  new AbilityModifierControl("wis-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "wis-ability-score", "modifiers": [] }),
  new AbilityModifierControl("cha-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "cha-ability-score", "modifiers": [] }),
  
  new EditableControl("hp-total", ["hp"], ""),
  new EditableControl("hp-current", ["hp"], ""),
  new EditableControl("hp-damage-reduction", ["hp"], ""),
  new EditableControl("hp-nonlethal", ["hp"], ""),
  
  new CopyControl("initiative-dex-modifier", ["initiative"], 0, ["dex-ability-modifier"]),
  new EditableControl("initiative-misc-modifier", ["initiative"], 0),
  new SumControl("initiative", ["initiative"], 0, ["initiative-dex-modifier", "initiative-misc-modifier"]),
  
  new EditableControl("ac-armor-bonus", ["ac"], 0),
  new EditableControl("ac-shield-bonus", ["ac"], 0),
  new CopyControl("ac-dex-modifier", ["ac"], 0, ["dex-ability-modifier"]),
  new EditableControl("ac-size-modifier", ["ac"], 0),
  new EditableControl("ac-natural-armor", ["ac"], 0),
  new EditableControl("ac-deflection-modifier", ["ac"], 0),
  new EditableControl("ac-misc-modifier", ["ac"], 0),
  new StaticValueControl("ac-constant-modifier", ["ac"], 10),
  new SumControl("ac", ["ac"], 0, ["ac-armor-bonus", "ac-shield-bonus", "ac-dex-modifier", "ac-size-modifier", "ac-natural-armor", "ac-deflection-modifier", "ac-misc-modifier", "ac-constant-modifier"]),
  new SumControl("ac-touch", ["ac"], 0, ["ac-dex-modifier", "ac-size-modifier", "ac-natural-armor", "ac-deflection-modifier", "ac-misc-modifier", "ac-constant-modifier"]),
  new SumControl("ac-flat-footed", ["ac"], 0, ["ac-armor-bonus", "ac-shield-bonus", "ac-size-modifier", "ac-natural-armor", "ac-deflection-modifier", "ac-misc-modifier", "ac-constant-modifier"]),
  
  new EditableControl("fortitude-base-save", ["fortitude", "saving-throw-base-save"], 0),
  new CopyControl("fortitude-ability-modifier", ["fortitude", "saving-throw-ability-modifier"], 0, ["con-ability-modifier"]),
  new EditableControl("fortitude-magic-modifier", ["fortitude", "saving-throw-magic-modifier"], 0),
  new EditableControl("fortitude-misc-modifier", ["fortitude", "saving-throw-misc-modifier"], 0),
  new EditableControl("fortitude-temp-modifier", ["fortitude", "saving-throw-temp-modifier"], 0),
  new SumControl("fortitude", ["fortitude"], 0, ["fortitude-base-save", "fortitude-ability-modifier", "fortitude-magic-modifier", "fortitude-misc-modifier", "fortitude-temp-modifier"]),
  
  new EditableControl("reflex-base-save", ["reflex", "saving-throw-base-save"], 0),
  new CopyControl("reflex-ability-modifier", ["reflex", "saving-throw-ability-modifier"], 0, ["dex-ability-modifier"]),
  new EditableControl("reflex-magic-modifier", ["reflex", "saving-throw-magic-modifier"], 0),
  new EditableControl("reflex-misc-modifier", ["reflex", "saving-throw-misc-modifier"], 0),
  new EditableControl("reflex-temp-modifier", ["reflex", "saving-throw-temp-modifier"], 0),
  new SumControl("reflex", ["reflex"], 0, ["reflex-base-save", "reflex-ability-modifier", "reflex-magic-modifier", "reflex-misc-modifier", "reflex-temp-modifier"]),
  
  new EditableControl("will-base-save", ["will", "saving-throw-base-save"], 0),
  new CopyControl("will-ability-modifier", ["will", "saving-throw-ability-modifier"], 0, ["wis-ability-modifier"]),
  new EditableControl("will-magic-modifier", ["will", "saving-throw-magic-modifier"], 0),
  new EditableControl("will-misc-modifier", ["will", "saving-throw-misc-modifier"], 0),
  new EditableControl("will-temp-modifier", ["will", "saving-throw-temp-modifier"], 0),
  new SumControl("will", ["will"], 0, ["will-base-save", "will-ability-modifier", "will-magic-modifier", "will-misc-modifier", "will-temp-modifier"]),
];

for (let i = 1; i <= 5; i++) {
  controls.push(new Control(`weapon-${i}-name`, ["weapon", "weapon-name"], ""));
  controls.push(new Control(`weapon-${i}-attack-bonus`, ["weapon", "weapon-attack-bonus"], ""));
  controls.push(new Control(`weapon-${i}-critical`, ["weapon", "weapon-critical"], ""));
  controls.push(new Control(`weapon-${i}-type`, ["weapon", "weapon-type"], ""));
  controls.push(new Control(`weapon-${i}-range`, ["weapon", "weapon-range"], ""));
  controls.push(new Control(`weapon-${i}-ammunition`, ["weapon", "weapon-ammunition"], ""));
  controls.push(new Control(`weapon-${i}-damage`, ["weapon", "weapon-damage"], ""));
}
