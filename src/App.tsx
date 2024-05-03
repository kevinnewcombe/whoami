import './app.scss'
import { useState, useRef, useEffect } from 'react';
import Header from './components/header/Header';
import Modal from './components/modal/Modal';
import Guess from './components/guess/Guess';

type QuestionsType = {
  question: string;
  answer: string;
}

function App() {
  const dialog = useRef<any>(null);
  const [modalBody, setModalBody] = useState<any>();
  const [guesses, setGuesses] = useState<QuestionsType[]>([]); // [question, question, question]
  const [person, setPerson] = useState<string>('');

  function openModal(body: React.ReactElement){
    setModalBody(body);
    dialog.current!.open();
  }
  async function startGame(){
    let response;
    let json;
    try{
      response = await fetch(
        `/api/start`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      json = await response.json();
    } catch( error ){
      console.error(error);
      openModal(<><h2>Error!</h2><p></p></>);
      // Error
    }
    if (response?.ok) {
      if(json.error){
        openModal(<><h2>Error</h2><p>{ json.error.message }</p></>);
      }else{
        setPerson(json.message);
      }
    }
  }
  useEffect(() => {
    if(!person){
      startGame();
    }
  });

  async function onGuess(question: string){
    let response;
    let json;
    try{
      response = await fetch(
        `/api/ask?question=${question}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      json = await response.json();
    } catch( error ){
      // Error
    }
    if (response?.ok) {
      if(json.error){
        openModal(<><h2>Error!</h2><p>{ json.error.message }</p></>);
      }else{
        setGuesses([{question: question, answer: json.message}, ...guesses]);
      }
    }
  }
  function revealPerson(){
    const body = (
      <h2>The person is {person}.</h2>
    )
    openModal(body);
  }
  async function restartGame(){
    await startGame();
    setGuesses([]);
  }
  return (
    <div className="app">
      <Modal ref={dialog}>{modalBody}</Modal>
      <Header onInstructionsClick={openModal} />
      <main>
        <Guess onGuess={onGuess} />
        <div className="buttons">
          <button className={ 'button button--primary'} onClick={ restartGame }>NEW GAME</button>
          <button className={ 'button button--primary'} onClick={revealPerson}>REVEAL PERSON</button>
        </div>
        <div className="responses" role="region" aria-live="polite">
          <h2>Responses</h2>
          {guesses.map((guess, index) => (
            <p key={index} className="response"><strong>You asked</strong>: {guess.question}<br />
            <strong>Their response:</strong> {guess.answer}</p>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
