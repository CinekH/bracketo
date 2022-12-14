import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Home from "./components/Home/Home";
import ShowBrackets from "./components/ShowBrackets/ShowBrackets";
import Bracket from "./components/Bracket/Bracket";

import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/bracket" element={<ShowBrackets />} />
      <Route path="/bracket/:id" element={<Bracket />} />
      <Route path="*" element={<Home/>}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
