import { Blueprint } from "views/Blueprints/Blueprints";

export const getBlueprintsOptions = (blueprints: Blueprint[]) => {
  if (blueprints.length === 0) {
    return [{ value: 0, label: "No blueprint found" }];
  }

  return blueprints.map((blueprint, i) => ({
    value: i,
    label: blueprint.name,
  }));
};
