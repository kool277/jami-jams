export const getBlueprintsOptions = (blueprints) => {
  if (blueprints.length === 0) {
    return [{ value: 0, label: "No blueprint found" }];
  }

  return blueprints.map((blueprint, i) => ({
    value: i,
    label: blueprint.name,
  }));
};
