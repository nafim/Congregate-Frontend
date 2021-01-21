import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import { PrivateGameMenuState } from './PrivateGameMenu';

interface ChooseTypeProps {
    handleStateChange: (newState: PrivateGameMenuState) => void;
    closePrivateGameMenu: () => void;
}

function ChooseType(props: ChooseTypeProps) {

    // handlers
    const handleCreateGameClick = () => {
        props.handleStateChange(PrivateGameMenuState.CreatingGame);
    }

    const handleJoinGameClick = () => {
        props.handleStateChange(PrivateGameMenuState.JoiningGame);
    }

    return (
        <div>
            <DialogTitle id="alert-dialog-title">{"Select one of the following"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Select one of the following
                </DialogContentText>
                <Button
                    // className={}
                    variant="contained"
                    color="primary"
                    onClick={e => handleCreateGameClick()}
                >
                    Create Game
                </Button>
                <Button
                    // className={}
                    variant="contained"
                    color="primary"
                    onClick={e => handleJoinGameClick()}
                >
                    Join Game
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

export default ChooseType;