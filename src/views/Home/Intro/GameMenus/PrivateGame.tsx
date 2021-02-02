import React, { useState, useEffect } from 'react';
import { Link as RouterLink} from 'react-router-dom';
import {
    Button,
    CircularProgress,
    Link,
    Typography,
} from '@material-ui/core';
import { getGameID } from '../../../../api/HTTPRequests';
import { makeStyles } from '@material-ui/core/styles';
import { MainMenuState } from './MainMenu';
import { useSnackbar } from 'notistack';
import constants from '../../../../constants';

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

interface PrivateGameProps {
    handleStateChange: (newState: MainMenuState) => void;
}


function PrivateGame(props: PrivateGameProps) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [gameID, setGameID] = useState("");

    const handleCancel = () => {
        props.handleStateChange(MainMenuState.LandingMenu);
    }

    const fetchGameID = () => {
        getGameID()
        .then(data => {
            if (data.error) {
                enqueueSnackbar(data.error, { 
                    variant: 'error',
                })
            }
            if (data.gameID) {
                setGameID(data.gameID);
            }
        })
        .catch(err => {
            enqueueSnackbar(constants.ERROR_MESSAGE, { 
                variant: 'error',
            })
        })
    }

    useEffect(() => {
        fetchGameID();
    }, [])

    return (
        <div>
            <div className={classes.instructions}>
                <Typography variant='subtitle1' align='center' color='textSecondary'>
                    Join the game using the following link:
                </Typography>
            </div>
            <div className={classes.instructions}>
                {gameID && 
                    <Typography variant='h5' align='center' color='textPrimary'>
                            <Link component={RouterLink} to={`/play/${gameID}`}>
                                {`${process.env.REACT_APP_WEBSITE_DOMAIN}/play/${gameID}`}
                            </Link>
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

export default PrivateGame;