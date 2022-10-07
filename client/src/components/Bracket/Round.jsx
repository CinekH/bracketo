import { useState, useEffect } from 'react';

import Match from './Match';

const Round = ({ matches, bracketType }) => {
  const [matchComponents, setMatchComponents] = useState(null);
  
  useEffect(() => {
    setMatchComponents([]);
    matches.forEach(match => {
      setMatchComponents(prev => [...prev, <Match bracketType={bracketType} key={match.matchId} matchData={match}/>]);
    });
  }, [])

  return (
    <div className="bracket-round">
      {matchComponents && (matchComponents)}
    </div>
  )
}

export default Round