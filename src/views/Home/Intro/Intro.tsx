import React from 'react';
import {
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MainMenu from './GameMenus/MainMenu';
import HowToPlay from './HowToPlay';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 3),
    },
    introButtons: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(0),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    introTitle: {
        color: theme.palette.primary.dark,
        "font-family": "Arial, cursive",
        "font-size": "4.7rem",
        "text-align": "center",
        marginBottom: theme.spacing(8)
    }
}));

function Intro() {
    const classes = useStyles();

    return (
        <div className={classes.heroContent}>
            <div>
                <Typography className={classes.introTitle}>Congregate</Typography>
            </div>
            <div className={classes.centered}>
                <MainMenu />
            </div>
            <HowToPlay />
        </div>
    );
}

export default Intro;