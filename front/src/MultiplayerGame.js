import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import JoinGameRoomForm  from './JoinMultiplayer';
import GameResult from './GameResult';
import './Game.css';
import vis0 from "./images/vis0.jpg";
import vis1 from "./images/vis1.jpg";
import vis2 from "./images/vis2.jpg";
import vis3 from "./images/vis3.jpg";
import vis4 from "./images/vis4.jpg";
import vis5 from "./images/vis5.jpg";
import vis6 from "./images/vis6.jpg";
import vis7 from "./images/vis7.jpg";
import vis8 from "./images/vis8.png";

const URL = 'localhost:3001';  // Replace with your server URL
var socket = io(URL, { transports : ['websocket'] });
console.log(socket)
const MultiplayerGame = () => {
  const visImages = [vis0,vis1,vis2,vis3,vis4,vis5,vis6,vis7,vis8];
    
    const [joined,setJoined] = useState(false);
    const [userList, setUserList] = useState([[]]);
    const [room, setRoom] = useState("");
    const [hiddenWord,setHiddenWord]=useState("");
    const [curTurn,setCurTurn]=useState(false);
    const [host,setHost]=useState(false);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    
    const [inGame,setInGame]= useState(false);
    const qwertyKeys = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
        'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ];
    useEffect(() => {
        console.log(socket)
        socket.on('userList', (updatedUserList) => {
            setRoom(updatedUserList[0])
            console.log(updatedUserList)
            setUserList(Object.values(updatedUserList[1]));
        });
    }, []);
    useEffect(() => {
        console.log(socket)
        socket.on('nextTurn', (data) => {
            
            setHiddenWord(data["word"]);
            setCurTurn(data["curTurn"]);
            setIncorrectGuesses(8-data["guessesLeft"]);
        });
    }, []);
    const startGame = ()=>{
        socket.emit('startGame', room);

    }
    const handleButtonClick = (key)=>{
        if(socket.id == curTurn){
            socket.emit("makeTurn",room,key);
        }
    }
    return (
        <div className="container text-center">
            {!joined ? (
                <JoinGameRoomForm socket={socket} setJoined={setJoined} setHost={setHost} />
            ) : hiddenWord.length === 0 ? (
                <div>
                    <h2 className="text-light">Room {room}</h2>
                    <h3 className="text-light">Connected Users</h3>
                    <ul className="list-group">
                        {userList.map((user) => (
                            <li key={user} className="list-group-item text-dark">
                                {user}
                            </li>
                        ))}
                    </ul>
                    {host ? (
                        <button className="btn btn-primary" onClick={startGame}>
                            Start game
                        </button>
                    ) : null}
                </div>
            ) : (
                // In-game display
                <div className="word-display text-light">{hiddenWord}</div>
            )}
            <div className="curTurnDisplay text-light">
          
                {  hiddenWord.length>0?curTurn === socket.id ? "It's your turn" : "Wait until all other players finish their turns":null}
            </div>
            <div className="keyboard">
                {hiddenWord.length > 0
                    ? qwertyKeys.map((key) => (
                          <button
                              key={key}
                              //className={`btn btn-${guessedLetters.includes(key) ? (randomWord.includes(key.toLowerCase()) ? 'success' : 'secondary') : 'primary'}`}
                              onClick={() => handleButtonClick(key)}
                          >
                              {key}
                          </button>
                      ))
                    : null}
            </div>
            {hiddenWord.length>0?(
                <div>
            <img className='hangmanVis' src={visImages[incorrectGuesses]}alt="imageOfHangman" fluid ></img>
            <p className = "guessesLeftP">Guesses left {8-incorrectGuesses}</p>
            </div>):null}
        </div>
    );
};

export default MultiplayerGame;