import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    OutlinedInput,
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

interface JoinGameProps {
    username: string;
    handleStateChange: (newState: PrivateGameMenuState) => void;
    closePrivateGameMenu: () => void;
}

function JoinGame(props: JoinGameProps) {
    const [gameID, setGameID] = useState("");
    const [gameIDError, setGameIDError] = useState(false);
    const [gameIDErrorText, setGameIDErrorText] = useState("");

    const handleGameIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameID(event.target.value);
        setGameIDError(false);
        setGameIDErrorText("");
    }

    const isValidGameID = () => {
        if (!gameID) {
            setGameIDError(true);
            setGameIDErrorText("Please enter a game ID")
            return false;
        } else {
            return true;
        }
    }

    const handleStartGame = () => {
        if (isValidGameID()) {
            const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
            initiateSocket(gameID, props.username, token!, afterSocketConnect);
        }
    }

    const afterSocketConnect = () => {
        sendPlayerReady();
        subscribeToGameStatus(waitForGame);
    }
    const waitForGame = (data: GameStatusData) => {
        if (data.status === GameStatus.Starting) {
            props.handleStateChange(PrivateGameMenuState.Ready);
        }
    }

    return (
        <div>
            <DialogTitle id="alert-dialog-title">{"Join Game"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Enter the GameID of the game you want to join
                </DialogContentText>
                <FormControl error={gameIDError}>
                    <OutlinedInput
                        id="gameID"
                        type='text'
                        placeholder='name'
                        value={gameID}
                        onChange={handleGameIDChange}
                    />
                    <FormHelperText id="gameID-error-text">{gameIDErrorText}</FormHelperText>
                </FormControl>
                <Button
                    // className={}
                    variant="contained"
                    color="primary"
                    onClick={e => handleStartGame()}
                >
                    StartGame
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closePrivateGameMenu} color="secondary" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </div>
    );
}

export default JoinGame;