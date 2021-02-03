import React, { useEffect, useRef } from 'react';
import {
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ListChildComponentProps, VariableSizeList as EntryList } from 'react-window';

const useStyles = makeStyles((theme) => ({
    entryContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    entryContent: {
        margin: theme.spacing(2,2,2),
        wordBreak: 'break-word',
    }
}));

function EntryRow({index, data, style}: ListChildComponentProps) {
    const classes = useStyles();
    const rowRef = useRef<HTMLDivElement>(null);
    const entry = data.entries[index];
    

    useEffect(() => {
        if (rowRef.current) {
            data.setRowHeight(index, rowRef.current.clientHeight);
        }
        // eslint-disable-next-line
        }, [rowRef]);
    return (
        <div style={style}>
            <div ref={rowRef} 
                className={classes.entryContainer}
                style={index % 2 === 0 ? {backgroundColor: 'rgba(0, 0, 0, 0.04)'} : {}}
            >
                <div style={{width: '20%'}}>
                    <Typography
                        variant='body1'
                        className={classes.entryContent}
                    >
                        {index + 1}
                    </Typography>
                </div>
                <div style={{width: '40%'}}>
                    <Typography
                        variant='body1'
                        className={classes.entryContent}
                    >
                        {entry.username}
                    </Typography>
                </div>
                <div style={{width: '40%'}}>
                    <Typography
                        variant='body1'
                        className={classes.entryContent}
                        align='center'
                    >
                        {entry.score.toFixed(0)}
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export interface Entry {
    username: string;
    score: string;
}

interface LeaderboardListProps {
    entries: Entry[];
}

function LeaderboardList(props: LeaderboardListProps) {
    const classes = useStyles();
    // References
    const listRef = useRef<EntryList>(null);
    const rowHeights = useRef<{[index: number]: number}>({});

    function setRowHeight(index: number, size: number) {
        listRef.current!.resetAfterIndex(0);
        rowHeights.current = { ...rowHeights.current, [index]: size };
    }

    function getRowHeight(index: number) {
        return rowHeights.current[index] || 40;
    }
    
    return (
        <div>
                <EntryList
                className="List"
                height={560}
                itemCount={props.entries.length}
                itemSize={getRowHeight}
                ref={listRef}
                width='100%'
                itemData={{entries: props.entries, setRowHeight}}
            >
                {EntryRow}
            </EntryList>
        </div>
    );
}



export default LeaderboardList;