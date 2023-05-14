import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import users from "./users.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import path from "path";
import { UserDB } from "./database.js";
import passport from "passport";

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// Create the Express app
// const app = express();

// Session configuration
const sessionConfig = {
    // set this encryption key in Heroku config (never in GitHub)!
    secret: process.env.SECRET || "SECRET",
    resave: false,
    saveUninitialized: false,
};

const UserRoutes = (app, db) => {
    //checks if user is logged in
    let isUserLogin = false;
    // Set up the view engine
    app.set("view engine", "ejs");
    // Add body parser middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    // Setup the session middleware
    app.use(expressSession(sessionConfig));
    // Allow JSON inputs
    app.use(express.json());
    // Allow URLencoded data
    app.use(express.urlencoded({ extended: true }));
    // Allow static file serving
    app.use(express.static(path.join(__dirname, "Client")));
    app.use("/style", express.static(path.join(__dirname, "Client", "style")));

    app.get("/", async (req, res) => {
        isUserLogin = req.session && req.session.username;
        res.render("../Client/index", { isUserLogin });
    });

    app.get("/login", async (req, res) => {
        res.render("../Client/LoginCred/login");
    });

    app.get("/register", async (req, res) => {
        res.render("../Client/LoginCred/register");
    });

    app.get("/error", async (req, res) => {
        res.render("../Client/error");
    });

    app.get("/logout", (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });

    // gets the meeting ID and user ID as link to redirect
    app.get("/private/dashboard", async (req, res) => {
        const dbUser = await db.getUser(req.session.username);
        const user = dbUser.username;
        res.render("../Client/dashboard", { user });
    });

    //TODO: create sharing links
    app.get("/:mid/", (req, res) => {
        // const mid = await db.getMID(req.params.mid);
        // const uid = await db.getUID(req.params.uid);
        // res.sendFile("/login", { root: __dirname })
    });

    app.post("/login", async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await db.getUser(username);
            if (user.password === password) {
                req.session.username = username;
                return res.redirect("/private/dashboard");
            } else {
                return res.redirect("/login?error=Invalid login");
            }
        } catch (err) {
            return res.redirect("/login?error=Invalid login");
        }
    });

    app.post("/createEvent", async (req, res) => {
        const dbUser = await db.getUser(req.session.username);
        const eventJson = req.body;
        const eventID = await db.addEvent(eventJson, dbUser.uid);
        res.json({ status: "success", eventID });
    });

    app.get("/private/dashboard", async (req, res) => {
        const dbUser = await db.getUser(req.session.username);
        const user = dbUser.username;
        res.render("../Client/dashboard", { user });
    });

    // route to private username of the createEvent page
    app.get("/private/createEvent", async (req, res) => {
        const dbUser = await db.getUser(req.session.username);
        const user = dbUser.username;
        res.render("../Client/createEvent", { user });
    });

    //TODO: remove comments
    app.get("/private/selectTime", async (req, res) => {

        // const dbUser = await db.getUser(req.session.username);
        // const eventData = await db.getMeeting(dbUser.uid);
        // const mid = eventData.mid;
        // res.render("../Client/selectTimePoll", { mid });
        try {
            const dbUser = await db.getUser(req.session.username);
            const eventData = await db.getMeeting(dbUser.uid);
            // res.status(200).json({ eventData });
            res.render("../Client/selectTimePoll", { eventData });
        } catch (err) {
            // res.status(500).json({ error: err.message });
            res.render("../Client/error", { user });
        }
        
        
    });


    // Use res.redirect to change URLs.
    app.post("/register", async (req, res) => {
        const { username, password, retypePass } = req.body;
        if (!username || !password || !retypePass) {
            res.redirect("/register?error=Username and password is required");
            return;
        }

        if (password !== retypePass) {
            res.redirect("/register?error=Passwords do not match");
            return;
        }

        // checks if the user exists in database
        const user = await db.getUser(username);
        if (user) return res.redirect("/register?error=User exists already");
        // creates new user and store in pg database
        const createUser = await db.createUser(username, password);
        req.session.username = createUser.username;
        return res.redirect("/private/dashboard");
    });

    return app;
};

const run = async () => {
    const db = await UserDB(process.env.DATABASE_URL).connect();
    const app = UserRoutes(express(), db);
    const port = process.env.PORT || 4444;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

run();
