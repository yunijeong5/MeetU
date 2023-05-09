import express from "express";
import logger from "morgan";
import postRouter from "./log-routes.js";
import path from "path";

const port = 5500;
const app = express();

// Use the logger middleware to easily log every HTTP request to our server
app.use(logger("dev"));

// Support JSON on requests
app.use("/signup", postRouter);

// Use the routes created for posts, stored neatly in it's own file
app.use(postRouter);

// Use static middleware to serve our client files. This allows the server to attach our index.html file, as well as it's associated css and js files when making a GET request to "/"
app.use(express.static("../Client/LoginCred"));

// Use static middleware to serve our post html page and associated script when making a GET request to "/post"

app.use(
    "/dashboard",
    express.static(path.join(__dirname, "../Client/LoginCred/verified"))
);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
