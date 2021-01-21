import React, { useState} from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    OutlinedInput,
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
import { ArrowForward } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    instructions: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2)
    },
    cancelButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

interface JoinGameProps {
    username: string;
    handleStateChange: (newState: MainMenuState) => void;
}

function JoinGame(props: JoinGameProps) {
    const classes = useStyles();
    const [gameID, setGameID] = useState("");
    const [gameIDError, setGameIDError] = useState(false);
    const [gameIDErrorText, setGameIDErrorText] = useState("");

    const handleGameIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameID(event.target.value);
        setGameIDError(false);
        setGameIDErrorText("");
    }

    const isValidGameID = () => {
        if (!gameID) {
            setGameIDError(true);
            setGameIDErrorText("Please enter a game ID")
            return false;
        } else {
            return true;
        }
    }

    const handleCancel = () => {
        disconnectSocket();
        props.handleStateChange(MainMenuState.LandingMenu);
    }

    const handleStartGame = () => {
        if (isValidGameID()) {
            const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
            initiateSocket(gameID, props.username, token!, afterSocketConnect);
        }
    }

    const afterSocketConnect = () => {
        sendPlayerReady();
        subscribeToGameStatus(waitForGame);
    }
    const waitForGame = (data: GameStatusData) => {
        if (data.status === GameStatus.Starting) {
            props.handleStateChange(MainMenuState.Ready);
        }
    }

    return (
        <div>
            <div className={classes.instructions}>
                <Typography variant='subtitle1' align='center' color='textSecondary'>
                    Enter the code of the game you want to join:
                </Typography>
            </div>
            <form className={classes.centered} noValidate autoComplete="off" onSubmit={(e) => {
                e.preventDefault();
                handleStartGame();
            }}>
                <FormControl error={gameIDError}>
                    <OutlinedInput
                        id="gameID"
                        type='text'
                        placeholder='name'
                        value={gameID}
                        onChange={handleGameIDChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="submit login info"
                                edge="end"
                                onClick={handleStartGame}
                                >
                                    <ArrowForward />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText id="gameID-error-text">{gameIDErrorText}</FormHelperText>
                </FormControl>
            </form>
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

export default JoinGame;