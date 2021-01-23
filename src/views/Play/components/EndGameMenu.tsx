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
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
    message: {

    },
    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface EndGameMenuProps {
    message: string;
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
                    <Typography variant='h5' align="center" color="textSecondary">
                        {props.message}
                    </Typography>
                    <Typography align="center" color="textSecondary">
                        Here's how you did:
                    </Typography>
                </div>
                <Divider variant="middle" />
                {waiting &&
                    <div>
                        <Typography> {loadingMessage} </Typography>
                        <CircularProgress />
                    </div>
                }
                <div className={classes.button} >
                    <Button color="secondary" onClick={e => handlePlayAgain()}>
                        Play Again
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default EndGameMenu;