import React, { useState, useEffect} from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Button,
    Fade,
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
} from '../../api/GameSocket';
import { useHistory } from "react-router-dom";
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
import StreetView from './components/StreetView';
import ChatWindow from './components/ChatWindow';
import EndGameMenu from './components/EndGameMenu';
import game_settings from '../../game_settings';

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
    endGame: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        zIndex: 2,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    content: {
        height: "100%",
        display: "flex"
    }
}));

interface GameProps{
    position: GamePosition;
    username: string;
}

function Game(props: GameProps) {
    const classes = useStyles();
    const history = useHistory();

    const [chatOpen, setChatOpen] = useState(false);
    const [endGameMessage, setEndGameMessage] = useState('');
    const [endGameMenuOpen, setEndGameMenuOpen] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(game_settings.ROUND_TIMER);
    const [prevScore, setPrevScore] = useState(0);
    const [score, setScore] = useState(0);
    const [gameDuration, setGameDuration] = useState(0);

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
        console.log("Have handled game position change");
        sendGameUpdate({pos: newPosition});
    }

    const showTimer = () => {
        const minutes = Math.floor(timeRemaining/60);
        let seconds = Math.floor(timeRemaining % 60);
        let secondString;
        if (seconds < 10) {
            secondString = "0" + seconds;
        } else {
            secondString = String(seconds);
        }
        
        return (`${minutes}:${secondString}`);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            return setTimeRemaining(timeRemaining => {
                if (timeRemaining > 0) {
                    return timeRemaining - 1
                } else {
                    return 0;
                }
            });
        }, 1000);
        return (() => clearInterval(interval))
    }, [])

    useEffect(() => {
        subscribeToGameStatus(handleGameStatus);
    },[])

    const handleGameStatus = (gameStatusData: GameStatusData) => {
        console.log("have received game status update")
        // handle endgame
        if (gameStatusData.status === GameStatus.Win) {
            setEndGameMessage("You Won!");
            setEndGameMenuOpen(true);
            // calculate game duration
            setGameDuration(game_settings.ROUND_TIMER - gameStatusData.timeRemaining);
        }
        if (gameStatusData.status === GameStatus.Loss) {
            setEndGameMessage("Time's Up!");
            setEndGameMenuOpen(true);
            // calculate game duration
            setGameDuration(game_settings.ROUND_TIMER - gameStatusData.timeRemaining);
        }
        // synchornize the time remaining
        if (Math.abs(gameStatusData.timeRemaining - timeRemaining) > 1 ){
            console.log('resyncrhonize time');
            setTimeRemaining(gameStatusData.timeRemaining);
        }
        // set the score
        if (gameStatusData.score !== score) {
            setPrevScore(score);
            setScore(gameStatusData.score);
        }
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
                            Score: {score}
                        </Typography>
                        <Typography variant="h6" className={classes.title}>
                            Time Remaining: {showTimer()}
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
                    username={props.username}
                    handleChatToggle={handleChatToggle}
                />
            </div>
            <div className={classes.content}>
                <div className={classes.endGame}>
                    {
                        endGameMenuOpen &&
                        <Fade in={endGameMenuOpen}>
                        <EndGameMenu 
                            message={endGameMessage}
                            score={score}
                            prevScore={prevScore}
                            gameDuration={gameDuration}
                            handleEndGameMenuOpen={handleEndGameMenuOpen}
                        />
                        </Fade>
                    }
                </div>
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