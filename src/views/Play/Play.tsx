import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Box,
    Typography,
    Drawer,
    Hidden,
} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
import StreetView from '../components/StreetView';
import ChatWindow from '../components/ChatWindow';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "flex-flow": "column",
        height: "100vh",
        width: "100vw"
    },
    topBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    topBarShift: {
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            })
        }
    },
    chatButton: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(2)
    },
    title: {
        flexGrow: 1,
    },
    content: {
        height: "100%",
        display: "flex"
    }
}));

function Play() {
    const classes = useStyles();

    const [chatOpen, setChatOpen] = useState(false);

    const handleChatToggle = () => {
        setChatOpen(!chatOpen);
    }

    const streetViewOptions = {
        position: { lat: 37.869260, lng: -122.254811 },
        pov: { heading: 165, pitch: 0 },
        motionTracking: false,
        motionTrackingControl: false,
        addressControl: false,
    };

    return (
        <div className={classes.root}>
            <div className={clsx(classes.topBar, {[classes.topBarShift]: chatOpen,})}>
                <AppBar style={{backgroundColor: "#4a4a50"}} position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                        </Typography>
                        <Typography variant="h6" className={classes.title}>
                            Time Remaining: 5:00
                        </Typography>
                        <Button color="inherit">Quit</Button>
                        <IconButton edge="start" className={classes.chatButton} color="inherit" aria-label="chat"
                            onClick={handleChatToggle}
                        >
                            <ChatIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <ChatWindow
                    chatOpen={chatOpen}
                    handleChatToggle={handleChatToggle}
                />
            </div>
            <div className={classes.content}>
                <StreetView
                    apiKey={process.env.REACT_APP_MAPS_API_KEY!}
                    streetViewOptions={streetViewOptions}
                    onPositionChanged={() => { }}
                />
            </div>
        </div>
    );
}

export default Play;