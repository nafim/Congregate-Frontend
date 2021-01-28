import React, { useEffect, useRef } from 'react';
import {
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ListChildComponentProps, VariableSizeList as MessageList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

const useStyles = makeStyles((theme) => ({
    root: {
        border: '2px solid rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        padding: theme.spacing(2, 0, 0),
        margin: theme.spacing(1, 1, 1),
        height: "100%",
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    messageContent: {
        display: 'flex',
        wordBreak: 'break-word',
        flexDirection: 'column',
        width: '65%',
    }
}));

export enum Sender {
    Other='other',
    Me='me'
}

function MessageRow({index, data, style}: ListChildComponentProps) {
    const classes = useStyles();
    const rowRef = useRef<HTMLDivElement>(null);
    const message = data.messages[index];
    
    const showName = () => {
        if (index === 0) return true; 
        const prevMessage = data.messages[index-1];
        return (message.sender !== prevMessage.sender || message.user !== prevMessage.user)
    }

    useEffect(() => {
        if (rowRef.current) {
            data.setRowHeight(index, rowRef.current.clientHeight);
        }
        // eslint-disable-next-line
        }, [rowRef]);

    return (
            <div style={style}>
                <div ref={rowRef} 
                className={classes.messageContainer} 
                style={message.sender === Sender.Me ? {alignItems: "end"} : {alignItems: "start"}}
                >
                    <div 
                        className={classes.messageContent}
                        style={message.sender === Sender.Me ? {alignItems: "end"} : {alignItems: "start"}}
                    >
                        {
                            showName() &&
                            <Typography variant='caption' color='textSecondary'> {message.name} </Typography>

                        }
                        <Typography variant='body1'> {message.messageText} </Typography>
                    </div>
                </div>
            </div>
    )
}

export interface Message {
    messageText: string;
    name: string;
    sender: Sender;
}

interface MessageBoxProps {
    messages: Message[];
}

function MessageBox(props: MessageBoxProps) {
    const classes = useStyles();
    // References
    const listRef = useRef<MessageList>(null);
    const rowHeights = useRef<{[index: number]: number}>({});

    useEffect(() => {
        if (props.messages.length > 0) {
            if (listRef.current) {
                scrollToBottom();
            }
        }
    }, [props.messages]);

    function setRowHeight(index: number, size: number) {
        listRef.current!.resetAfterIndex(0);
        rowHeights.current = { ...rowHeights.current, [index]: size };
    }

    function scrollToBottom() {
        listRef.current!.scrollToItem(props.messages.length - 1, "end");
    }

    function getRowHeight(index: number) {
        return rowHeights.current[index] + 8 || 82;
    }
    
    return (
        <div className={classes.root}>
            <AutoSizer>
                {({ height, width }) => (
                    <MessageList
                    className="List"
                    height={height}
                    itemCount={props.messages.length}
                    itemSize={getRowHeight}
                    ref={listRef}
                    width={width}
                    itemData={{messages: props.messages, setRowHeight}}
                >
                    {MessageRow}
                </MessageList>
                )}
            </AutoSizer>
        </div>
    );
}



export default MessageBox;

