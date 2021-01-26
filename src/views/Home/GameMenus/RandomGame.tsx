import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    initiateSocket,
    disconnectSocket,
    subscribeToMatchSuccess,
    MatchSuccessData,
} from '../../api/GameSocket';
import {
    Button,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import { getAnonymousToken } from '../../api/HTTPRequests';
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

interface RandomGameProps {
    handleStateChange: (newState: MainMenuState) => void;
}


function RandomGame(props: RandomGameProps) {
    const classes = useStyles();
    const history = useHistory();

    const handleCancel = () => {
        disconnectSocket();
        props.handleStateChange(MainMenuState.LandingMenu);
    }

    useEffect(() => {
        fetchGameID();
    }, [])

    const fetchGameID = () => {
        // check if token exists, then make socket connection
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
        if (token) {
            initiateSocket(token, undefined, afterSocketConnect);
        } else {
            getAnonymousToken()
            .then( data => {
                initiateSocket(data.token, undefined, afterSocketConnect);
            })
        }
    }

    const afterSocketConnect = () => {
        console.log("Connected")
        subscribeToMatchSuccess(waitForMatch);
    }

    const waitForMatch = (matchSuccessData: MatchSuccessData) => {
        const gameID = matchSuccessData.gameID;
        history.push(`/play/${gameID}`);

    }

    return (
        <div>
            <div className={classes.instructions}>
                <Typography variant='subtitle1' align='center' color='textSecondary'>
                    Finding a match...
                </Typography>
            </div>
            <div className={classes.instructions}>
                    <CircularProgress />
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

export default RandomGame;