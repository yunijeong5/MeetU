import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import users from "./users.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import path from "path";
import { UserDB } from './database.js';
import passport from 'passport';


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

    // Configure our authentication strategy
    // auth.configure(app);

    // Handle the URL /login (just output the login.html file).
    app.get("/login", (req, res) =>
        res.sendFile("Client/LoginCred/login.html", { root: __dirname })
    );

    app.post("/login", async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await db.getUser(username);
            if (user.password === password) {
                req.session.username = username;
                return res.redirect("/private/" + req.session.username + "/dashboard");
            }
            else {
                return res.redirect("/login?error=Invalid login");
            }
        }
        catch (err) {
            return res.redirect("/login?error=Invalid login");
        }
    });

    // Handle logging out (takes us back to the login page).
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/login");
    });

    app.get("/private/:userID/dashboard", async (req, res) => {
        const user = await db.getUser(req.params.userID);
        if (!user) return res.redirect("/login");
        res.render("../Client/dashboard", { user });
    });

    // route to private username of the createEvent page
    app.get("/private/:userID/createEvent", async (req, res) => {
        const eventJson = req.body;
        const user = await db.getUser(req.params.userID);
        if (!user) return res.redirect("/login");
        const event = await db.addEvent(eventJson);
        res.render("../Client/createEvent", { event });
    });

    // route to private username of the selectTime page
    app.get("/private/:userID/selectTime", async (req, res) => {
        const user = await db.getUser(req.params.userID);
        if (!user) return res.redirect("/login");
        res.render("../Client/selectTime", { user });
    });

    // Use res.redirect to change URLs.
    app.post('/register', async (req, res) => {
        const { username, password, retypePass } = req.body;
        if (!username || !password || !retypePass) {
            res.redirect('/register?error=Username and password is required');
            return;
        }

        if (password !== retypePass) {
            res.redirect('/register?error=Passwords do not match');
            return;
        }

        // checks if the user exists in database
        const user = await db.getUser(username);
        if (user)
            return res.redirect("/register?error=User exists already");
        // creates new user and store in pg database
        const createUser = await db.createUser(username, password);
        req.session.username = createUser.username;
        return res.redirect("/private/" + createUser.username + "/dashboard");
    });

    // Register URL
    app.get("/register", (req, res) =>
        res.sendFile("Client/LoginCred/register.html", { root: __dirname })
    );




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


