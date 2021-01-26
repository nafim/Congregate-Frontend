import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from '@material-ui/core';
import {
    disconnectSocket,
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
    GamePosition,
    GameUpdateData,
    sendGameUpdate,
} from '../api/GameSocket';
import { useHistory } from "react-router-dom";
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
import StreetView from './components/StreetView';
import ChatWindow from './components/ChatWindow';
import EndGameMenu from './components/EndGameMenu';

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

interface GameProps{
    position: GamePosition;
}

function Game(props: GameProps) {
    const classes = useStyles();
    const history = useHistory();

    const [chatOpen, setChatOpen] = useState(false);
    const [endGameMessage, setEndGameMessage] = useState('');
    const [endGameMenuOpen, setEndGameMenuOpen] = useState(false);
    const [timeRemaining, setTimeRemainging] = useState(300);

    const handleChatToggle = () => {
        setChatOpen(!chatOpen);
    }

    const handleExit = () => {
        disconnectSocket();
        history.push('/');
    }

    const handleEndGameMenuOpen = (open: boolean) => {
        setEndGameMenuOpen(open);
    }

    const handlePositionChange = (newPosition: GamePosition) => {
        sendGameUpdate({pos: newPosition});
    }

    const timer = () => {
        return (`${Math.floor(timeRemaining/60)}:${Math.round(timeRemaining % 60)}`);
    }

    useEffect(() => {
        subscribeToGameStatus(handleGameStatus);
    })

    const handleGameStatus = (gameStatusData: GameStatusData) => {
        if (gameStatusData.status === GameStatus.Win) {
            setEndGameMessage("You found your friend!");
            setEndGameMenuOpen(true);
        }
        if (gameStatusData.status === GameStatus.Loss) {
            setEndGameMessage("Time's Up!");
            setEndGameMenuOpen(true);
        }
        setTimeRemainging(gameStatusData.timeRemaining);
    }

    const streetViewOptions = {
        position: props.position,
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
                            Time Remaining: {timer()}
                        </Typography>
                        <Button 
                            color="inherit"
                            onClick={e => handleExit()}
                        >
                            Exit
                        </Button>
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
                {
                    endGameMenuOpen &&
                    <EndGameMenu
                        message={endGameMessage}
                        handleEndGameMenuOpen={handleEndGameMenuOpen}
                    />
                }
                <StreetView
                    apiKey={process.env.REACT_APP_MAPS_API_KEY!}
                    streetViewOptions={streetViewOptions}
                    onPositionChanged={handlePositionChange}
                />
            </div>
        </div>
    );
}

export default Game;