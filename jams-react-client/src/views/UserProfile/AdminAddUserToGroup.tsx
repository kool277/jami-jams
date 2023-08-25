import React, { FC, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classnames from "classnames";
import i18next from "i18next";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import auth from "auth";

import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";

import { Group, GroupMembership } from "./DisplayUserProfile";
import TemporaryDrawer from "components/Drawer/Drawer";
import configApiCall from "api";
import axios from "axios";
import {
  api_path_get_list_group,
  api_path_post_group_member,
} from "globalUrls";

interface AdminAddUserToGroupProps {
  username: string;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  classes: any;
  groupMemberships: GroupMembership[];
  setGroupMemberships: (groupMemberships: GroupMembership[]) => void;
  removeUserFromGroup: (group: GroupMembership) => void;
}

const AdminAddUserToGroup: FC<AdminAddUserToGroupProps> = ({
  username,
  openDrawer,
  setOpenDrawer,
  classes,
  groupMemberships,
  setGroupMemberships,
  removeUserFromGroup,
}) => {
  if (!auth.hasAdminScope()) {
    return null;
  }

  const history = useHistory();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const tableCellClasses = classnames(classes.tableCell);

  const getAllGroups = (value: string) => {
    if (value === "") value = "*";
    axios(
      configApiCall(
        api_path_get_list_group + "?groupName=" + value,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        const groupResults: Group[] = response.data;

        setGroups(groupResults);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          auth.authenticated = false;
          history.push("/");
        } else {
          setGroups([]);
        }
      });
  };

  const addUserToGroup = (group: Group) => {
    axios(
      configApiCall(
        api_path_post_group_member + group.id,
        "POST",
        { username },
        null
      )
    )
      .then(() => {
        let newGroupMemberships = groupMemberships;
        newGroupMemberships.push({
          groupId: group.id,
          name: group.name,
        });
        setGroupMemberships(newGroupMemberships);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <TemporaryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        direction="right"
        placeholder={i18next.t("add_user_to_group", "Add user to group ...")}
        searchTargets={setSearchValue}
        targets={groups.filter((group) => group.name.includes(searchValue))}
        existingTargets={groupMemberships}
        addElementToTarget={addUserToGroup}
        type="group"
      />
      <GridItem xs={12} sm={12} md={12}>
        <Button
          color="primary"
          onClick={() => {
            setOpenDrawer(true);
            getAllGroups("*");
          }}
        >
          <AddCircleOutlineIcon />{" "}
          {i18next.t("add_user_to_a_group", "Add user to a group")}
        </Button>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                {i18next.t("group_name", "Group name")}
              </TableCell>
              <TableCell align="right">
                {i18next.t("action", "Action")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupMemberships.map((group) => (
              <TableRow
                key={group.groupId + group.name}
                className={classes.tableRow}
              >
                <TableCell className={tableCellClasses}>
                  <Link to={`/group/${group.groupId}`}>{group.name}</Link>
                </TableCell>
                <TableCell align="right" className={classes.tableActions}>
                  <Button
                    color="primary"
                    onClick={() => removeUserFromGroup(group)}
                  >
                    {i18next.t("remove_from_group", "Remove from group")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GridItem>
    </>
  );
};

export default AdminAddUserToGroup;
