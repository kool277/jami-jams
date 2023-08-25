import MenuItem from "@mui/material/MenuItem";

export function buildSelectMenuItems(elements) {
  return elements.map((d) => (
    <MenuItem key={d.value} value={d.value}>
      {d.label}
    </MenuItem>
  ));
}

// read file content
export function readSingleFile(evt, fieldContents) {
  const f = evt.target.files[0];
  if (f) {
    const r = new FileReader();
    r.onload = function (e) {
      const contents = e.target.result;
      fieldContents = contents;
    };
    console.log(fieldContents);
    r.readAsText(f);
    return fieldContents;
  }
}

export function retrieveArrayElement(value, elements) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].value === value) {
      return elements[i];
    }
  }
}

export default { buildSelectMenuItems, readSingleFile, retrieveArrayElement };
