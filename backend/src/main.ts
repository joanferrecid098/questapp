import express, { NextFunction, Request, Response } from "express";
import { exec } from "child_process";
import cron from "node-cron";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Cron Job
cron.schedule("0 0 * * *", () => {
    exec("node " + __dirname + "/cli.js update", (error, stdout, stderr) => {
        if (error) {
            console.error(`${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`${stderr}`);
            return;
        }

        console.log(`${stdout}`);
    });
});

// Middleware
import requireAuth from "./middleware/requireAuth";

const unless = (
    paths: string[],
    middleware: (req: Request, res: Response, next: NextFunction) => void
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (paths.some((path) => req.path.startsWith(path))) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

const corsOptions = {
    methods: ["GET", "POST", "PATCH", "DELETE"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
    console.log("Connection to: " + req.path + " With method: " + req.method);
    next();
});
app.use(unless(["/api/users/login", "/api/users/signup"], requireAuth));

// Express Routers
import usersRouter from "./routers/users";
import groupsRouter from "./routers/groups";
import votesRouter from "./routers/votes";

app.use("/api/users", usersRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/votes", votesRouter);

// Listen for Express Requests
app.listen(process.env.PORT, () => {
    console.log("Listening on port:", process.env.PORT);
});
