import ListLayout from "layouts/ListLayout";
import EditGroup from "views/Groups/EditGroup";

export default function GroupRoute(props: any) {
  return (
    <ListLayout
      component={<EditGroup groupid={props.match.params.groupid} />}
    />
  );
}
