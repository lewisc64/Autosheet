function createTextBox() {
  let box = document.createElement("input");
  box.setSheetValue = (value) => { box.value = value };
  box.getSheetValue = () => { return box.value };
  return box;
}

function createCheckBox() {
  let box = document.createElement("input");
  box.setSheetValue = (value) => { box.value = value ? "✓" : "" };
  box.getSheetValue = () => { return box.value !== "" };
  box.style["user-select"] = "none";
  box.style["cursor"] = "pointer";
  
  box.addEventListener("keydown", function (e) {
    e.preventDefault();
  });
  box.addEventListener("focus", function () {
    document.activeElement.blur();
  });
  box.addEventListener("click", function () {
    box.setSheetValue(!box.value);
  });
  
  return box;
}

function createElementForType(type) {
  if (type == "boolean") {
    return createCheckBox();
  }
  return createTextBox();
}