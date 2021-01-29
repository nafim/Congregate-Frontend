import React, { useState, useEffect } from 'react';
import {
    GameStatus,
    GameStatusData,
    sendPlayerReady, 
    subscribeToGameStatus,
} from '../../api/GameSocket';
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        display: 'flex',
        justifyContent: 'center',
    },
    message: {
        margin: theme.spacing(0,5,2)
    },
    items: {
        marginTop: theme.spacing(1),
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface EndGameMenuProps {
    message: string;
    score: number;
    prevScore: number;
    gameDuration: number;
    handleEndGameMenuOpen: (open: boolean) => void;
}

function EndGameMenu(props: EndGameMenuProps) {
    const classes = useStyles();

    const [waiting, setwaiting] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const handlePlayAgain = () => {
        sendPlayerReady();
        setwaiting(true);
        setLoadingMessage("Waiting for other player...");
    }

    useEffect(() => {
        subscribeToGameStatus(waitForGame);
    }, []);

const waitForGame = (data: GameStatusData) => {
    if (data.status === GameStatus.Starting) {
        setLoadingMessage("Starting...");
    }
    if (data.status === GameStatus.InProgress) {
        setwaiting(false);
        props.handleEndGameMenuOpen(false);
    }
}

    return (
        <Card className={classes.card}>
            <CardContent>
                <div className={classes.message}>
                    <Typography variant='h4' align="center" color="textPrimary">
                        {props.message}
                    </Typography>
                </div>
                <Typography variant='h6' align="center" color="textSecondary">
                        Results
                </Typography>
                <Divider className={classes.items} variant="middle" />
                <div className={classes.centered}>
                    <div className={classes.items}>
                        <Typography variant='subtitle1' color="textPrimary">
                        Total Score: <b> {props.score} (+{props.score - props.prevScore}) </b> <br />
                        Round Duration: <b> {Math.round(props.gameDuration/60)}m {Math.round(props.gameDuration%60)}s </b> <br />
                        </Typography>
                    </div>
                </div>
                {waiting &&
                    <div className={classes.items}>
                        <div className={classes.centered}>
                            <Typography className={classes.items} color='textSecondary'>
                                {loadingMessage} 
                            </Typography>
                        </div>
                        <div className={classes.centered}>
                            <CircularProgress className={classes.items} />
                        </div>
                    </div>
                }
                {!waiting &&
                    <div className={classes.centered} >
                        <Button
                            className={classes.items}
                            color="primary"
                            onClick={e => handlePlayAgain()}
                        >
                            Play Again
                        </Button>
                    </div>
                }
            </CardContent>
        </Card>
    );
}

export default EndGameMenu;