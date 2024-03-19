import MenuItem from "@mui/material/MenuItem";

export function buildSelectMenuItems(
  elements: {
    value: number;
    label: string;
  }[]
) {
  return elements.map((d) => (
    <MenuItem key={d.value} value={d.value}>
      {d.label}
    </MenuItem>
  ));
}

export function retrieveArrayElement(
  value: number,
  elements: {
    value: number;
    label: string;
  }[]
) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].value === value) {
      return elements[i];
    }
  }
}

export default { buildSelectMenuItems, retrieveArrayElement };
