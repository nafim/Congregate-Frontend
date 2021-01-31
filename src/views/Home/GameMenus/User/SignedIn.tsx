import React, { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    IconButton,
    Link,
    Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { getUserInfo } from '../../../../api/HTTPRequests';
import Username from './Username';

const useStyles = makeStyles((theme) => ({
    item: {
        margin: theme.spacing(0, 0, 1)
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    outline: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        padding: theme.spacing(2,4,0),
        display: 'inline-flex',
        margin: theme.spacing(2, 2, 4)
    },
    userInfoTitle: {
        margin: theme.spacing(0, 5, 1)
    },
    closeButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
}));

interface SignedInProps {
    username: string;
    handleLogOut: () => void;
}

function SignedIn(props: SignedInProps) {
    const classes = useStyles();
    const [showUserInfo, setShowUserInfo] = useState(false);

    const [email, setEmail] = useState("");
    const [totalGamesPlayed, setTotalGamesPlayed] = useState("");
    const [avgScore, setAvgScore] = useState("");
    const [maxScore, setMaxScore] = useState("");

    const logOut = () => {
        localStorage.removeItem(process.env.REACT_APP_TOKEN_NAME!)
        props.handleLogOut();
    }

    useEffect(() => {
        getUserInfo()
        .then(data => {
            setEmail(data.email);
            setTotalGamesPlayed(data.totalGamesPlayed);
            setAvgScore(data.avgScore.toFixed(1));
            setMaxScore(data.maxScore.toFixed(0));
        })
        .catch(err => {})
    },[])

    return(
        <div>
            {!showUserInfo && 
                <div className={classes.centered}>
                    <div className={classes.item}>
                        <Typography variant='subtitle1' color='textPrimary'>
                            {'Signed in as '}
                            <Link
                                href="#"
                                variant="subtitle1"
                                onClick={() => {
                                    setShowUserInfo(true);
                                }}
                            >
                                {props.username}
                            </Link>
                        </Typography>
                        <div className={classes.centered} >
                            <Button
                                color="primary"
                                onClick={logOut}
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            }
            {showUserInfo && 
                <div className={classes.centered}>
                    <div className={classes.outline}>
                        <div>
                            <Username
                                username={props.username}
                            />
                            <Divider className={classes.item} />
                            <div className={classes.centered}>
                                <div className={classes.item}>
                                    <Typography variant='subtitle1' color="textPrimary">
                                    Email: <b> {email} </b> <br />
                                    Total Games Played: <b> {totalGamesPlayed} </b> <br />
                                    Average Score: <b> {avgScore} </b> <br />
                                    Max Score: <b> {maxScore} </b> <br />
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.centered}>
                                <Button
                                    className={classes.closeButton} 
                                    onClick={e => setShowUserInfo(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default SignedIn;