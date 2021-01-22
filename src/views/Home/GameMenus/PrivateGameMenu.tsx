import React from 'react';
import {
    Button,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {MainMenuState} from './MainMenu';

const useStyles = makeStyles((theme) => ({
    introButtons: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    cancelButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

export enum PrivateGameMenuState {
    LandingMenu = 1,
    RandomGame,
    PrivateGame,
    CreatingGame,
    JoiningGame,
    Ready,
}

interface PrivateGameMenuProps {
    handleStateChange: (newState: MainMenuState) => void;
}

function PrivateGameMenu(props: PrivateGameMenuProps) {
    const classes = useStyles();

    return (
        <div>
            <Button
            className={classes.introButtons} 
            variant="contained" 
            color="primary"
            onClick={e => props.handleStateChange(MainMenuState.CreateGame)}
            >
                Create Game
            </Button>
            <Typography align='center' variant='subtitle1' color={'textSecondary'}>
                Or
            </Typography>
            <div className={classes.centered}>
                <Button
                className={classes.introButtons} 
                variant="contained" 
                color="primary"
                onClick={e => props.handleStateChange(MainMenuState.JoinGame)}
                >
                    Join Game
                </Button>
            </div>
            <div className={classes.centered}>
                <Button
                className={classes.cancelButton} 
                color="secondary"
                onClick={e => props.handleStateChange(MainMenuState.LandingMenu)}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default PrivateGameMenu;