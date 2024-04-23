import React, { useState } from 'react';

function GameResult({gameFinished, restartGame}) {
  

  return (
    <div >
      {gameFinished[0] ? (
        <div className="popup">
          <h2>{gameFinished[1]}</h2>
          <h4>The word was: {gameFinished[2]}</h4>
          <button onClick={()=>{restartGame()}}>Play again</button>
        </div>
      ):null}
    </div>
  );
}

export default GameResult;