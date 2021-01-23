import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LandingMenu from './LandingMenu';
import RandomGame from './RandomGame';
import PrivateGame from './PrivateGame';
import { Redirect } from 'react-router';

const useStyles = makeStyles((theme) => ({
    root: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(2,2,0),
        display: 'inline-flex',
    },
}));

export enum MainMenuState {
    LandingMenu = 1,
    RandomGame,
    PrivateGame,
    Ready
}

function MainMenu() {
    const classes = useStyles();

    // initialize the states
    const [menuState, setMenuState] = useState(MainMenuState.LandingMenu);

    // create handlers
    const handleStateChange = (newState: MainMenuState) => {
        setMenuState(newState);
    }

    // different menu content
    switch (menuState) {
        case MainMenuState.LandingMenu:
            return (
                <div className={classes.root}>
                    <LandingMenu 
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.RandomGame:
            return (
                <div className={classes.root}>
                    <RandomGame 
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.PrivateGame:
            return (
                <div className={classes.root}>
                    <PrivateGame
                        handleStateChange={handleStateChange}
                    />
                </div>
            );
        case MainMenuState.Ready:
            return(<Redirect to="/play" />);
        default:
            return (
                <div className={classes.root}>
                    {"Something went wrong!"}
                </div>
            );
    }
}

export default MainMenu;