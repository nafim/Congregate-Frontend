import React from 'react';
import {
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MainMenuState } from './MainMenu';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    introButtons: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface LandingMenuProps {
    handleStateChange: (newState: MainMenuState) => void;
}

function LandingMenu(props: LandingMenuProps) {
    const classes = useStyles();

    return(
        <div className={classes.root}>
            <Button
            className={classes.introButtons} 
            variant="contained" 
            color="primary"
            onClick={e => props.handleStateChange(MainMenuState.RandomGame)}
            >
                Random Game
            </Button>
            <div className={classes.centered}>
                <Button
                className={classes.introButtons} 
                variant="contained" 
                color="primary"
                onClick={e => props.handleStateChange(MainMenuState.PrivateGame)}
                >
                    Private Game
                </Button>
            </div>
        </div>
    );
}

export default LandingMenu;