import React, { useState, useEffect } from 'react';
import {
    initiateSocket,
    isSocketConnected,
    sendPlayerReady,
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
    subscribeToInitialPosition,
    GameUpdateData,
} from '../api/GameSocket';
import { getAnonymousToken } from '../api/HTTPRequests';
import {
    useParams,
    useHistory,
} from "react-router-dom";
import Game from './Game';
import Loading from './Loading';

interface PlayParams {
    gameID: string;
}

function Play() {
    const { gameID } = useParams<PlayParams>();

    const history = useHistory();

    // set the states
    const [ready, setReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Waiting for other player...");
    const [initialPosition, setInitialPosition] = useState({lat: 42.345573, lng: -71.098326});

    // logic for connecting to the game
    useEffect(() => {
        // if no gameID, then redirect home
        if (!gameID) return history.push('/');
        // if joining from random game matching, socket should already be connected
        if (isSocketConnected()) {
            subscribeToInitialPosition(startingGame);
            sendPlayerReady();
            subscribeToGameStatus(waitForGame);
        } else {
            // get a token if one doesn't already exist, then connect to socket
            const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
            if (token) {
                initiateSocket(token, gameID, afterSocketConnect);
            } else {
                getAnonymousToken()
                .then( anonymousToken => {
                    initiateSocket(anonymousToken, gameID, afterSocketConnect);
                })
            }
        }
    }, [])

    const afterSocketConnect = () => {
        console.log("Connected")
        subscribeToInitialPosition(startingGame);
        sendPlayerReady();
        subscribeToGameStatus(waitForGame);
    }

    const waitForGame = (data: GameStatusData) => {
        if (data.status === GameStatus.Starting) {
            setLoadingMessage("Starting...");
        } else if (data.status === GameStatus.InProgress) {
            setLoadingMessage("Starting...");
        }
    }

    const startingGame = (initialPositionData: GameUpdateData) => {
        console.log("This is the new initial position");
        console.log(initialPositionData.pos);
        setInitialPosition(initialPositionData.pos)
        setReady(true);
    }


    if (ready) {
        return (
            <Game
                position={initialPosition}
            />
        );
    } else {
        return (
            <Loading
                loadingMessage={loadingMessage}
            />
        );
    }
}

export default Play;