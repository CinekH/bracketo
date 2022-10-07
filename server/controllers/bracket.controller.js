import { arrayShuffle } from "../middlewares/arrayShuffle.js";
import { nextId } from "../middlewares/nextId.js";
import Bracket from "../models/bracket.model.js";

export const updateBracket = async (req, res) => {
  try {
    const bracket = await Bracket.findById(req.body.id);
    if (req.body.password === bracket.password) {
      if (req.body.bracketType === 1) {
        bracket.upperBracket[req.body.match].result = req.body.score;
        if (bracket.upperBracket.length - 1 !== req.body.match) {
          const nextMatchId = nextId(req.body.match, bracket.length + 1);
          if (req.body.score === 1) {
            if (req.body.match % 2 === 0)
              bracket.upperBracket[nextMatchId].ParticipantOne =
                bracket.upperBracket[req.body.match].ParticipantOne;
            if (req.body.match % 2 !== 0)
              bracket.upperBracket[nextMatchId].ParticipantTwo =
                bracket.upperBracket[req.body.match].ParticipantOne;
          } else {
            if (req.body.match % 2 === 0)
              bracket.upperBracket[nextMatchId].ParticipantOne =
                bracket.upperBracket[req.body.match].ParticipantTwo;
            if (req.body.match % 2 !== 0)
              bracket.upperBracket[nextMatchId].ParticipantTwo =
                bracket.upperBracket[req.body.match].ParticipantTwo;
          }
        }
        bracket.save();
      }
      res.status(200).json(bracket);
    } else {
      res.status(400).json({ message: "Błędne hasło." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getBracket = async (req, res) => {
  try {
    const bracket = await Bracket.findById(req.params.bracketId);
    const data = {
      id: bracket._id,
      name: bracket.name,
      type: bracket.type,
      length: bracket.length,
      upperBracket: bracket.upperBracket,
      lowerBracket: bracket.lowerBracket,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllBrackets = async (req, res) => {
  try {
    const brackets = await Bracket.find();
    const data = [];
    brackets.map((bracket) => {
      const id = bracket._id;
      const name = bracket.name;
      const amount = bracket.upperBracket.reduce((count, match, index) => {
        if (index <= bracket.length) {
          if (match.ParticipantOne !== null) count++;
          if (match.ParticipantTwo !== null) count++;
        }
        return count;
      }, 0);
      const status =
        bracket.upperBracket[bracket.upperBracket.length - 1].result !== null;
      data.push({ id, name, amount, status });
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createBracket = async (req, res) => {
  try {
    console.log('asdas');
    if (
      req.body.name !== "" &&
      (req.body.type === 1 || req.body.type === 2) &&
      req.body.participants.length !== 0 &&
      req.body.participantsString !== ""
    ) {
      const firstRound = [];
      let firstRoundLenght = Math.pow(
        2,
        Math.ceil(Math.log2(req.body.participants.length)) - 1
      );
      while (firstRoundLenght--)
        firstRound.push({ ParticipantOne: null, ParticipantTwo: null });

      arrayShuffle(req.body.participants);

      firstRound.forEach((value, index) => {
        value.ParticipantOne = req.body.participants[index];
      });

      const remainingIndexes = [...Array(firstRound.length).keys()];

      for (let i = firstRound.length; i < req.body.participants.length; i++) {
        let randomIndex = Math.floor(Math.random() * remainingIndexes.length);
        firstRound[remainingIndexes.splice(randomIndex, 1)].ParticipantTwo =
          req.body.participants[i];
      }

      let bracket = {
        type: req.body.type,
        name: req.body.name,
        length: firstRound.length - 1,
        upperBracket: [],
        lowerBracket: [],
      };

      firstRound.forEach((value) => {
        bracket.upperBracket.push({
          ...value,
          matchId: bracket.upperBracket.length,
          result: null,
        });
      });

      for (let i = 0; i < firstRound.length - 1; i++) {
        bracket.upperBracket.push({
          ParticipantOne: null,
          ParticipantTwo: null,
          matchId: bracket.upperBracket.length,
          result: null,
        });
        /*
        if (bracket.type === 2) {
          bracket.lowerBracket.push({
            ParticipantOne: null,
            ParticipantTwo: null,
            matchId: bracket.lowerBracket.length,
            result: null,
          });
        }
        */
      }
      /*
      if (bracket.type === 2) {
        bracket.upperBracket.push({
          ParticipantOne: null,
          ParticipantTwo: null,
          matchId: bracket.upperBracket.length,
          result: null,
        });
      }
      */
     
      for (let i = 0; i < firstRound.length; i++) {
        const match = bracket.upperBracket[i];
        if (match.ParticipantOne === null) {
          match.result = 2;
          if (i % 2 === 0)
            bracket.upperBracket[
              Math.floor(i / 2) + firstRound.length
            ].ParticipantOne = match.ParticipantTwo;
          if (i % 2 !== 0)
            bracket.upperBracket[
              Math.floor(i / 2) + firstRound.length
            ].ParticipantTwo = match.ParticipantTwo;
        }
        if (match.ParticipantTwo === null) {
          match.result = 1;
          if (i % 2 === 0)
            bracket.upperBracket[
              Math.floor(i / 2) + firstRound.length
            ].ParticipantOne = match.ParticipantOne;
          if (i % 2 !== 0)
            bracket.upperBracket[
              Math.floor(i / 2) + firstRound.length
            ].ParticipantTwo = match.ParticipantOne;
        }
      }

      const password = Math.random().toString(36).substring(2, 10);
      const newBracket = await Bracket.create({
        name: bracket.name,
        type: bracket.type,
        length: bracket.length,
        password: password,
        upperBracket: bracket.upperBracket,
        lowerBracket: bracket.lowerBracket,
      });

      res
        .status(200)
        .json({ id: newBracket._doc._id, password: newBracket._doc.password });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
