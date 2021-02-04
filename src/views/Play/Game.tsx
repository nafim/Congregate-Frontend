import React, { useState, useEffect, useRef} from 'react';
import {
    Collapse,
} from '@material-ui/core';
import {
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
    GamePosition,
    sendGameUpdate,
} from '../../api/GameSocket';
import { makeStyles } from '@material-ui/core/styles';
import StreetView from './components/StreetView';
import EndGameMenu from './components/EndGameMenu';
import constants from '../../constants';
import GameUI from './components/GameUI';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "flex-flow": "column",
        height: "100vh",
        width: "100vw"
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

    const [playerPosition, setPlayerPosition] = useState(props.initialPosition);
    const [otherPlayerPosition, setOtherPlayerPosition] = useState(props.initialPosition);

    const [endGameMessage, setEndGameMessage] = useState('');
    const [endGameMenuOpen, setEndGameMenuOpen] = useState(false);

    const [timeRemaining, setTimeRemaining] = useState(constants.ROUND_TIMER);
    const [gameDuration, setGameDuration] = useState(0);

    const [prevScore, setPrevScore] = useState(0);
    const [score, setScore] = useState(0);
    // set up state ref so async socket callback func can access latest state
    const stateRef = useRef<{score: number, timeRemaining: number}>({score: 0, timeRemaining: 0});
    // array which keeps history of all past positions
    const positionsRef = useRef<GamePosition[]>([]);

    const handleEndGameMenuOpen = (open: boolean) => {
        setEndGameMenuOpen(open);
    }

    // callback function called when player moves in streetview
    const handlePositionChange = (newPosition: GamePosition) => {
        console.log("Have handled game position change");
        sendGameUpdate({pos: newPosition});
        
        // if new position and last position aren't the same, add it to positions history
        const lastPosition = positionsRef.current[positionsRef.current.length - 1];
        if (newPosition.lat !== lastPosition.lat && newPosition.lng !== lastPosition.lng) {
            positionsRef.current.push(newPosition);
        }
        console.log(positionsRef.current);
    }

    // bring player back to last position
    const handleUndoPosition = () => {
        console.log(positionsRef.current.length);
        if (positionsRef.current.length > 1) {
            positionsRef.current.pop();
            setPlayerPosition(positionsRef.current[positionsRef.current.length - 1])
        }
    }

    // when the round restarts, reset the positions history array
    useEffect(() => {
        positionsRef.current = [props.initialPosition];
        setPlayerPosition(props.initialPosition);
    }, [props.initialPosition])

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
        // handle game in progress stuff
        if (gameStatusData.status === GameStatus.InProgress) {
            // calculate game duration
            setGameDuration(constants.ROUND_TIMER - stateRef.current.timeRemaining);
        }
        
        // handle endgame
        if (gameStatusData.status === GameStatus.Win) {
            setEndGameMessage("You Won!");
            setEndGameMenuOpen(true);
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
            <GameUI
                username={props.username}
                timeRemaining={timeRemaining}
                score={score}
                handleUndoPosition={handleUndoPosition}
            />
            <div className={classes.content}>
                <div className={classes.endGame}>
                    <Collapse in={endGameMenuOpen} unmountOnExit>
                        <EndGameMenu 
                            message={endGameMessage}
                            score={score}
                            prevScore={prevScore}
                            gameDuration={gameDuration}
                            handleEndGameMenuOpen={handleEndGameMenuOpen}
                        />
                    </Collapse>
                </div>
                <StreetView
                    apiKey={process.env.REACT_APP_MAPS_API_KEY!}
                    position={playerPosition}
                    markerPosition={otherPlayerPosition}
                    onPositionChanged={handlePositionChange}
                />
            </div>
        </div>
    );
}

export default Game;