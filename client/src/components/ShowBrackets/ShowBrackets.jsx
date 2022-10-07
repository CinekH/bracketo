import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAllBrackets } from "../../api";

import "./showBrackets.css";

import ReturnButton from "../ReturnButton/ReturnButton";

const ShowBrackets = () => {
  const [brackets, setBrackets] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllBrackets();
      setBrackets([...response]);
    };
    fetchData();
  }, []);

  const goToBracket = (id) => {
    navigate(`/bracket/${id}`);
  };

  return (
    <div className="showbrackets-background">
      <ReturnButton linkTo={'/'}/>
      <div className="showbrackets-list">
        <div className="showbrackets-header">
          <div></div>
          <div>Nazwa turnieju</div>
          <div>Liczba uczestników</div>
          <div>Status</div>
        </div>
        <div className="showbrackets-bracket">
          {brackets &&
            brackets.map((bracket) => {
              return (
                <div className="showbrackets-bracket-row" key={bracket.id}>
                  <button onClick={() => goToBracket(bracket.id)}></button>
                  <div>{bracket.name}</div>
                  <div>{bracket.amount}</div>
                  <div
                    className={`showbrackets-bracket-row-last ${
                      bracket.status
                        ? "showbrackets-closed"
                        : "showbrackets-open"
                    }`}
                  >
                    <span>{bracket.status ? "Zakończony" : "Otwarty"}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ShowBrackets;
