import React from 'react';

import './confirmationDialog.css';
import question from './question.svg';

const ConfirmationDialog = ({ confirmCallback, discardCallback, message }) => {
  return (
    <div className="dialog-background">
        <div className="dialog-body">
            <div className="dialog-icon">
                <img src={question} alt="" />
            </div>
            <div className="dialog-text">
                <p>{message}</p>
            </div>
            <div className="dialog-buttons">
                <button onClick={discardCallback} className="dialog-discard">Nie</button>
                <button onClick={confirmCallback} className="dialog-confirm">Tak</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationDialog