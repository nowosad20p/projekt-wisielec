import React, { useState, useRef } from 'react';
import io from 'socket.io-client';


const JoinGameRoomForm = ({setJoined,socket,setHost}) => {
    const [roomName, setRoomName] = useState('');
    const username = useRef("");
    const join = setJoined;
   
    const handleJoinRoom = () => {
        // Emit the joinRoom event to the server
        setJoined(true);

        socket.emit('joinRoom', roomName,username.current.value);
        console.log("PRÓBUJE")
    };
    const handleCreateRoom=()=>{
        setJoined(true);
        setHost(true);
        socket.emit('createRoom', username.current.value);
    }
    return (
        <div>
            <h1 className="text-light">PLAY</h1>
            <input
                type="text"
                placeholder="Enter username"
                ref={username}
               
            />
            <p className="text-light">Join</p>
            <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={handleJoinRoom}>Join Room</button>

            <p className="text-light">OR</p>
           
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default JoinGameRoomForm;
