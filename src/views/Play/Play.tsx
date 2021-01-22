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
    initiateSocket,
    disconnectSocket,
    sendPlayerReady,
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
    subscribeToInitialPosition,
    GameUpdateData,
} from '../components/GameSocket';
import Game from './Game';
import Loading from './Loading';


function Play() {
    const [ready, setReady] = useState(false);
    // position of fenway
    var initialPosition = {lat: 42.345573, lng: -71.098326};

    const setInitialPosition = (initialPositionData: GameUpdateData) => {
        console.log("Got an initial position");
        console.log(initialPositionData.pos);
        initialPosition = initialPositionData.pos;
        console.log("this is the new init pos:", initialPosition);
        setReady(true);
    }

    useEffect(() => {
        subscribeToInitialPosition(setInitialPosition);
    },)

    if (ready) {
        return (
            <Game
                position={initialPosition}
            />
        );
    } else {
        return (
            <Loading />
        );
    }
}

export default Play;