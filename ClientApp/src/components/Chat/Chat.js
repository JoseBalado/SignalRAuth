import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import Chart from './Chart';

const Chat = () => {
    const [ connection, setConnection ] = useState(null);
    const [ chat, setChat ] = useState("");
    const [ queue, setQueue ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://192.168.1.33:7268/chatHub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
    
                    connection.on('ReceiveMessage', (user, message) => {
                        // const updatedChat = [...latestChat.current];
                        // updatedChat = message;

                        // console.log("message " + message);
                    
                        setChat(message);
                    });

                    connection.on('SendQueue', (user, message) => {
                        // console.log("Queue " + message);

                        setQueue(message);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    return (
        <div>
            <hr />
            <ChatWindow chat={chat}/>
            <hr />
            <Chart graph={queue} />
        </div>
    );
};

export default Chat;
