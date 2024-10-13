import { Question } from "../interfaces/questions";
import path from "path";
import fs from "fs";

export const getQuestions = (): Question[] => {
    const filePath = path.join(__dirname, "../custom/questions.json");
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
};

export const getRandomQuestion = (): Question => {
    const questions = getQuestions();
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    return question;
};
