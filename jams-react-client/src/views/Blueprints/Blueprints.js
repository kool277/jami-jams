import React, { useCallback, useEffect } from "react";
import { useHistory } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import IconButton from '@material-ui/core/IconButton';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import GroupIcon from '@material-ui/icons/Group';
import Search from "@material-ui/icons/Search";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import AllInbox from "@material-ui/icons/AllInbox"
import axios from "axios";
import configApiCall from "api.js";
import auth from 'auth.js'
import { api_path_blueprints } from "globalUrls";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

import LinearProgress from '@material-ui/core/LinearProgress';

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

import Blueprint from 'views/Blueprint/Blueprint'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { debounce } from "lodash";

const styles = {
    ...headerLinksStyle,
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
    deleteIcon : {
        float: "right"
    },  
    search : {
        width: "90%"
    },
    loading: {
        width: '100%',
    }
};

const useStyles = makeStyles(styles);

export default function Blueprints() {
    const classes = useStyles();
    const history = useHistory();
    const [blueprints, setBlueprints] = React.useState([])
    const [selectedBlueprint, setSelectedBlueprint] = React.useState(false)
    const [selectedBlueprintName, setSelectedBlueprintName] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [progress, setProgress] = React.useState(0);
    const [searchValue, setSearchValue] = React.useState(false)

    const [blueprintName, setBlueprintName] = React.useState()
    const [blueprintNameExits, setBlueprintNameExits,] = React.useState()
    const [open, setOpen] = React.useState(false)

    const [removedBlueprint, setRemovedBlueprint] = React.useState()
    const [openRemoveDialog, setOpenRemoveDialog] = React.useState()

    useEffect(() => {
        setLoading(true)
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
              if (oldProgress === 100) {
                return 0;
              }
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 500);
        axios(configApiCall(api_path_blueprints+"?groupName=*", 'GET', null, null)).then((response)=> {
            setBlueprints(response.data)
            setLoading(false)
        }).catch((error) =>{
            setBlueprints([])
            console.log(error);
            if(error.response.status == 401){
                auth.authenticated = false
                history.push('/')
            }
        });
        return () => {
            clearInterval(timer);
          };
    }, []);

    function redirectToBlueprint(e, blueprintNameRedirect) {
        e.preventDefault()
        setSelectedBlueprint(true)
        setSelectedBlueprintName(blueprintNameRedirect)
    }
    function redirectToBlueprints(e) {
        e.preventDefault()
        setSelectedBlueprint(false);
        history.push('/admin/blueprints')
    }

    const handleCheckBlueprintNameExists = (searchBlueprintNameValue) => {
        axios(configApiCall(api_path_blueprints+"?groupName="+searchBlueprintNameValue, 'GET', null, null)).then((response)=>{
            setBlueprintNameExits(false)
        }).catch((error) =>{
            setBlueprintNameExits(true)
        });
    }

    const initCheckBlueprintNameExists = useCallback(debounce((searchBlueprintNameValue) => handleCheckBlueprintNameExists(searchBlueprintNameValue), 500), [])

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateUser = () => {
        axios(configApiCall(api_path_blueprints+"?groupName="+blueprintName+"&username=admin&policyData="+blueprintName, 'POST', null, null)).then((response)=>{
            console.log("Successfully  create "  + blueprintName)
        }).catch((error) =>{
            console.log("Could not create "  + blueprintName + " " + error)
        });
        setOpen(false);
        history.push('/admin/blueprints')
    }

    const handleRemoveBlueprint = (blueprintRemovedName) => {
        setRemovedBlueprint(blueprintRemovedName)
        setOpenRemoveDialog(true)
    }

    const removeBlueprint = () => {
        axios(configApiCall(api_path_blueprints+"?groupName="+removedBlueprint, 'DELETE', {"queryString": removedBlueprint}, null)).then((response)=>{
            console.log("Successfully  create "  + removedBlueprint)
        }).catch((error) =>{
            console.log("Could not create "  + removedBlueprint + " " + error)
        });
        setOpenRemoveDialog(false);
        history.push('/admin/blueprints')
    }

    if (!auth.hasAdminScope()) {
        return (
            <div>
                <h4>You are not allowed to access this section. Please contact your administrator to get administrator privileges.</h4>
            </div>
        )
    } else if(selectedBlueprint && auth.hasAdminScope()){
        return (
            <div>
                <Button variant="contained" color="info" href="#contained-buttons" onClick={redirectToBlueprints} style={{color: "white"}}>
                    <KeyboardReturnIcon /> return to blueprints
                </Button>
                <Blueprint blueprintName={selectedBlueprintName}/>
            </div>
        )
    }
    else {
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Create blueprint"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormControl className={classes.margin} size="large" error={blueprintNameExits}>
                                <InputLabel htmlFor="blueprintName">Blueprint name</InputLabel>
                                <Input
                                id="blueprintName"
                                placeholder={blueprintName}
                                startAdornment={
                                    <InputAdornment position="start">
                                    <AllInbox />
                                    </InputAdornment>   
                                }
                                onChange={e => {
                                    const searchBlueprintNameValue = e.target.value;
                                    setBlueprintName(searchBlueprintNameValue);
                                    initCheckBlueprintNameExists(blueprintName);
                                }}
                                />
                        </FormControl>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="danger">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateUser} color="primary" autoFocus>
                        Create
                    </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openRemoveDialog}
                    onClose={() => setOpenRemoveDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Remove blueprint"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete <strong>{removedBlueprint}</strong> ?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={removeBlueprint} color="danger" autoFocus>
                        Remove
                    </Button>
                    </DialogActions>
                </Dialog>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        {auth.isLocalDirectory() &&
                            <Button variant="contained" color="primary" href="#contained-buttons" onClick={e => setOpen(true)}>
                                <AddCircleOutlineIcon /> Create blueprint
                            </Button>
                        }
                        <div className={classes.searchWrapper}>
                            <CustomInput 
                            formControlProps={{
                                className: classes.margin + " " + classes.search
                            }}
                            inputProps={{
                                placeholder: "Search blueprints ...",
                                inputProps: {
                                "aria-label": "Search blueprints"
                                },
                                onKeyUp: (e) => setSearchValue(e.target.value),
                            }}
                            />
                            <Search />
                            <div className={classes.loading}>
                                {loading && <LinearProgress variant="determinate" value={progress} />}
                            </div>
                        </div>
                    </GridItem>
                    {
                    blueprints.map(blueprint =>
                    <GridItem xs={12} sm={12} md={2} key={blueprint.blueprintName}>
                            
                                <Card profile>
                                    <CardBody profile>
                                        <a href="#" onClick={(e) => redirectToBlueprint(e, blueprint.blueprintName)}>

                                        <h3 className={classes.cardTitle}>{blueprint.blueprintName ? blueprint.blueprintName : 'No blueprint name'}</h3>
                                        <strong>Description:</strong>
                                        <p>{blueprint.description ? blueprint.description : 'No description'}</p>
                                        <ul>
                                            <li><GroupIcon fontSize='small' style={{marginRight: "10px"}} /> {blueprint.usersCount ? blueprint.usersCount + ' user(s)' : 'No users count'}</li>
                                        </ul>
                                        </a>
                                    </CardBody>
                                    <CardFooter>
                                        <IconButton color="secondary" onClick={ () => {handleRemoveBlueprint(blueprint.blueprintName)}}><DeleteOutlineIcon /></IconButton>
                                    </CardFooter>
                                </Card>

                    </GridItem>)
                    }
                </GridContainer>
            </div>
        );
    }
}
