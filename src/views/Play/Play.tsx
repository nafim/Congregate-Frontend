import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {
    initiateSocket,
    sendPlayerReady,
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
    subscribeToInitialPosition,
    GameUpdateData,
    requestGameStatus,
    GamePosition,
} from '../../api/GameSocket';
import { grabAndVerifyToken, JWTPayload } from '../../api/HTTPRequests';
import {
    useParams,
    useHistory,
} from "react-router-dom";
import Game from './Game';
import Loading from './Loading';
import { useSnackbar } from 'notistack';
import constants from '../../constants';

interface PlayParams {
    gameID: string;
}

function Play() {
    const { gameID } = useParams<PlayParams>();

    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    // set the states
    const [ready, setReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Waiting for other player...");
    const [initialPosition, setInitialPosition] = useState({lat: 42.345573, lng: -71.098326});
    const [username, setUsername] = useState('');

    // logic for connecting to the game
    useEffect(() => {
        // if no gameID, then redirect home
        if (!gameID) return history.push('/');
        // get a token if one doesn't already exist, then connect to socket
        grabAndVerifyToken()
        .then(token => {
            const decoded = jwt_decode<JWTPayload>(token);
            setUsername(decoded.name);
            initiateSocket(token, gameID, afterSocketConnect);
        })
        .catch(error => {
            enqueueSnackbar(constants.ERROR_MESSAGE, { 
                variant: 'error',
            })
        })
    }, [])

    const afterSocketConnect = () => {
        console.log("Connected")
        subscribeToInitialPosition(startingGame);
        // subscribe to waiting for game just once
        subscribeToGameStatus(waitForGame);
        requestGameStatus();
    }

    const waitForGame = (data: GameStatusData) => {
        if (data.status === GameStatus.InLobby) {
            sendPlayerReady();
        } else {
            setLoadingMessage("Starting...");
        }
    }

    const startingGame = (initialPositionData: GameUpdateData) => {
        console.log("This is the new initial position");
        console.log(initialPositionData.pos);
        setInitialPosition(initialPositionData.pos);
        setReady(true);
    }

    if (ready) {
        return (
            <Game
                initialPosition={initialPosition}
                username={username}
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