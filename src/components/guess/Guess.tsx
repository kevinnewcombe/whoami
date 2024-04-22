import { useRef } from 'react';

const Guess: React.FC<{onGuess(question:string):void}>= ({onGuess}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  function askQuestion(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(inputRef.current){
      onGuess(inputRef.current.value);
      inputRef.current.value = '';
    }
  }
  return (
    <form onSubmit={ askQuestion }>
      <label htmlFor="ask">Question</label>
      <input id="ask" ref={ inputRef }/> 
    </form>
  );
}

export default Guess;
