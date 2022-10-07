import React from "react";

import "./messages.css";

const Messages = ({ message, clean }) => {
  return (
    <div className="message">
      <button onClick={clean}>X</button>
      <p>{message}</p>
    </div>
  );
};

export default Messages;
