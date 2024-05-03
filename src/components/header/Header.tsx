import { ReactElement } from 'react';
import './header.scss';

const Header: React.FC<{onInstructionsClick(modalBody:ReactElement):void}>= ({onInstructionsClick}) => {
  const modalBody = (
    <>
      <h1>How to play</h1>
      <p>I'm pretending to be famous person, either real or fictional. You have to determine my indentity by asking a bunch of yes or no questions. When you think you know my indentity, straight up ask me "Are you 'x'?".</p>
      <p>Signed,<br />🤖</p>
    </>
  );
  return(
    <header>
      <div className="header__interior">
        <h1 className="header__title">Who am I?</h1>
        <button className="button--secondary" onClick={ () => onInstructionsClick(modalBody) }>
          INSTRUCTIONS
        </button>
      </div>
    </header>
  )
};

export default Header;
