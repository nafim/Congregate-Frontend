import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import ChooseType from './ChooseType';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';


interface PrivateGameMenuProps {
    username: string;
    open: boolean;
    closePrivateGameMenu: () => void;
}

export enum PrivateGameMenuState {
    ChoosingType = 1,
    CreatingGame,
    JoiningGame,
    Ready,
}

function PrivateGameMenu(props: PrivateGameMenuProps) {
    const [menuState, setMenuState] = useState(PrivateGameMenuState.ChoosingType);
    

    // handlers
    const handleStateChange = (newState: PrivateGameMenuState) => {
        setMenuState(newState);
    }

    // different menu content
    switch (menuState) {
        case PrivateGameMenuState.ChoosingType:
            return (
                <Dialog
                open={props.open}
                onClose={props.closePrivateGameMenu}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <ChooseType
                    handleStateChange={handleStateChange}
                    closePrivateGameMenu={props.closePrivateGameMenu}
                />
            </Dialog>
            );
        case PrivateGameMenuState.CreatingGame:
            return (
                <Dialog
                open={props.open}
                onClose={props.closePrivateGameMenu}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <CreateGame
                    username={props.username}
                    handleStateChange={handleStateChange}
                    closePrivateGameMenu={props.closePrivateGameMenu}
                />
            </Dialog>
            );
        case PrivateGameMenuState.JoiningGame:
            return (
                <Dialog
                open={props.open}
                onClose={props.closePrivateGameMenu}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <JoinGame
                    username={props.username}
                    handleStateChange={handleStateChange}
                    closePrivateGameMenu={props.closePrivateGameMenu}
                />
            </Dialog>
            );
        case PrivateGameMenuState.Ready:
            return(<Redirect to="/play" />);
    
        default:
            return (
                <Dialog
                open={props.open}
                onClose={props.closePrivateGameMenu}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div></div>
            </Dialog>
            );
    }
}

export default PrivateGameMenu;