import React, { useState, useEffect } from 'react';
import {
    Button,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import {
    initiateSocket,
    disconnectSocket,
    sendPlayerReady,
    subscribeToGameStatus,
    GameStatusData,
    GameStatus,
} from '../../components/GameSocket';
import { makeStyles } from '@material-ui/core/styles';
import { MainMenuState } from './MainMenu';

const useStyles = makeStyles((theme) => ({
    instructions: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
    cancelButton: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface CreateGameProps {
    username: string;
    handleStateChange: (newState: MainMenuState) => void;
}


function CreateGame(props: CreateGameProps) {
    const classes = useStyles();
    const [gameID, setGameID] = useState("");

    const handleCancel = () => {
        disconnectSocket();
        props.handleStateChange(MainMenuState.LandingMenu);
    }

    const fetchGameID = () => {
        fetch(process.env.REACT_APP_API_BACKEND + '/api/getUniqueGameID')
        .then(res => res.json())
        .then(data => {
            if (data.error) throw Error(data.error);
            setGameID(data.gameID);
            // connect to socket
            const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
            initiateSocket(data.gameID, props.username, token!, afterSocketConnect);
        })
        .catch(err => console.error(err))
    }
    const afterSocketConnect = () => {
        console.log("Connected")
        sendPlayerReady();
        subscribeToGameStatus(waitForGame);
    }
    const waitForGame = (data: GameStatusData) => {
        if (data.status === GameStatus.Starting) {
            props.handleStateChange(MainMenuState.Ready);
        }
    }

    useEffect(() => {
        fetchGameID();
    }, [])

    return (
        <div>
            <div className={classes.instructions}>
                <Typography variant='subtitle1' align='center' color='textSecondary'>
                    Others can join your game using the following code:
                </Typography>
            </div>
            <div className={classes.instructions}>
                {gameID && 
                    <Typography variant='h5' align='center' color='textPrimary'>
                        {gameID}
                    </Typography>
                }
                {!gameID &&
                    <CircularProgress />
                }
            </div>
            <div className={classes.centered}>
                <Button
                className={classes.cancelButton} 
                color="secondary"
                onClick={e => handleCancel()}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default CreateGame;