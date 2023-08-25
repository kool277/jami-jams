import Blueprints from "views/Blueprints/Blueprints";

import ListLayout from "layouts/ListLayout";

export default function BlueprintsRoute() {
  return <ListLayout component={<Blueprints />} />;
}
