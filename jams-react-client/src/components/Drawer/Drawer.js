import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CustomInput from "components/CustomInput/CustomInput.js";
import Drawer from '@material-ui/core/Drawer';
import Search from "@material-ui/icons/Search";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import LinearProgress from '@material-ui/core/LinearProgress';

import {api_path_get_user_directory_search, api_path_get_auth_contacts} from 'globalUrls'
import { useHistory } from 'react-router-dom';
import axios from "axios";
import configApiCall from "api.js";
import auth from 'auth.js'

import { debounce } from "lodash";

const useStyles = makeStyles({
    list: {
        width: 500,
    },
    fullList: {
        width: 'auto',
    },
    search : {
        width: "100%"
    },
    margin: {
        marginLeft: "5px",
        marginRight: "5px"
    }
});

export default function TemporaryDrawer(props) {
  const classes = useStyles();
  const history = useHistory();
  const [direction, setDirection] = React.useState(props.direction);
  const [contacts, setContacts] = React.useState([]);

  useEffect(() => {
        /**
         * Get contact list to pass to the drawer to add contacts to user
         */
        axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString":"*"}, null)).then((response)=>{
            setContacts(response.data)
        }).catch((error) =>{
            console.log(error);
            if(error.response.status == 401){
                auth.authenticated = false
                history.push('/')
            }
        });
  }, [])

  const addContact = (jamiId) => {
        axios(configApiCall(api_path_get_auth_contacts, 'PUT', {"uri": "jami://" + jamiId}, null)).then((response)=>{
            props.setOpenDrawer(false)
            props.getAllContacts()
        }).catch((error) =>{
            console.log("Error adding user: " + error)
            props.setOpenDrawer(false)
        });
  }

  const searchContacts = (value) => {
    axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString": value ? value : "*"}, null)).then((response)=>{
        setContacts(response.data)
    }).catch((error) =>{
        console.log(error);
        setContacts([])
        if(error.response.status == 401){
            auth.authenticated = false
            history.push('/')
        }
    });

  }

  const listContacts = () => (

        <List>
            {contacts.map((contact) => (
            <ListItem button key={contact.username} onClick={() => {addContact(contact.jamiId)}} >
                <AddCircleOutlineIcon style={{ marginRight: "10px"}} /><ListItemText primary={contact.username} />
            </ListItem>
            ))}
        </List>
  );

  const initSearchContacts = useCallback(debounce((searchValue) => searchContacts(searchValue), 500), [])

  const handleSearchContacts = (e) => {
    const searchValue = e.target.value;
    initSearchContacts(searchValue)
  } 
  

  return (
    <div>
        <React.Fragment key={props.direction}>
            <Drawer 
                anchor="right"
                open={props.openDrawer} 
                onClose={() => {props.setOpenDrawer(false)}}>
                <div
                    className={clsx(classes.list, {
                        [classes.fullList]: direction === 'top' || direction === 'bottom',
                    })}
                    role="presentation"
                    >
                    <div className={classes.searchWrapper}>
                        <CustomInput 
                        formControlProps={{
                            className: classes.margin + " " + classes.search
                        }}
                        inputProps={{
                            placeholder: "Add a contact ...",
                            inputProps: {
                            "aria-label": "Add a contact"
                            },
                            onKeyUp: handleSearchContacts,
                        }}
                        />
                    </div>
                    <Divider />
                    {listContacts()}
                </div>
            </Drawer>
        </React.Fragment>
    </div>
  );
}
