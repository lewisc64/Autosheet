function prepareReplacement(control) {
  control.id = control.id + "-" + parseInt(Math.random() * 10000);
  control.visible = false;
  return control.id;
}

function getControlInList(controls, id) {
  for (let control of controls) {
    if (control.id == id) {
      return control;
    }
  }
  return null;
}

let sizeModifierMap = {
  "F": 8,
  "D": 4,
  "T": 2,
  "S": 1,
  "M": 0,
  "LT": -1,
  "LL": -1,
  "HT": -2,
  "HL": -2,
  "GT": -4,
  "GL": -4,
  "CT": -8,
  "CL": -8,
};

let sizeCarryMultiplierMap = {
  "F": 1/8,
  "D": 1/4,
  "T": 1/2,
  "S": 3/4,
  "M": 1,
  "LT": 2,
  "LL": 2,
  "HT": 4,
  "HL": 4,
  "GT": 8,
  "GL": 8,
  "CT": 16,
  "CL": 16,
};

let specialSizeModifierMap = {};

for (let key in sizeModifierMap) {
  specialSizeModifierMap[key] = -sizeModifierMap[key];
}

let sizesMap = {};
for (let key in sizeModifierMap) {
  sizesMap[key] = key;
};

page1 = [
  new PageTitleFakeControl("title", [], "Autosheet", ["name"]),
  
  new EditableControl("name", [], ""),
  new EditableControl("alignment", [], ""),
  new EditableControl("player", [], ""),
  new EditableControl("class-and-level", [], ""),
  new EditableControl("deity", [], ""),
  new EditableControl("homeland", [], ""),
  new EditableControl("race", [], ""),
  new EditableSelectionControl("size", ["size"], "M", sizesMap),
  new EditableControl("gender", [], ""),
  new EditableControl("age", [], ""),
  new EditableControl("height", [], ""),
  new EditableControl("weight", [], ""),
  new EditableControl("hair", [], ""),
  new EditableControl("eyes", [], ""),
  
  new StaticValueControl("speed-feet-per-square", ["speed"], 5),
  new EditableControl("speed", ["speed"], 0),
  new DivideControl("speed-squares", ["speed"], 0, ["speed", "speed-feet-per-square"], 0),
  new EditableControl("speed-with-armor", ["speed"], 0),
  new DivideControl("speed-squares-with-armor", ["speed"], 0, ["speed-with-armor", "speed-feet-per-square"], 0),
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
  new AbilityModifierControl("str-ability-modifier", ["ability", "ability-modifier"], 0, { "score": "str-ability-score", "temp_modifier": "str-temp-modifier" }),
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
  
  new CopyControl("ac-armor-bonus", ["ac"], 0, ["ac-item-total-bonus"]),
  new EditableControl("ac-shield-bonus", ["ac"], 0),
  new CopyControl("ac-dex-modifier", ["ac"], 0, ["dex-ability-modifier"]),
  new MapControl("ac-size-modifier", ["ac"], 0, "size", sizeModifierMap),
  new EditableControl("ac-natural-armor", ["ac"], 0),
  new EditableControl("ac-deflection-modifier", ["ac"], 0),
  new EditableControl("ac-misc-modifier", ["ac"], 0),
  new StaticValueControl("ac-constant-modifier", ["ac"], 10),
  new SumControl("ac", ["ac"], 10, ["ac-armor-bonus", "ac-shield-bonus", "ac-dex-modifier", "ac-size-modifier", "ac-natural-armor", "ac-deflection-modifier", "ac-misc-modifier", "ac-constant-modifier"]),
  new SumControl("ac-touch", ["ac"], 10, ["ac-dex-modifier", "ac-size-modifier", "ac-natural-armor", "ac-deflection-modifier", "ac-misc-modifier", "ac-constant-modifier"]),
  new SumControl("ac-flat-footed", ["ac"], 10, ["ac-armor-bonus", "ac-shield-bonus", "ac-size-modifier", "ac-natural-armor", "ac-deflection-modifier", "ac-misc-modifier", "ac-constant-modifier"]),
  
  new EditableControl("fortitude-base-save", ["saving-throw", "fortitude", "saving-throw-base-save"], 0),
  new CopyControl("fortitude-ability-modifier", ["saving-throw", "fortitude", "saving-throw-ability-modifier"], 0, ["con-ability-modifier"]),
  new EditableControl("fortitude-magic-modifier", ["saving-throw", "fortitude", "saving-throw-magic-modifier"], 0),
  new EditableControl("fortitude-misc-modifier", ["saving-throw", "fortitude", "saving-throw-misc-modifier"], 0),
  new EditableControl("fortitude-temp-modifier", ["saving-throw", "fortitude", "saving-throw-temp-modifier"], 0),
  new SumControl("fortitude", ["saving-throw", "fortitude", "saving-throw-total"], 0, ["fortitude-base-save", "fortitude-ability-modifier", "fortitude-magic-modifier", "fortitude-misc-modifier", "fortitude-temp-modifier"]),
  
  new EditableControl("reflex-base-save", ["saving-throw", "reflex", "saving-throw-base-save"], 0),
  new CopyControl("reflex-ability-modifier", ["saving-throw", "reflex", "saving-throw-ability-modifier"], 0, ["dex-ability-modifier"]),
  new EditableControl("reflex-magic-modifier", ["saving-throw", "reflex", "saving-throw-magic-modifier"], 0),
  new EditableControl("reflex-misc-modifier", ["saving-throw", "reflex", "saving-throw-misc-modifier"], 0),
  new EditableControl("reflex-temp-modifier", ["saving-throw", "reflex", "saving-throw-temp-modifier"], 0),
  new SumControl("reflex", ["saving-throw", "reflex", "saving-throw-total"], 0, ["reflex-base-save", "reflex-ability-modifier", "reflex-magic-modifier", "reflex-misc-modifier", "reflex-temp-modifier"]),
  
  new EditableControl("will-base-save", ["saving-throw", "will", "saving-throw-base-save"], 0),
  new CopyControl("will-ability-modifier", ["saving-throw", "will", "saving-throw-ability-modifier"], 0, ["wis-ability-modifier"]),
  new EditableControl("will-magic-modifier", ["saving-throw", "will", "saving-throw-magic-modifier"], 0),
  new EditableControl("will-misc-modifier", ["saving-throw", "will", "saving-throw-misc-modifier"], 0),
  new EditableControl("will-temp-modifier", ["saving-throw", "will", "saving-throw-temp-modifier"], 0),
  new SumControl("will", ["saving-throw", "will", "saving-throw-total"], 0, ["will-base-save", "will-ability-modifier", "will-magic-modifier", "will-misc-modifier", "will-temp-modifier"]),
  
  new EditableControl("base-attack-bonus", [], 0),
  new EditableControl("spell-resistance", [], 0),
  
  new CopyControl("cmb-base-attack-bonus", ["cmb", "cm", "cm-base-attack-bonus"], 0, ["base-attack-bonus"]),
  new CopyControl("cmb-str-modifier", ["cmb", "cm", "cm-str-modifier"], 0, ["str-ability-modifier"]),
  new MapControl("cmb-size-modifier", ["cmb", "cm", "cm-size-modifier"], 0, "size", specialSizeModifierMap),
  new SumControl("cmb", ["cmb", "cm", "cm-total"], 0, ["cmb-base-attack-bonus", "cmb-str-modifier", "cmb-size-modifier"]),
  
  new CopyControl("cmd-base-attack-bonus", ["cmd", "cm", "cm-base-attack-bonus"], 0, ["base-attack-bonus"]),
  new CopyControl("cmd-str-modifier", ["cmd", "cm", "cm-str-modifier"], 0, ["str-ability-modifier"]),
  new CopyControl("cmd-dex-modifier", ["cmd", "cm"], 0, ["dex-ability-modifier"]),
  new MapControl("cmd-size-modifier", ["cmd", "cm", "cm-size-modifier"], 0, "size", specialSizeModifierMap),
  new StaticValueControl("cmd-constant-modifier", ["cmd", "cm"], 10),
  new SumControl("cmd", ["cmd", "cm", "cm-total"], 10, ["cmd-base-attack-bonus", "cmd-str-modifier", "cmd-dex-modifier", "cmd-size-modifier", "cmd-constant-modifier"]),
  
  new EditableControl("conditional-modifiers-1", ["conditional-modifiers"], ""),
  new EditableControl("conditional-modifiers-2", ["conditional-modifiers"], ""),
  new EditableControl("languages-1", ["languages"], ""),
  new EditableControl("languages-2", ["languages"], ""),
  new EditableControl("languages-3", ["languages"], ""),
];

for (let i = 1; i <= 5; i++) {
  page1.push(new EditableControl(`weapon-${i}-name`, ["weapons", "weapon-" + i, "weapon-name"], ""));
  page1.push(new EditableControl(`weapon-${i}-attack-bonus`, ["weapons", "weapon-" + i, "weapon-attack-bonus"], ""));
  page1.push(new EditableControl(`weapon-${i}-critical`, ["weapons", "weapon-" + i, "weapon-critical"], ""));
  page1.push(new EditableControl(`weapon-${i}-type`, ["weapons", "weapon-" + i, "weapon-type"], ""));
  page1.push(new EditableControl(`weapon-${i}-range`, ["weapons", "weapon-" + i, "weapon-range"], ""));
  page1.push(new EditableControl(`weapon-${i}-ammunition`, ["weapons", "weapon-" + i, "weapon-ammunition"], ""));
  page1.push(new EditableControl(`weapon-${i}-damage`, ["weapons", "weapon-" + i, "weapon-damage"], ""));
}

skills = [
  { name: "acrobatics", info: false, ability: "dex" },
  { name: "appraise", info: false, ability: "int" },
  { name: "bluff", info: false, ability: "cha" },
  { name: "climb", info: false, ability: "str" },
  { name: "craft-1", info: true, ability: "int" },
  { name: "craft-2", info: true, ability: "int" },
  { name: "craft-3", info: true, ability: "int" },
  { name: "diplomacy", info: false, ability: "cha" },
  { name: "disable-device", info: false, ability: "dex" },
  { name: "disguise", info: false, ability: "cha" },
  { name: "escape-artist", info: false, ability: "dex" },
  { name: "fly", info: false, ability: "dex" },
  { name: "handle-animal", info: false, ability: "cha" },
  { name: "heal", info: false, ability: "wis" },
  { name: "intimidate", info: false, ability: "cha" },
  { name: "knowledge-arcana", info: false, ability: "int" },
  { name: "knowledge-dungeoneering", info: false, ability: "int" },
  { name: "knowledge-engineering", info: false, ability: "int" },
  { name: "knowledge-geography", info: false, ability: "int" },
  { name: "knowledge-history", info: false, ability: "int" },
  { name: "knowledge-local", info: false, ability: "int" },
  { name: "knowledge-nature", info: false, ability: "int" },
  { name: "knowledge-nobility", info: false, ability: "int" },
  { name: "knowledge-planes", info: false, ability: "int" },
  { name: "knowledge-religion", info: false, ability: "int" },
  { name: "linguistics", info: false, ability: "int" },
  { name: "perception", info: false, ability: "wis" },
  { name: "perform-1", info: true, ability: "cha" },
  { name: "perform-2", info: true, ability: "cha" },
  { name: "profession-1", info: true, ability: "wis" },
  { name: "profession-2", info: true, ability: "wis" },
  { name: "ride", info: false, ability: "dex" },
  { name: "sense-motive", info: false, ability: "wis" },
  { name: "sleight-of-hand", info: false, ability: "dex" },
  { name: "spellcraft", info: false, ability: "int" },
  { name: "stealth", info: false, ability: "dex" },
  { name: "survival", info: false, ability: "wis" },
  { name: "swim", info: false, ability: "str" },
  { name: "use-magic-device", info: false, ability: "cha" },
];

for (let skill of skills) {
  if (skill.info) {
    page1.push(new EditableControl(skill.name + "-info", ["skill", "skill-info", skill.name], ""));
  }
  page1.push(new EditableBooleanControl(skill.name + "-trained", ["skill", "skill-trained", skill.name], false));
  page1.push(new CopyControl(skill.name + "-ability-modifier", ["skill", "skill-ability-modifier", skill.name], 0, [skill.ability + "-ability-modifier"]));
  page1.push(new EditableControl(skill.name + "-ranks", ["skill", "skill-ranks", skill.name], 0));
  page1.push(new EditableControl(skill.name + "-misc-modifier", ["skill", "skill-misc-modifier", skill.name], 0));
  page1.push(new SumControl(skill.name + "-total", ["skill", "skill-total", skill.name], 0, [skill.name + "-ability-modifier", skill.name + "-ranks", skill.name + "-misc-modifier"]));
}

let page2 = [];

for (let i = 1; i <= 5; i++) {
  let prefix = "ac-item-" + i + "-";
  for (let type of ["name", "bonus", "type", "check-penalty", "spell-failure", "weight", "properties"]) {
    page2.push(new EditableControl(prefix + type, ["ac-item", "ac-item-" + i, "ac-item-" + type], ["bonus", "check-penalty", "spell-failure", "weight"].indexOf(type) == -1 ? "" : 0));
  }
}

page2.push(...[
  new SumControl("ac-item-total-bonus", ["ac-item", "ac-item-total", "ac-item-bonus"], 0, ["ac-item-1-bonus", "ac-item-2-bonus", "ac-item-3-bonus", "ac-item-4-bonus", "ac-item-5-bonus"]),
  new SumControl("ac-item-total-check-penalty", ["ac-item", "ac-item-total", "ac-item-check-penalty"], 0, ["ac-item-1-check-penalty", "ac-item-2-check-penalty", "ac-item-3-check-penalty", "ac-item-4-check-penalty", "ac-item-5-check-penalty"]),
  new SumControl("ac-item-total-spell-failure", ["ac-item", "ac-item-total", "ac-item-spell-failure"], 0, ["ac-item-1-spell-failure", "ac-item-2-spell-failure", "ac-item-3-spell-failure", "ac-item-4-spell-failure", "ac-item-5-spell-failure"]),
  new SumControl("ac-item-total-weight", ["ac-item", "ac-item-total", "ac-item-weight"], 0, ["ac-item-1-weight", "ac-item-2-weight", "ac-item-3-weight", "ac-item-4-weight", "ac-item-5-weight"]),
]);

let totalGearWeights = [];
for (let i = 1; i <= 26; i++) {
  let prefix = "gear-" + i + "-";
  page2.push(new EditableControl(prefix + "name", ["gear-" + i, "gear-name"], ""));
  page2.push(new EditableControl(prefix + "weight", ["gear-" + i, "gear-weight"], 0));
  totalGearWeights.push(prefix + "weight");
}
page2.push(new SumControl("gear-total-weight", ["gear-total", "gear-weight"], 0, totalGearWeights));

let multiplierMapControl = new MapControl("load-size-multiplier", ["load"], 0, "size", sizeCarryMultiplierMap);
multiplierMapControl.visible = false;

let heavyLoad = new HeavyLoadControl("load-heavy-true", ["load"], 0, "str-ability-score");
heavyLoad.visible = false;

page2.push(...[
  multiplierMapControl,
  new StaticValueControl("load-light-multiplier", ["load"], 1 / 3),
  new StaticValueControl("load-medium-multiplier", ["load"], 2 / 3),
  new StaticValueControl("load-lift-over-head-multiplier", ["load"], 1),
  new StaticValueControl("load-lift-off-ground-multiplier", ["load"], 2),
  new StaticValueControl("load-drag-push-multiplier", ["load"], 5),
  
  heavyLoad,
  new MultiplyControl("load-heavy", ["load"], 0, ["load-heavy-true", "load-size-multiplier"], 0),
  new MultiplyControl("load-medium", ["load"], 0, ["load-heavy-true", "load-size-multiplier", "load-medium-multiplier"], 0),
  new MultiplyControl("load-light", ["load"], 0, ["load-heavy-true", "load-size-multiplier", "load-light-multiplier"], 0),
  
  new MultiplyControl("load-lift-over-head", ["load"], 0, ["load-heavy-true", "load-size-multiplier", "load-lift-over-head-multiplier"], 0),
  new MultiplyControl("load-lift-off-ground", ["load"], 0, ["load-heavy-true", "load-size-multiplier", "load-lift-off-ground-multiplier"], 0),
  new MultiplyControl("load-drag-push", ["load"], 0, ["load-heavy-true", "load-size-multiplier", "load-drag-push-multiplier"], 0),
]);

page2.push(...[
  new StaticValueControl("max-dex-modifier-light-load", ["load"], 99999999999999),
  new StaticValueControl("max-dex-modifier-medium-load", ["load"], 3),
  new StaticValueControl("max-dex-modifier-heavy-load", ["load"], 1),
]);

let dexModifierLoadControls = [
  new LessThanOrEqualControl("load-is-light", ["load"], 0, ["gear-total-weight", "load-light"]),
  new GreaterThanControl("load-is-medium", ["load"], 0, ["gear-total-weight", "load-light"]),
  new GreaterThanControl("load-is-heavy", ["load"], 0, ["gear-total-weight", "load-medium"]),
  new NotControl("load-is-not-heavy", ["load"], 0, ["load-is-heavy"]),
  new MultiplyControl("load-light-dex", ["load"], 0, ["load-is-light", "max-dex-modifier-light-load"]),
  new MultiplyControl("load-medium-dex", ["load"], 0, ["load-is-medium", "max-dex-modifier-medium-load"]),
  new MultiplyControl("load-heavy-dex", ["load"], 0, ["load-is-heavy", "max-dex-modifier-heavy-load"]),
  new MaximumControl("load-max-dex", ["load"], 0, ["load-light-dex", "load-medium-dex", "load-heavy-dex"]),
];

dexModifierLoadControls.push(new MultiplyControl("load-is-medium", ["load"], 0, [prepareReplacement(getControlInList(dexModifierLoadControls, "load-is-medium")), "load-is-not-heavy"]));

for (let control of dexModifierLoadControls) {
  control.visible = false;
  page2.push(control);
}

page1.push(new MinimumControl("dex-ability-modifier", ["ability", "ability-modifier"], 0, [prepareReplacement(getControlInList(page1, "dex-ability-modifier")), "load-max-dex"]));

for (let i = 1; i <= 12; i++) {
  page2.push(new EditableControl("feat-" + i, ["feats"], ""));
}

for (let i = 1; i <= 20; i++) {
  page2.push(new EditableControl("special-ability-" + i, ["special-abilities"], ""));
}

page2.push(...[
  new EditableControl("money-copper", ["money"], ""),
  new EditableControl("money-silver", ["money"], ""),
  new EditableControl("money-gold", ["money"], ""),
  new EditableControl("money-platinum", ["money"], ""),

  new EditableControl("experience", ["experience"], ""),
  new EditableControl("experience-next-level", ["experience"], ""),
]);

for (let i = 0; i <= 9; i++) {
  let prefix = "spell-level-" + i;
  page2.push(...[
    new EditableControl(prefix + "-known", [prefix, "spell-level", "spell-level-known"], ""),
    new EditableControl(prefix + "-save-dc", [prefix, "spell-level", "spell-level-save-dc"], ""),
    new EditableControl(prefix + "-per-day", [prefix, "spell-level", "spell-level-per-day"], ""),
  ]);
  if (i >= 1) {
    page2.push(new EditableControl(prefix + "-bonus", [prefix, "spell-level", "spell-level-bonus"], ""));
  }
}

page2.push(new EditableControl("spell-conditional-modifiers", [], ""));
page2.push(new EditableControl("spell-domains-speciality", ["spell-text-area"], ""));

let spellLineCounts = [8, 8, 7, 6, 5, 4, 4, 4, 3, 2];
for (let i = 0; i < spellLineCounts.length; i++) {
  for (let j = 0; j <= spellLineCounts[i]; j++) {
    page2.push(new EditableControl("spell-text-" + i + "-" + (j + 1), ["spell-text-area"], "", true));
  }
}

for (let control of page1) {
  control.groups.push("page-1");
}

for (let control of page2) {
  control.groups.push("page-2");
}

let controls = {}
let controlsList = [];
for (let control of [...page1, ...page2]) {
  if (controls[control.id] !== undefined) {
    console.log("Duplicate ID: " + control.id);
  }
  controlsList.push(control);
  controls[control.id] = control;
}
for (let id in controls) {
  controls[id].updateAffects();
}
