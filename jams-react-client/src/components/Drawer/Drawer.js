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

import {api_path_get_user_directory_search, api_path_get_auth_contacts, api_path_put_update_group} from 'globalUrls'
import { useHistory } from 'react-router-dom';
import axios from "axios";
import configApiCall from "api.js";
import auth from 'auth.js'

import { debounce } from "lodash";
import {api_path_get_list_group} from "../../globalUrls";

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
    const [users, setUsers] = React.useState([]);
    const [userAdded, setUserAdded] = React.useState(false);
    let addingToGroup = props.addingToGroup;

    useEffect(() => {
        /**
         * Get users list to pass to the drawer to add contacts to user or users to group
         */
        axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString":"*"}, null)).then((response)=>{
            setUsers(response.data)
        }).catch((error) =>{
            console.log(error);
            if(error.response.status == 401){
                auth.authenticated = false
                history.push('/')
            }
        });
    }, [userAdded])

    const addContactToUser = (jamiId) => {
        axios(configApiCall(api_path_get_auth_contacts, 'PUT', {"uri": "jami://" + jamiId}, null)).then((response)=>{
            props.setOpenDrawer(false)
            props.getAllUsers()
        }).catch((error) =>{
            console.log("Error adding user: " + error)
            props.setOpenDrawer(false)
        });
    }

    const addUserToGroup = (username) => {
        let url = '';
        if(props.selectedBlueprint == ''){
            url = api_path_put_update_group+"?groupName="+props.groupName+"&newName="+props.groupName+"&blueprintName=&groupMembers="+username;
        }else{
            console.log(props.blueprintsOptions)
            url = api_path_put_update_group+"?groupName="+props.groupName+"&newName="+props.groupName+"&blueprintName="+props.blueprintsOptions[props.selectedBlueprint].label+"&groupMembers="+username;
        }

        axios(configApiCall(url, 'PUT', null, null)).then((response) => {
            setUserAdded(true);
            props.getGroup()
            props.setOpenDrawer(false)
            
        }).catch((error) =>{
            console.log("Error adding user: " + error)
            props.setOpenDrawer(false)
        });
    }


    const searchUsers = (value) => {
        axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString": value ? value : "*"}, null)).then((response)=>{
            setUsers(response.data)
        }).catch((error) =>{
            console.log(error);
            setUsers([])
            if(error.response.status == 401){
                auth.authenticated = false
                history.push('/')
            }
        });

    }

    const listUsers = () => (

        <List>
            {users.map((user) => (
                addingToGroup
                    ?
                    <ListItem button key={user.username} onClick={() => {addUserToGroup(user.username)}} >
                        <AddCircleOutlineIcon style={{ marginRight: "10px"}} /><ListItemText primary={user.username} />
                    </ListItem>
                    :
                    <ListItem button key={user.username} onClick={() => {addContactToUser(user.jamiId)}} >
                        <AddCircleOutlineIcon style={{ marginRight: "10px"}} /><ListItemText primary={user.username} />
                    </ListItem>

            ))
            }
        </List>
    );

    const initSearchUsers = useCallback(debounce((searchValue) => searchUsers(searchValue), 500), [])

    const handleSearchUsers = (e) => {
        const searchValue = e.target.value;
        initSearchUsers(searchValue)
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
                                    onKeyUp: handleSearchUsers,
                                }}
                            />
                        </div>
                        <Divider />
                        {listUsers()}
                    </div>
                </Drawer>
            </React.Fragment>
        </div>
    );
}
