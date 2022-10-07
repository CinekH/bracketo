import React, { useState, useEffect, createContext } from "react";
import { useParams } from "react-router-dom";
import { getBracket, updateBracket } from "../../api";

import Messages from "../Messages/Messages";
import Round from "./Round";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

import "./bracket.css";
import ReturnButton from "../ReturnButton/ReturnButton";
export const PasswordContext = createContext();

const Bracket = () => {
  const id = useParams().id;
  const [bracket, setBracket] = useState(null);
  const [renderedBracket, setRenderedBracket] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState({
    message: "",
    confirmCallback: null,
    discardCallback: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setBracket(await getBracket(id));
    };
    setShowPassword(localStorage.getItem("password"));
    localStorage.removeItem("password");
    fetchData();
  }, []);

  useEffect(() => {
    if (bracket) {
      setRenderedBracket([]);
      for (let i = 0; i < Math.log2((bracket.length + 1) * 2); i++) {
        const index =
          Math.pow(2, Math.log2(bracket.length + 1) + 1 - (i + 1)) *
          (Math.pow(2, i + 1) - 2);
        const shift = (bracket.length + 1) / Math.pow(2, i);
        setRenderedBracket((prev) => [
          ...prev,
          <Round
            key={JSON.stringify(
              bracket.upperBracket.slice(index, index + shift)
            )}
            matches={bracket.upperBracket.slice(index, index + shift)}
            bracketType={1}
          />,
        ]);
      }
    }
  }, [bracket]);

  const handleBracketUpdate = async (matchId, result, bracketType) => {
    setConfirmation({
      message: (
        <>
          {`Czy potwierdzasz zwycięstwo drużyny `}
          <strong>
            {result === 1
              ? bracket.upperBracket[matchId].ParticipantOne
              : bracket.upperBracket[matchId].ParticipantTwo}
          </strong>
          ?
        </>
      ),
      confirmCallback: () => {
        fetchUpdate(matchId, result, bracketType);
        setConfirmation({
          message: "",
          confirmCallback: null,
          discardCallback: null,
        });
      },
      discardCallback: () =>
        setConfirmation({
          message: "",
          confirmCallback: null,
          discardCallback: null,
        }),
    });
  };

  const fetchUpdate = async (matchId, result, bracketType) => {
    const updatedBracket = await updateBracket(
      id,
      matchId,
      result,
      password,
      bracketType
    );
    if (updatedBracket === null) {
      setMessage("Błędne hasło");
    } else {
      setMessage("");
      setBracket(updatedBracket);
    }
  };

  return (
    <div className="black-overlay">
      <ReturnButton linkTo={'/bracket'}/>
      {message !== "" && (
        <Messages message={message} clean={() => setMessage("")} />
      )}
      {confirmation.message !== "" && (
        <ConfirmationDialog
          message={confirmation.message}
          confirmCallback={confirmation.confirmCallback}
          discardCallback={confirmation.discardCallback}
        />
      )}
      <div className="bracket-title">
        <h1>{bracket?.name}</h1>
      </div>
      <div className="bracket-status">
        <h3>
          {bracket?.upperBracket[bracket.upperBracket.length - 1]?.result ===
          null ? (
            <span className="bracket-status-ongoing">Otwarty</span>
          ) : (
            <span className="bracket-status-finished">Zakończony</span>
          )}
        </h3>
      </div>
      <div className="bracket-password-input">
        {showPassword !== null && (
          <div className="brakcet-show-password">
            <h3>Zapisz hasło do edycji drabinki:</h3>
            <h3 style={{ color: "red" }}>{showPassword}</h3>
          </div>
        )}
        <h4>Hasło do edycji drabinki</h4>
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="bracket-container-main">
        <PasswordContext.Provider value={handleBracketUpdate}>
          {renderedBracket && renderedBracket}
        </PasswordContext.Provider>
      </div>
    </div>
  );
};

export default Bracket;
