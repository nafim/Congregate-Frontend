import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StreetView from './components/StreetView';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
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
        color: "black",
        "font-family": "Arial, cursive",
        "font-size": "4.7rem",
        "text-align": "center",
        marginBottom: theme.spacing(8)
    }
}));

function Intro() {
    const classes = useStyles();

    const streetViewOptions = {
        position: {lat: 37.869260, lng: -122.254811},
        pov: {heading: 165, pitch: 0},
        motionTracking: false,
        motionTrackingControl: false
    };

    return (
        <div className={classes.heroContent}>
            <div>
                <Typography className={classes.introTitle}>Congregate</Typography>
            </div>
            <div>
                <form className={classes.centered} noValidate autoComplete="off" onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <FormControl variant="filled">
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <OutlinedInput
                            id="username"
                            type='text'
                        />
                    </FormControl>
                </form>
                <div className={classes.centered}>
                    <Button className={classes.introButtons} variant="contained" color="primary">
                        Random Game
                    </Button>
                    <Button className={classes.introButtons} variant="contained" color="primary">
                        With a friend
                    </Button>
                </div>
                <div className={classes.centered}>
                    <Button className={classes.introButtons}>How to Play</Button>
                </div>
            </div>
            <div style={{
					width: '800px',
					height: '450px',
					backgroundColor: '#eeeeee'
				}}>
                <StreetView
                    apiKey={process.env.REACT_APP_MAPS_API_KEY!}
                    streetViewOptions={streetViewOptions}
                    onPositionChanged={() => {}}
                />
            </div>
        </div>
    );
}

export default Intro;