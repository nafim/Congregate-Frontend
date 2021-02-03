import React, { useEffect, useState } from 'react';
import {
    Button,
    CircularProgress,
    MenuItem,
    Select,
    Typography
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LeaderboardList, { Entry } from './LeaderboardList';
import { getLeaderboard, AvgEntry, MaxEntry } from '../../../api/HTTPRequests';

const useStyles = makeStyles((theme) => ({
    buttons: {
        margin: theme.spacing(2, 0, 1)
    },
    container: {
        width: '100%',
        maxWidth: '45em'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.primary.dark,
    },
    headerTitles: {
        margin: theme.spacing(1,1,1),
        wordBreak: 'break-word',
    },
    select: {
        color: 'white',
        margin: theme.spacing(1,1,1),
        wordBreak: 'break-word',
    },
    icon: {
        fill: 'white',
    },
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
}));

const WhiteTextTypography = withStyles({
    root: {
        color: "#FFFFFF"
    }
})(Typography);

function Leaderboard() {
    const classes = useStyles();
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [loading, setLoading] = useState(true);
    const [avgLeaderboard, setAvgLeaderboard] = useState<Entry[]>([]);
    const [maxLeaderboard, setMaxLeaderboard] = useState<Entry[]>([]);
    const [currentLeaderboard, setCurrentLeaderboard] = useState('avg');

    const toggleLeaderboard = () => {
        setShowLeaderboard(showLeaderboard => !showLeaderboard);
    }

    const handleLeaderboardChange = (evt: React.ChangeEvent<{ value: unknown}>) => {
        setCurrentLeaderboard(evt.target.value as string);
    }

    useEffect(() => {
        getLeaderboard()
        .then(data => {
            if (data.error) return;
            setAvgLeaderboard(data.avgLeaderboard.map((entry: AvgEntry) => {return {username: entry.username, score: entry.avgScore}}));
            setMaxLeaderboard(data.maxLeaderboard.map((entry: MaxEntry) => {return {username: entry.username, score: entry.maxScore}}));
        })
        .catch( err => {})
    },[])

    useEffect(() => {
        setLoading(false);;
    },[avgLeaderboard, maxLeaderboard])

    return (
        <div>
            <div className={classes.centered}>
                    <Button
                        className={classes.buttons}
                        onClick={() => toggleLeaderboard()}
                    >
                        Leaderboard
                    </Button>
            </div>
            { showLeaderboard &&
                <div className={classes.centered}>
                    <div className={classes.container}>
                        <div className={classes.header}>
                            <div style={{width: '20%'}}>
                                <WhiteTextTypography
                                    variant='h6'
                                    className={classes.headerTitles}
                                >
                                    Rank
                                </WhiteTextTypography>
                            </div>
                            <div style={{width: '40%'}}>
                                <WhiteTextTypography
                                    variant='h6'
                                    className={classes.headerTitles}
                                >
                                    Username
                                </WhiteTextTypography>
                            </div>
                            <div style={{width: '40%'}} className={classes.centered}>
                                <Select
                                    labelId="leaderboard-select"
                                    id="leaderboard-select"
                                    disableUnderline
                                    value={currentLeaderboard}
                                    className={classes.select}
                                    onChange={handleLeaderboardChange}
                                    inputProps={{
                                        classes: {
                                            icon: classes.icon,
                                        },
                                    }}
                                >
                                    <MenuItem value={'avg'}>Average Score</MenuItem>
                                    <MenuItem value={'max'}>Max Score</MenuItem>
                                </Select>
                            </div>
                        </div>
                        {loading &&
                            <CircularProgress />
                        }
                        {!loading &&
                            <LeaderboardList
                                entries={currentLeaderboard === 'avg' ? avgLeaderboard : maxLeaderboard}
                            />
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Leaderboard;