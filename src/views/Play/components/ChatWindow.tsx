import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Typography,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MessageBox, { Message, Sender } from './MessageBox';
import ChatInput from './ChatInput';
import { MessageEventData, sendMessage, subscribeToMessage } from '../../api/GameSocket';

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
        backgroundColor: "#353536",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content below header to be below topBar
        ...theme.mixins.toolbar,
        justifyContent: "center"
    }
}));

interface ChatWindowProps {
    chatOpen: boolean
    handleChatToggle: () => void
}

function ChatWindow(props: ChatWindowProps) {
    const classes = useStyles();

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        subscribeToMessage(receiveMessage);
    },[])

    const receiveMessage = (messageData: MessageEventData) => {
        const newMessage = {
            messageText: messageData.text,
            name: messageData.name,
            sender: Sender.Other
        };
        setMessages(messages => [...messages, newMessage]);
    }

    const addMessage = (messageText: string) => {
        if (!messageText) return;
        const newMessage = {
            messageText,
            name: "You",
            sender: Sender.Me
            
        };
        setMessages(messages => [...messages, newMessage]);
        sendMessage(messageText);
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
                />
            </Drawer>
        </nav>
    );
}

export default ChatWindow;