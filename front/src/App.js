import logo from './logo.svg';
import './App.css';
import HangmanGameSinglePlayer from './Game';
import React, { useState } from 'react';
import MultiplayerGame from './MultiplayerGame';
import {  BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import HangmanRules from './Rules';
function App() {
  

  return (

    <Router>

   
    <nav>
      <ul>
        <li>
          <Link to="/singleplayer">Singleplayer game</Link>
        </li>
        <li>
          <Link to="/rules">Rules</Link>
        </li>
        <li>
          <Link to="/joinMulti">Multiplayer game</Link>
        </li>
      </ul>
    </nav>
    
     <Routes>
         <Route path="singleplayer" element={<HangmanGameSinglePlayer/>} />
         <Route path="joinMulti" element = {<MultiplayerGame/>}/>
         <Route path="rules" element = {<HangmanRules/>}/>

         </Routes>
       
    
  
   </Router>
 
   
  );
}


export default App;

  
