import React, { useState, useEffect } from "react";
import "./home.css";

import bracketo from "./bracketo.png";

import { createBracket } from "../../api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [displayElement, setDisplayElement] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: null,
    participants: [],
    participantsString: "",
  });
  const [error, setError] = useState({
    mainError: "",
    nameError: "",
    typeError: "",
    participantsError: "",
  });
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  const checkTeamName = (name) => {
    if (name.length > 20)
      setError((prev) => ({
        ...prev,
        participantsError: "Maksymalna długość nazwy uczestnika to 20 znaków",
      }));
    if (name.replace(/\s\s+/g, "") === "") return false;
    return true;
  };

  const validate = () => {
    let error = false;

    if(form.participants.length >= 3) {
      setError((prev) => ({ ...prev, participantsError: "" }));
    }

    if (form.name.length === 0) {
      setError((prev) => ({ ...prev, nameError: "Wpisz nazwę turnieju" }));
      error = true;
    }

    if (form.name.length > 30) {
      setError((prev) => ({ ...prev, nameError: "Zbyt długa nazwa turnieju" }));
      error = true;
    }

    if (!(form.type === 1 || form.type === 2)) {
      setError((prev) => ({ ...prev, typeError: "Nieprawidłowa wartość" }));
      error = true;
    }

    if(form.participants.length < 3) {
      setError((prev) => ({...prev, participantsError: "W turnieju musi wziąc udział minimum 3 uczestników"}))
    }

    if (error) return false;
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError((prev) => ({
      ...prev,
      participantsError: "",
    }));
    const data = {
      ...form,
      participants: form.participantsString
        .split(/\n/)
        .filter((element) => checkTeamName(element)),
    };
    form.participants = data.participants;
    if (validate()) setResponseData(await createBracket(data));
  };

  useEffect(() => {
    if (responseData !== null) {
      console.log(responseData);
      localStorage.setItem("password", responseData.password);
      navigate(`/bracket/${responseData.id}`);
    }
  }, [responseData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (form.name.length > 30) {
      setError((prev) => ({ ...prev, nameError: "Zbyt długa nazwa turnieju" }));
    } else {
      setError((prev) => ({ ...prev, nameError: "" }));
    }

    if (form.type !== 1 && form.type !== 2 && form.type !== null) {
      setError((prev) => ({ ...prev, typeError: "Nieprawidłowa wartość" }));
      console.log(form.type);
    } else {
      setError((prev) => ({ ...prev, typeError: "" }));
    }
  }, [form]);

  useEffect(() => {
    if (scrollPosition > 915) {
      setDisplayElement(true);
    }
  }, [scrollPosition]);

  return (
    <div className="main">
      <div className="home-container">
        <div className="home-brand">
          <img src={bracketo} alt="logo" />
        </div>
        <div className="home-header">
          <h1>Narzędzie do tworzenia drabinek turniejowych</h1>
        </div>
        <div className="home-button">
          <button
            onClick={() => window.scrollTo({ top: 1080, behavior: "smooth" })}
          >
            Stwórz drabinkę
          </button>
        </div>
        <div className="bracketslist-button">
          <button onClick={() => navigate("/bracket")}>Lista turniejów</button>
        </div>
      </div>
      <div className="bracket-container">
        <div
          className={`bracket-form ${
            displayElement ? "bracket-form-display" : ""
          }`}
        >
          <div className="bracket-left"></div>
          <div className="bracket-right">
            <form onSubmit={handleSubmit}>
              <div className="bracket-form-row">
                <label htmlFor="name">Nazwa turnieju:</label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  className={error.nameError !== "" ? "bracket-form-error" : ""}
                />
                {error.nameError !== "" && (
                  <span className="smallError">{error.nameError}</span>
                )}
              </div>
              <div className="bracket-form-row">
                <label htmlFor="type">Typ turnieju:</label>
                <select
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      type: parseInt(e.target.value),
                    }));
                  }}
                  className={error.typeError !== "" ? "bracket-form-error" : ""}
                >
                  <option value="" disabled selected hidden>
                    Wybierz typ...
                  </option>
                  <option value={1}>Pojedyncza elimnacja</option>
                  {/*<option value={2}>Podwójna eliminacja</option>*/}
                </select>
                {error.typeError !== "" && (
                  <span className="smallError">{error.typeError}</span>
                )}
                <span className="bracket-arrow"></span>
              </div>
              <div className="bracket-form-row">
                <label htmlFor="participants">Lista uczestników:</label>
                <span className="small-text">
                  Każdy uczestnik w osobnej linii
                </span>
                <textarea
                  className={
                    error.participantsError !== "" ? "bracket-form-error" : ""
                  }
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      participantsString: e.target.value,
                    }));
                  }}
                  name="participants"
                />
                {error.participantsError !== "" && (
                  <span className="smallError">{error.participantsError}</span>
                )}
              </div>
              <button type="submit" className="bracket-button">
                <strong>Wygeneruj drabinkę</strong>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
