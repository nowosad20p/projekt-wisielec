// src/components/HangmanRules.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const HangmanRules = () => {
    return (
        <div className="container mt-5">
            <h1>Hangman Game Rules</h1>
            <p>
                Hangman is a classic word-guessing game. Here are the basic rules:
            </p>
            <ul>
                <li>One player thinks of a word.</li>
                <li>The other player tries to guess the word by suggesting letters.</li>
                <li>If the guessed letter is in the word, it's revealed; otherwise, a part of the hangman is drawn.</li>
                <li>The game continues until the word is guessed or the hangman is fully drawn.</li>
            </ul>
            <p>
                You can customize the rules and add more complexity if desired!
            </p>
        </div>
    );
};

export default HangmanRules;