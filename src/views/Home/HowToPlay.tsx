import React, { useState } from 'react';
import {
    Button,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MainMenu from './GameMenus/MainMenu';

const useStyles = makeStyles((theme) => ({
    buttons: {
        margin: theme.spacing(2, 0, 1)
    },
    outline: {
        width: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(0, 0, 0, 0.12)'
    },
    content: {
        margin: theme.spacing(2, 2, 2)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
}));

function Intro() {
    const classes = useStyles();
    const [showHowToPlay, setShowHowToPlay] = useState(false);

    const toggleHowToPlay = () => {
        setShowHowToPlay(showHowToPlay => !showHowToPlay);
    }

    return (
        <div>
            <div className={classes.centered}>
                    <Button
                        className={classes.buttons}
                        onClick={() => toggleHowToPlay()}
                    >
                        How to Play
                    </Button>
            </div>
            { showHowToPlay &&
                <div className={classes.centered}>
                    <div className={classes.outline}>
                            <div className={classes.content}>
                                <Typography variant='subtitle1' align='center' color='textPrimary'>
                                    At the start of each round, you and your friend will be separated.
                                    Communicate with each other and navigate through the streets 
                                    in order to join up with your friend before time runs out!
                                </Typography>
                            </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Intro;