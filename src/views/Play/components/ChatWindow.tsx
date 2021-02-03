import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Typography,
    Drawer,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MessageBox, { Message, Sender } from './MessageBox';
import ChatInput from './ChatInput';
import {
    CurrentPlayersData,
    MessageEventData,
    PlayerConnectionData,
    requestCurrentPlayers,
    sendMessage,
    subscribeToCurrentPlayers,
    subscribeToMessage,
    subscribeToPlayerConnect,
    subscribeToPlayerDisconnect
} from '../../../api/GameSocket';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: "100%"
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.down('xs')]: {
            width: "100%",
        },
    },
    chatHeader: {
        display: "flex",
        backgroundColor: theme.palette.primary.dark,
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content below header to be below topBar
        ...theme.mixins.toolbar,
        justifyContent: "center"
    }
}));

interface ChatWindowProps {
    chatOpen: boolean;
    username: string;
    handleChatToggle: () => void;
    incrementChatUnread: () => void;
}

function ChatWindow(props: ChatWindowProps) {
    const classes = useStyles();

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        subscribeToMessage(receiveMessage);
        subscribeToCurrentPlayers(showCurrentPlayers, true);
        requestCurrentPlayers();
        subscribeToPlayerConnect(otherPlayerConnect);
        subscribeToPlayerDisconnect(otherPlayerDisconnect);
    },[])

    const receiveMessage = (messageData: MessageEventData) => {
        const newMessage = {
            messageText: messageData.text,
            name: messageData.name,
            sender: Sender.Other
        };
        setMessages(messages => [...messages, newMessage]);
        props.incrementChatUnread();
    }

    const showCurrentPlayers = (currentPlayers: CurrentPlayersData) => {
        // copy array of players
        const otherPlayers = [...currentPlayers.players];
        // remove my username from the array once
        const index = otherPlayers.indexOf(props.username);
        if (index > -1) { otherPlayers.splice(index, 1) };

        const newAlert = {
            messageText: `You are in a game with ${otherPlayers}`,
            name: '',
            sender: Sender.Alert
        };
        setMessages(messages => [...messages, newAlert]);
    }

    const otherPlayerConnect = (connectionData: PlayerConnectionData) => {
        const newAlert = {
            messageText: `${connectionData.player} has connected`,
            name: '',
            sender: Sender.Alert
        };
        setMessages(messages => [...messages, newAlert]);
        props.incrementChatUnread();
    }

    const otherPlayerDisconnect = (connectionData: PlayerConnectionData) => {
        const newAlert = {
            messageText: `${connectionData.player} has disconnected`,
            name: '',
            sender: Sender.Alert
        };
        setMessages(messages => [...messages, newAlert]);
        props.incrementChatUnread();
    }

    const addMessage = (messageText: string) => {
        if (!messageText) return;
        const newMessage = {
            messageText,
            name: props.username,
            sender: Sender.Me
            
        };
        setMessages(messages => [...messages, newMessage]);
        sendMessage(props.username, messageText);
    }

    return (
        <nav aria-label="chat window">
            <Drawer
                variant="persistent"
                anchor="right"
                open={props.chatOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.chatHeader}>
                    <Typography style={{color: "white"}} variant='h6' align='center'> Chat </Typography>
                    <IconButton onClick={props.handleChatToggle}>
                        <ChevronRightIcon style={{color: 'white'}} />
                    </IconButton>
                </div>
                <MessageBox
                    messages={messages}
                />
                <ChatInput 
                    addMessage={addMessage}
                    chatOpen={props.chatOpen}
                />
            </Drawer>
        </nav>
    );
}

export default ChatWindow;