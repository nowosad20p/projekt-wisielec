import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
import GameResult from './GameResult';
const HangmanGameSinglePlayer = () => {
  

  const qwertyKeys = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];


  const visImages = [vis0,vis1,vis2,vis3,vis4,vis5,vis6,vis7,vis8];
 

  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [randomWord, setRandomWord] = useState('');
  const [gameFinished,setGameFinished] = useState([false,"",""]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [currentWord, setCurrentWord]=useState("");
  const guessedWord = useRef("");


  useEffect(() => {
    const fetchRandomWord = async () => {
     
      try {
        const response = await axios.get('https://random-word-api.herokuapp.com/word');
        const word = response.data[0];
        console.log(response)
        let hiddenWord="";
        for(let i = 0; i<word.length;i++){
          hiddenWord+='-';
        }
        setCurrentWord(hiddenWord);
        setRandomWord(word);
        

      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomWord();
  }, []);
  const restartGame = ()=>{
    window.location.reload();
  }
  useEffect(() => {
   if(randomWord.length==0){return}
    if (incorrectGuesses >= 8) {
      // Too many incorrect guesses, end the game
      setGameFinished([true,"Game Over!",randomWord]);
      console.log('Game over! You lose.',randomWord);
    } else if (currentWord.toLowerCase() === randomWord) {
      // Entire word guessed correctly, player wins
      setGameFinished([true,"Victory!",randomWord]);

      console.log('Congratulations! You win.',randomWord);
    }else{
      console.log(currentWord,randomWord)
    }
  }, [incorrectGuesses, randomWord,currentWord]);
  const handleButtonClick = (letter) => {
    if (incorrectGuesses >= 8) {return}
    setGuessedLetters((prevLetters) => [...prevLetters, letter]);
     
    let newWord = [...currentWord];
    let found = false;
    for(let i = 0; i < randomWord.length;i++){
      if(letter.toLowerCase() == randomWord[i]){
       
        newWord[i] = letter;
        found = true;
      }
    }
    if(!found){
      setIncorrectGuesses(incorrectGuesses+1);
    }
    setCurrentWord(newWord.join(""));
   
    
    
  };
  const handleGuessButtonClick = ()=>{

   if (guessedWord.current.value.toLowerCase() === randomWord) {
      // Entire word guessed correctly, player wins
      setGameFinished([true,"Victory!",randomWord]);

      console.log('Congratulations! You win.',randomWord);
    }else{
      setIncorrectGuesses(incorrectGuesses+1);
    }
  }
 

  return (
    <div>

      <div className="word-display">{currentWord}</div>

      <div className="keyboard">
        {qwertyKeys.map((key) => (
          <button
            key={key}
            className={`key ${guessedLetters.includes(key) ? randomWord.includes(key.toLowerCase())?'green':'gray' : 'blue'}`}
            onClick={() => handleButtonClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="guessContainer">      <input ref={guessedWord}></input>
      <button onClick={handleGuessButtonClick}>Guess</button>
      </div>
      <img className='hangmanVis' src={visImages[incorrectGuesses]}alt="imageOfHangman" fluid ></img>
      <p className = "guessesLeftP">Guesses left: {8-incorrectGuesses}</p>
      <GameResult gameFinished={gameFinished} restartGame = {restartGame}/>
    </div>
  );
};

export default HangmanGameSinglePlayer;
