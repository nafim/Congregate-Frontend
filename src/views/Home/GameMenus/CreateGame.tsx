import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import {
    initiateSocket,
    disconnectSocket,
    sendPlayerReady,
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
} from '../../components/GameSocket';
import { PrivateGameMenuState } from './PrivateGameMenu';

interface CreateGameProps {
    username: string;
    handleStateChange: (newState: PrivateGameMenuState) => void;
    closePrivateGameMenu: () => void;
}


function CreateGame(props: CreateGameProps) {
    const [gameID, setGameID] = useState("");

    const fetchGameID = () => {
        fetch(process.env.REACT_APP_API_ENDPOINT + '/getUniqueGameID')
        .then(res => res.json())
        .then(data => {
            if (data.error) throw Error(data.error);
            setGameID(data.gameID);
            // connect to socket
            const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
            initiateSocket(data.gameID, props.username, token!, afterSocketConnect);
        })
        .catch(err => console.error(err))
    }
    const afterSocketConnect = () => {
        sendPlayerReady();
        console.log('connected');
        subscribeToGameStatus(waitForGame);
    }
    const waitForGame = (data: GameStatusData) => {
        if (data.status === GameStatus.Starting) {
            props.handleStateChange(PrivateGameMenuState.Ready);
        }
    }

    useEffect(() => {
        fetchGameID();
    }, [])

    return (
        <div>
            <DialogTitle id="alert-dialog-title">{"Create Game"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Share the following GameID with your friend
                </DialogContentText>
                <Typography>{gameID}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closePrivateGameMenu} color="secondary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </div>
    );
}

export default CreateGame;