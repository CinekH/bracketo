import React, { useState, useEffect, useContext } from "react";

import { PasswordContext } from './Bracket';

const Match = ({ matchData, bracketType }) => {
  const [isEditable, setIsEditable] = useState(false);
  
  const updateFunction = useContext(PasswordContext);

  useEffect(() => {
    if (
      matchData.ParticipantOne !== null &&
      matchData.ParticipantTwo !== null &&
      matchData.result === null
    )
      setIsEditable(true);
  }, []);

  return (
    <div className="bracket-match">
      <div
        {...(isEditable && {
          onClick: () => updateFunction(matchData.matchId, 1, bracketType),
        })}
        className={matchData.result === 1 ? "bracket-match-winner" : isEditable ? 'bracket-match-editable' : ''}
      >
        {matchData.ParticipantOne}
      </div>
      <div
        {...(isEditable && {
          onClick: () => updateFunction(matchData.matchId, 2, bracketType),
        })}
        className={matchData.result === 2 ? "bracket-match-winner" : isEditable ? 'bracket-match-editable' : ''}
      >
        {matchData.ParticipantTwo}
      </div>
    </div>
  );
};

export default Match;
