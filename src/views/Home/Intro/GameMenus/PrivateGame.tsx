import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Button,
    CircularProgress,
    Collapse,
    FormControl,
    Link,
    MenuItem,
    Select,
    Typography,
} from '@material-ui/core';
import { getGameID } from '../../../../api/HTTPRequests';
import { makeStyles } from '@material-ui/core/styles';
import { MainMenuState } from './MainMenu';
import { useSnackbar } from 'notistack';
import constants from '../../../../constants';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0, 3, 0)
    },
    items: {
        margin: theme.spacing(0, 0, 2),
    },
    cancelButton: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    }
}));

interface PrivateGameProps {
    handleStateChange: (newState: MainMenuState) => void;
}


function PrivateGame(props: PrivateGameProps) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [gameID, setGameID] = useState("");
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        props.handleStateChange(MainMenuState.LandingMenu);
    }

    const handleCitySelect = (evt: React.ChangeEvent<{ value: unknown}>) => {
        setCity(evt.target.value as string);
        setLoading(true);
        fetchGameID(evt.target.value as string);
    }

    const fetchGameID = (city: string) => {
        getGameID(city)
            .then(data => {
                if (data.error) {
                    enqueueSnackbar(data.error, {
                        variant: 'error',
                    })
                }
                if (data.gameID) {
                    setGameID(data.gameID);
                }
                setLoading(false);
            })
            .catch(err => {
                enqueueSnackbar(constants.ERROR_MESSAGE, {
                    variant: 'error',
                })
                setLoading(false);
            })
    }

    return (
        <div className={classes.root}>
            <div className={classes.centered}>
                <Typography variant='subtitle1' align='center' color='textSecondary'>
                    Select a city:
                </Typography>
                <FormControl className={classes.items}>
                    {/* <InputLabel id="select-city">City</InputLabel> */}
                    <Select
                        labelId="select-city"
                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                        id="select-city"
                        value={city}
                        defaultValue='city'
                        onChange={handleCitySelect}
                    >
                        <MenuItem value={'Boston'}>Boston</MenuItem>
                        <MenuItem value={'Buffalo'}>Buffalo</MenuItem>
                        <MenuItem value={'New York'}>New York</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className={classes.centered}>
                <Collapse in={!!gameID} unmountOnExit>
                    <Typography variant='subtitle1' align='center' color='textSecondary'>
                        Join the game using the following link:
                    </Typography>
                    <Typography variant='h5' align='center' color='textPrimary'>
                        <Link component={RouterLink} to={`/play/${gameID}`}>
                            {`${process.env.REACT_APP_WEBSITE_DOMAIN}/play/${gameID}`}
                        </Link>
                    </Typography>
                </Collapse>
                <Collapse in={loading} unmountOnExit>
                    <CircularProgress />
                </Collapse>
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