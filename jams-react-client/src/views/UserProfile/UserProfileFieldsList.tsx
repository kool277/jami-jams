import React, { FC } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";

import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PhoneForwardedOutlinedIcon from "@mui/icons-material/PhoneForwardedOutlined";

import PersonIcon from "@mui/icons-material/Person";
import { UserProfile } from "./DisplayUserProfile";

interface UserProfileFieldsListProps {
  user: UserProfile;
}

const UserProfileFieldsList: FC<UserProfileFieldsListProps> = ({ user }) => {
  return (
    <Grid item xs={12} sm={12} md={6}>
      <List dense={false}>
        {(user.firstName || user.lastName) && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${user.firstName} ${user.lastName}`} />
          </ListItem>
        )}
        {user.phoneNumber && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PhoneInTalkOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.phoneNumber} />
          </ListItem>
        )}
        {user.organization && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <BusinessCenterOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.organization} />
          </ListItem>
        )}
      </List>

      <List dense={false}>
        {user.email && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AlternateEmailOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.email} />
          </ListItem>
        )}
        {user.phoneNumberExtension && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PhoneForwardedOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.phoneNumberExtension} />
          </ListItem>
        )}
        {user.mobileNumber && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <SmartphoneOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.mobileNumber} />
          </ListItem>
        )}
        {user.faxNumber && (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LocalPrintshopOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.faxNumber} />
          </ListItem>
        )}
      </List>
    </Grid>
  );
};

export default UserProfileFieldsList;
