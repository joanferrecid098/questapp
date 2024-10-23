import { getRandomQuestion } from "./functions/questionsManager";
import { NotificationRow } from "./interfaces/models";
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
        .then(async (result) => {
            if (!result) {
                throw new Error("Error while creating the questions.");
            }

            console.log(
                `Successfully inserted ${result[0].affectedRows} rows.`
            );

            await createNotifications();

            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
};

// Functions
const createNotifications = async () => {
    try {
        const notificationsQuery = "SELECT membership_id FROM notifications";
        const [notifications] = await db.query<NotificationRow[]>(
            notificationsQuery
        );

        if (!notifications) {
            throw new Error("Error while creating the notifications.");
        }

        if (notifications.length === 0) {
            const insertQuery =
                "INSERT INTO notifications (membership_id, notifications, last_update) SELECT id, 1, CURDATE() FROM memberships";
            const [insert] = await db.query<ResultSetHeader>(insertQuery);

            if (!insert) {
                throw new Error("Error while creating the notifications.");
            }

            console.log(`Successfully inserted ${insert.affectedRows} rows.`);
        } else {
            const updateQuery =
                "UPDATE notifications SET notifications = notifications + 1";
            const [update] = await db.query<ResultSetHeader>(updateQuery);

            const insertQuery =
                "INSERT INTO notifications (membership_id, notifications, last_update) SELECT id, 1, CURDATE() FROM memberships WHERE id NOT IN (?)";
            const [insert] = await db.query<ResultSetHeader>(insertQuery, [
                notifications.map((notification) => notification.membership_id),
            ]);

            const date = new Date().toISOString();

            const groupQuery = "UPDATE groups SET last_updated = ?";
            const [group] = await db.query<ResultSetHeader>(groupQuery, [
                date.slice(0, 19).replace("T", " "),
            ]);

            if (!insert || !group) {
                throw new Error("Error while creating the notifications.");
            }

            console.log(
                `Successfully inserted/updated ${
                    insert.affectedRows + update.affectedRows
                } rows.`
            );
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

switch (mode) {
    case "update":
        updateQuestions();
        break;

    default:
        console.log("Command not found");
        break;
}
