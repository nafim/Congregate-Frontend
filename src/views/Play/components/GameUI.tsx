import React, { useState} from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Badge,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from '@material-ui/core';
import {
    disconnectSocket,
} from '../../../api/GameSocket';
import { useHistory } from "react-router-dom";
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
import ChatWindow from './ChatWindow';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    topBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    topBarShift: {
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginRight: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            })
        }
    },
    chatButton: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(2)
    },
    title: {
        flexGrow: 1,
    }
}));

interface GameUIProps {
    username: string;
    timeRemaining: number;
    score: number;
    handleUndoPosition: () => void;
}

function GameUI(props: GameUIProps) {
    const classes = useStyles();
    const history = useHistory();

    const [chatOpen, setChatOpen] = useState(false);
    const [chatUnreadNumber, setChatUnreadNumber] = useState(0);

    const handleChatToggle = () => {
        setChatOpen(!chatOpen);
        setChatUnreadNumber(0);
    }

    const incrementChatUnread = () => {
        setChatUnreadNumber(chatUnreadNumber => chatUnreadNumber + 1);
    }

    const showTimer = () => {
        const newTimeRemaining = props.timeRemaining < 0 ? 0 : props.timeRemaining;
        const minutes = Math.floor(newTimeRemaining/60);
        let seconds = Math.floor(newTimeRemaining % 60);
        let secondString;
        if (seconds < 10) {
            secondString = "0" + seconds;
        } else {
            secondString = String(seconds);
        }
        
        return (`${minutes}:${secondString}`);
    }

    const handleExit = () => {
        disconnectSocket();
        history.push('/');
    }

    return (
        <div>
            <AppBar position="static" className={clsx(classes.topBar, {[classes.topBarShift]: chatOpen,})}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Score: {props.score}
                    </Typography>
                    <Typography variant="h6" className={classes.title}>
                        Time Remaining: {showTimer()}
                    </Typography>
                    <div>
                        <Button 
                            color="inherit"
                            onClick={e => props.handleUndoPosition()}
                        >
                            Undo
                        </Button>
                        <Button 
                            color="inherit"
                            onClick={e => handleExit()}
                        >
                            Exit
                        </Button>
                    </div>
                    {!chatOpen && 
                    <IconButton edge="start" className={classes.chatButton} color="inherit" aria-label="chat"
                        onClick={handleChatToggle}
                    >
                        <Badge color="secondary" badgeContent={chatUnreadNumber} max={9}>
                            <ChatIcon />
                        </Badge>
                    </IconButton>}
                </Toolbar>
            </AppBar>
            <ChatWindow
                chatOpen={chatOpen}
                username={props.username}
                handleChatToggle={handleChatToggle}
                incrementChatUnread={incrementChatUnread}
            />
        </div>
    );
}

export default GameUI;