import React, { useState, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Badge,
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
    sendGameUpdate,
} from '../../api/GameSocket';
import { useHistory } from "react-router-dom";
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
import StreetView from './components/StreetView';
import ChatWindow from './components/ChatWindow';
import EndGameMenu from './components/EndGameMenu';
import constants from '../../constants';

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
    initialPosition: GamePosition;
    username: string;
}

function Game(props: GameProps) {
    const classes = useStyles();
    const history = useHistory();

    const [otherPlayerPosition, setOtherPlayerPosition] = useState({lat: 42.345573, lng: -71.098326});

    const [chatOpen, setChatOpen] = useState(false);
    const [chatUnreadNumber, setChatUnreadNumber] = useState(0);

    const [endGameMessage, setEndGameMessage] = useState('');
    const [endGameMenuOpen, setEndGameMenuOpen] = useState(false);

    const [timeRemaining, setTimeRemaining] = useState(constants.ROUND_TIMER);
    const [gameDuration, setGameDuration] = useState(0);

    const [prevScore, setPrevScore] = useState(0);
    const [score, setScore] = useState(0);
    // set up state ref so async socket callback func can access latest state
    const stateRef = useRef<{score: number, timeRemaining: number}>({score: 0, timeRemaining: 0});

    const handleChatToggle = () => {
        setChatOpen(!chatOpen);
        setChatUnreadNumber(0);
    }

    const incrementChatUnread = () => {
        setChatUnreadNumber(chatUnreadNumber => chatUnreadNumber + 1);
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
        const newTimeRemaining = timeRemaining < 0 ? 0 : timeRemaining;
        const minutes = Math.floor(newTimeRemaining/60);
        let seconds = Math.floor(newTimeRemaining % 60);
        let secondString;
        if (seconds < 10) {
            secondString = "0" + seconds;
        } else {
            secondString = String(seconds);
        }
        
        return (`${minutes}:${secondString}`);
    }

    // set up interval to calculate the time remaining
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

    // set up state ref with latest state values
    useEffect(() => {
        stateRef.current = { timeRemaining, score };
    },[timeRemaining, score])

    // subscribe to game status changes
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
            setGameDuration(constants.ROUND_TIMER - gameStatusData.timeRemaining);
        }
        if (gameStatusData.status === GameStatus.Loss) {
            setEndGameMessage("Time's Up!");
            setEndGameMenuOpen(true);
            // previous score is same current score
            setPrevScore(stateRef.current.score);
            // calculate game duration
            setGameDuration(constants.ROUND_TIMER - gameStatusData.timeRemaining);
        }
        // synchornize the time remaining
        if (Math.abs(gameStatusData.timeRemaining - stateRef.current.timeRemaining) > 1 ){
            console.log('resyncrhonize time');
            setTimeRemaining(gameStatusData.timeRemaining);
        }
        // set the score
        if (gameStatusData.score !== stateRef.current.score) {
            console.log('score changed')
            setPrevScore(stateRef.current.score);
            setScore(gameStatusData.score);
        }

        // update the position of the other player
        const otherPlayers = gameStatusData.players.filter(player => player.username !== props.username);
        if (otherPlayers.length > 0) {
            if (otherPlayers[0].pos) {
                setOtherPlayerPosition(otherPlayers[0].pos);
            }
        }
    }

    return (
        <div className={classes.root}>
            <div className={clsx(classes.topBar, {[classes.topBarShift]: chatOpen,})}>
                <AppBar position="static">
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
                        {!chatOpen && 
                        <IconButton edge="start" className={classes.chatButton} color="inherit" aria-label="chat"
                            onClick={handleChatToggle}
                        >
                            <Badge color="secondary" badgeContent={chatUnreadNumber} max={9}>
                                <ChatIcon />
                            </Badge>
                        </IconButton>}
                    </Toolbar>
                </AppBar>
                <ChatWindow
                    chatOpen={chatOpen}
                    username={props.username}
                    handleChatToggle={handleChatToggle}
                    incrementChatUnread={incrementChatUnread}
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
                    position={props.initialPosition}
                    markerPosition={otherPlayerPosition}
                    onPositionChanged={handlePositionChange}
                />
            </div>
        </div>
    );
}

export default Game;