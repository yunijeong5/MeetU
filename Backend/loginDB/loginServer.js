import express from "express";
import logger from "morgan";
import postRouter from "./loginRoutes.js";
import bodyParser from "body-parser";

const port = 5500;
const app = express();

// Use the logger middleware to easily log every HTTP request to our server
app.use(logger("dev"));

// Support JSON on requests
app.use(express.json());

// parses json stuff
app.use(bodyParser.json());

// Use static middleware to serve our client files. This allows the server to attach our index.html file, as well as it's associated css and js files when making a GET request to "/"
app.use(express.static("../Frontend"));

// Use static middleware to serve our post html page and associated script when making a GET request to "/post"
app.use("/signup", express.static("../Frontend/loginCred"));

// Send the post html when accessing a post with a specific id through "/post/:postId"
// app.get("/post/:postId", (req, res) => {
//     res.sendFile("./src/client/post/index.html", { root: "./" });
// });


// Use the routes from route file
app.use("/", postRouter);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
