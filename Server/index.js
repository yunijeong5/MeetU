
import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import path from "path";
import { UserDB } from "./database.js";

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

    // endpoint is to gets all meetings for dashboard
    app.get("/all-meetings", async (req, res) => {
        const username = req.session.username;
        const dbUser = await db.getUser(username);
        let data = await db.getAllMeetings(dbUser.uid);
        res.json( data );
    });


    /*
        http://localhost:4444/private/selectTime/:mid (any mid you have in database)
    */
    // copy sharable links
    app.get("/getMID/:mid", async (req, res) => {
        // add the event to the user in session
        if (req.session && req.session.username) {
            const dbUser = await db.getUser(req.session.username);
            const event = await db.shareUserMID(dbUser.uid, req.params.mid);

        } 
        else res.render("../Client/error");
        
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
        const eventID = await db.addEvent(eventJson, dbUser.uid, null);
        req.session.mid = eventID[0].mid;
        // req.session.uid = eventID[0].uid;
        res.json({ status: "success", eventID });
    });

    app.post("/sendUserMeeting", async (req, res) => {
        const dbUser = await db.getUser(req.session.username);
        const prefJson = req.body;
        const prefID = await db.updateEvent(
            dbUser.uid,
            req.session.mid,
            prefJson
        );
        res.json({ status: "success", prefID });
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

    app.get("/private/selectTime", async (req, res) => {
        res.render("../Client/selectTimePoll");
    });

    app.get("/readEvent", async (req, res) => {
        try {
            const username = req.session.username;
            const dbUser = await db.getUser(username);
            const data = await db.getMeeting(dbUser.uid, req.session.mid);
            const prefs = await db.getAllPref(req.session.mid);
            res.json({data, username, prefs});
        } 
        catch (err) {
          res.json({ error: err.message });
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