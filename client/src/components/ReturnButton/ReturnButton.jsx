import React from "react";
import { Link } from "react-router-dom";

import './returnButton.css';

const ReturnButton = ({ linkTo }) => {
  return (
    <Link to={linkTo} className="return">
      POWRÓT
    </Link>
  );
};

export default ReturnButton;
