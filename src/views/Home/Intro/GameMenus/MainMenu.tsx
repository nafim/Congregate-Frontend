import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LandingMenu from './LandingMenu';
import RandomGame from './RandomGame';
import PrivateGame from './PrivateGame';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(2, 2, 0),
        display: 'inline-flex',
    },
    centered: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
}));

export enum MainMenuState {
    LandingMenu = 1,
    RandomGame,
    PrivateGame
}

function MainMenu() {
    const classes = useStyles();

    // initialize the states
    const [menuState, setMenuState] = useState(MainMenuState.LandingMenu);

    // create handlers
    const handleStateChange = (newState: MainMenuState) => {
        setMenuState(newState);
    }

    return (
        <div className={classes.centered}>
            <Collapse in={menuState === MainMenuState.LandingMenu} unmountOnExit timeout={250}>
                <div className={classes.root}>
                    <LandingMenu
                        handleStateChange={handleStateChange}
                    />
                </div>
            </Collapse>
            <Collapse in={menuState === MainMenuState.RandomGame} unmountOnExit timeout={250}>
                    <div className={classes.root}>
                        <RandomGame
                            handleStateChange={handleStateChange}
                        />
                    </div>
            </Collapse>
            <Collapse in={menuState === MainMenuState.PrivateGame} unmountOnExit timeout={250}>
                    <div className={classes.root}>
                        <PrivateGame
                            handleStateChange={handleStateChange}
                        />
                    </div>
            </Collapse>
        </div>
    );
}

export default MainMenu;