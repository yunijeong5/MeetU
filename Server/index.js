import "dotenv/config";
import express from "express";
import expressSession from "express-session";
import users from "./users.js";
import auth from "./auth.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import path from "path";

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// Create the Express app
const app = express();
const port = process.env.PORT || 4444;

// Set up the view engine
app.set("view engine", "ejs");

// Add body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
const sessionConfig = {
    // set this encryption key in Heroku config (never in GitHub)!
    secret: process.env.SECRET || "SECRET",
    resave: false,
    saveUninitialized: false,
};

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
auth.configure(app);

// Our own middleware to check if the user is authenticated
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect("/login");
    }
}

app.get("/", checkLoggedIn, (req, res) => {
    res.send("hello world");
});

// Handle the URL /login (just output the login.html file).
app.get("/login", (req, res) =>
    res.sendFile("Client/LoginCred/login.html", { root: __dirname })
);

// Handle post data from the login.html form.
app.post("/login", (req, res, next) => {
    auth.authenticate("local", (err, user) => {
        if (err)
            // error, pass it next middleware.
            return next(err);
        if (!user)
            // no user, then redirect
            return res.redirect("/login?error=Invalid username or password");
        req.login(user, (err) => {
            if (err) return next(err);
            // Redirect to the private page.
            return res.redirect("/private");
        });
    })(req, res, next);
});

// Handle logging out (takes us back to the login page).
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post("/register", (req, res) => {
    const { username, password, retypePass } = req.body;
    if (!username || !password || !retypePass) {
        res.redirect("/register?error=Username and password is required");
        return;
    }
    if (password !== retypePass) {
        res.redirect("/register?error=Passwords do not match");
        return;
    }
    if (users.addUser(username, password)) {
        // redirect to a private dashboard
        req.login(username, (err) => {
            if (err) {
                res.redirect("/login");
            } else {
                res.redirect("/private/" + username);
            }
        });
    } else {
        res.redirect("/register?error=Username already exists");
    }
});

// Register URL
app.get("/register", (req, res) =>
    res.sendFile("Client/LoginCred/register.html", { root: __dirname })
);

// Private data
app.get(
    "/private",
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {
        // Go to the user's page.
        res.redirect("/private/" + req.user);
    }
);

// A dummy page for the user.

app.get(
    "/private/:userID/",
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.userID === req.user) {
            const username = req.user;
            res.render("../Client/dashboard", { username });
        } else {
            res.redirect("/private/");
        }
    }
);

app.get("*", (req, res) => {
    //res.send('Error');
    res.redirect("/error.html");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
