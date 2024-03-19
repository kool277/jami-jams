import BaseLayout from "layouts/BaseLayout";
import { Blueprint } from "views/Blueprint/Blueprint";

export default function BlueprintRoute(props: any) {
  return (
    <BaseLayout
      component={<Blueprint blueprintName={props.match.params.blueprintname} />}
    />
  );
}
