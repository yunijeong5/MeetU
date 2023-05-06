import express from "express";
import PouchDB from "pouchdb";

const router = express.Router();

let db = new PouchDB("log");

router.post('/', (req, res) => {
    const { email, pwd } = req.body;
    // check for empty inputs
    if (!email || !pwd)
        return res.status(400).json({ error: 'Missing inputs.' });

    // TODO: check if email is already in storage

    // store email and password an redirect to dashboard
    db.put({ _id: email, pwd }).then(() => {
        // response type needs to be redirected to dashboard
        res.redirect('../Frontend/dashboard.html');
    }).catch((err) => { // error check
        console.log(err);
        res.status(500).json({ error: 'Server error.' });
    });
});


export default router;
