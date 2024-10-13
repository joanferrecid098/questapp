import { getRandomQuestion } from "./functions/questionsManager";
import { Question } from "./interfaces/questions";
import { ResultSetHeader } from "mysql2";
import dotenv from "dotenv";

// Import Environment Variables
dotenv.config();

// Import Database Connection
import db from "./connection";

// Command Argument
const mode = process.argv[2];

const updateQuestions = async () => {
    const question: Question = getRandomQuestion();
    const date = new Date().toISOString();

    const query =
        "INSERT INTO questions (category, question, date, group_id) SELECT ?, ?, ?, id FROM groups";

    await db
        .query<ResultSetHeader>(query, [
            question.category,
            question.question,
            date.split("T")[0],
        ])
        .then((result) => {
            if (!result) {
                throw new Error("Error while creating the questions.");
            }

            console.log(
                `Successfully inserted ${result[0].affectedRows} rows.`
            );

            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
};

switch (mode) {
    case "update":
        updateQuestions();
        break;

    default:
        console.log("Command not found");
        break;
}
