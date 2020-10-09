import React from "react";
import { useHistory } from 'react-router-dom';
import classnames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import Table from "@material-ui/core/Table";
import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import Select from "@material-ui/core/Select";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';

import axios from "axios"
import configApiCall from "../../api"
import {
    api_path_get_list_group,
    api_path_put_update_group,
    api_path_blueprints,
    api_path_get_auth_contacts
} from "../../globalUrls"

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import devicesStyle from "assets/jss/material-dashboard-react/components/devicesStyle.js";

import TemporaryDrawer from "components/Drawer/Drawer"
import * as tool from "../../tools";
import auth from 'auth.js'

import i18next from "i18next";

const useStyles = makeStyles((theme) => ({
    ...devicesStyle,
    ...dashboardStyle,
    root: {
        flexGrow: 1
    },
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    },
    input: {
        display: 'none',
    },
    profileAsBackground: {
        backgroundSize: "100% 100%",
        width: "80px",
        height: "80px",
    },
    centerIconMiddle: {
        position:"relative",
        top: "20px",
        left: "15px"
    },
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '60vh',
        minWidth: '80vh',
        maxWidth: '80vh'
    }
}));

export default function EditGroup(props) {
    const classes = useStyles();

    const [name, setName] = React.useState(props.groupName);
    const [newName, setNewName] = React.useState(props.groupName);
    const [blueprint, setBlueprint] = React.useState(null);
    const [groupMembers, setGroupMembers] = React.useState([]);
    const [openDrawer, setOpenDrawer] = React.useState(false);

    const getGroup = () => {
        axios(configApiCall(api_path_get_list_group+"?groupName="+props.groupName, 'GET', null, null)).then((response) => {
            let groups=response.data;
            if(groups.length > 1){
                groups.map((group) => {
                    if(group.name == props.groupName){
                        props.getBlueprintsOptions().forEach((blueprintOption) => {
                            if(blueprintOption.label === group["blueprint"]){
                                console.log("Group option value : " + blueprintOption.value);
                                setBlueprint(blueprintOption.value);
                            }
                        })
                        setGroupMembers(group["groupMembers"]);
                    }
                })
            }
            else{
                if(groups.name == props.groupName){
                    props.getBlueprintsOptions().forEach((blueprintOption) => {
                        if(blueprintOption.label === groups["blueprint"]){
                            setBlueprint(blueprintOption.value)
                        }
                    })
                    setGroupMembers(groups.groupMembers)
                }
            }

        }).catch((error) => {
            console.log("Error fetching group members of: " + props.groupName + " " + error)
        })
    }

    const getGroupsOptions = () => {
        let blueprintsOptions = []
        let index = 0
        if(props.blueprints.length === 0)
            blueprintsOptions.push({value: index, label: "No blueprint found"})
        else {
            props.blueprints.map((blueprintElement) => {
                blueprintsOptions.push({value: index, label: blueprintElement.name});
                index += 1
            })
        }
        return blueprintsOptions
    }

    const blueprintsOptionsItems = tool.buildSelectMenuItems(getGroupsOptions());

    React.useEffect(()=>{
        getGroup();
    }, [])

    const handleUpdateGroup = (blueprintValue) => {

        let url = '';
        if(blueprintValue == null){
            url = api_path_put_update_group+"?groupName="+props.groupName+"&newName="+name+"&blueprintName=&groupMembers=";
        }else{
            url = api_path_put_update_group+"?groupName="+props.groupName+"&newName="+name+"&blueprintName="+props.getBlueprintsOptions()[blueprintValue].label+"&groupMembers=";
        }

        axios(configApiCall(url, 'PUT', null, null)).then((response) => {
            setNewName(name);
            getGroup();
        }).catch((error) => {
            console.log("Error updating group: " + error)
        })
    }

    const removeUserFromGroup = (user) => {

        let url = '';
        if(blueprint == null){
            url = api_path_put_update_group+"?groupName="+props.groupName+"&newName="+props.groupName+"&blueprintName=&groupMembers="+[user,];
        }else{
            url = api_path_put_update_group+"?groupName="+props.groupName+"&newName="+props.groupName+"&blueprintName="+props.getBlueprintsOptions()[blueprint].label+"&groupMembers="+[user,];
        }

        axios(configApiCall(url, 'PUT', null, null)).then((response) => {
            getGroup()
        }).catch((error) => {
            console.log("Error updating group: " + error)
        })
    }

    const handleBlueprintsChange = (blueprintValue) => {
        setBlueprint(blueprintValue)
        handleUpdateGroup(blueprintValue)
    }

    const tableCellClasses = classnames(classes.tableCell);

    return(
        <div>
            <TemporaryDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} direction="right" addingToGroup={true} placeholder="Add user ..." groupName={name === ''?props.groupName:name} blueprintLabel={ blueprint == null ? null : props.getBlueprintsOptions()[blueprint].label} getGroup={getGroup}/>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <Card profile>
                        <CardHeader color="info" stats icon>
                            <CardIcon color="info">
                                <EditIcon />
                            </CardIcon>
                                <p className={classes.cardCategory}>{i18next.t("edit_group", "Edit group")}</p>
                            <h3 className={classes.cardTitle}>{newName}</h3>
                        </CardHeader>
                        <CardBody profile>
                            <div className={classes.root}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl className={classes.margin} size="medium" error={props.groupNameExits}>
                                            <Input
                                                id="name"
                                                placeholder={props.groupName}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <PeopleOutlineIcon />
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <IconButton color="primary" aria-label="upload picture" component="span"
                                                        onClick={() => {
                                                            handleUpdateGroup(blueprint);
                                                        }} 
                                                        disabled={props.groupNameExits}
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                }
                                                onChange={e => {
                                                    setName(e.target.value);
                                                    props.initCheckGroupNameExists(e.target.value)
                                                }}
                                            />
                                        </FormControl>                                        
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                fullWidth
                                                value={blueprint}
                                                onChange={(e) => handleBlueprintsChange(e.target.value)}
                                                variant="outlined"
                                                children={blueprintsOptionsItems}
                                                disabled={props.blueprints.length === 0}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Button color="primary" onClick={() => {setOpenDrawer(true)}}><AddCircleOutlineIcon /> {i18next.t("add_user_to", "Add user to")} {props.groupName}</Button>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{i18next.t("username", "Username")}</TableCell>
                                <TableCell align="right">{i18next.t("action", "Action")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupMembers.map(user =>
                                <TableRow key={user} className={classes.tableRow}>
                                    <TableCell className={tableCellClasses}>
                                        {user}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableActions}>
                                        <Button color="primary" onClick={() => removeUserFromGroup(user)}>{i18next.t("remove_user", "Remove user")}</Button>
                                    </TableCell>
                                </TableRow>
                            ) }
                        </TableBody>
                    </Table>
                </GridItem>
            </GridContainer>
        </div>
    );
}