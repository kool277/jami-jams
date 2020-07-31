import React from "react";
import { useHistory } from 'react-router-dom';
import classnames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
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

import axios from "axios"
import configApiCall from "../../api"
import {
    api_path_get_list_group,
    api_path_put_update_group,
    api_path_get_auth_contacts
} from "../../globalUrls"

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import devicesStyle from "assets/jss/material-dashboard-react/components/devicesStyle.js";

import TemporaryDrawer from "components/Drawer/Drawer"

const styles = ()=> ( {
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
});

const useStyles = makeStyles(styles);

export default function EditGroup(props) {
    const classes = useStyles();
    const history = useHistory();
    const [groupExists, setGroupExists] = React.useState(false)

    const [name, setName] = React.useState("")
    const [groupMembers, setGroupMembers] = React.useState([])

    const [openDrawer, setOpenDrawer] = React.useState(false);

    const getAllGroupMembers = () => {
        /*
            TODO: Include the username of the user of witch we want to display contacts
            at the moment the admin sees his contacts in each user profile he visits
        */ 
        // axios(configApiCall(api_path_get_list_group, 'GET', {"groupName": props.groupName}, null)).then((response) => {
        axios('../groups.json').then((response) => {
            response.data.map((group) => {
                if(group.name == props.groupName){
                    setGroupMembers(group["groupMembers"])
                }
            })
        }).catch((error) => {
            console.log("Error fetching group members of: " + props.groupName + " " + error)
        })
    }

    React.useEffect(()=>{
        setName(props.groupName)
        // axios(configApiCall(api_path_get_list_group, 'GET', {"groupName": props.groupName}, null)).then((response) => {
        axios('../groups.json').then((response) => {
            response.data.map((group) => {
                if(group.name == props.groupName){
                    setGroupMembers(group["groupMembers"])
                }
            })
        }).catch((error) => {
            console.log("Error fetching group members of: " + props.groupName + " " + error)
        })
    }, [])


    // const getUserDetails = () => {
    //     axio
    // }

    const handleGroupUpdate = (data) => {
        props.setName(data.name)
        props.setGroupMembers(data.groupMembers)
    }

    const handleUpdateGroup = () => {
        const data = {
            'name': name,
            'groupMembers': groupMembers
        }
        //TODO: Add blueprint to data to update the blueprint using the blueprintName

        axios(configApiCall(api_path_put_update_group, 'PUT', data, null)).then((response) => {
            handleGroupUpdate(data);
        }).catch((error) => {
            console.log("Error updating group: " + error)
        })
    }

    const tableCellClasses = classnames(classes.tableCell);

    return(
        <div>
            <TemporaryDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} getAllContacts={getAllGroupMembers} direction="right"/>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <Card profile>
                        <CardHeader color="info" stats icon>
                            <CardIcon color="info">
                                <EditIcon />
                            </CardIcon>
                            <p className={classes.cardCategory}>Edit group</p>
                            <h3 className={classes.cardTitle}>{props.groupName}</h3>
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
                                                onChange={e => {
                                                    setName(e.target.value);
                                                    props.initCheckGroupNameExists(e.target.value)
                                                    if(!props.groupNameExits){
                                                        handleUpdateGroup()
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                fullWidth
                                                value={props.selectedBlueprint.value}
                                                onChange={props.handleBlueprintsChange}
                                                variant="outlined"
                                                children={props.blueprintsOptionsItems}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                    <Button color="primary" onClick={() => {setOpenDrawer(true)}}><AddCircleOutlineIcon /> Add user to {props.groupName}</Button>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupMembers.map(user =>
                            <TableRow key={user} className={classes.tableRow}>
                            <TableCell className={tableCellClasses}>
                                {user}
                            </TableCell>
                            <TableCell align="right" className={classes.tableActions}>
                                <Button color="primary">Remove user</Button>
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