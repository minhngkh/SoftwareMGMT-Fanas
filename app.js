const express = require('express');
const path = require('path');
const ip = require("ip");
const { storage, getDownloadURL } = require('./firebase.js');

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get-audio-url', async (req, res) => {
    console.log(req.query);

    try {
        const filename = "sw" + req.query.chapters + ".mp3";
        const fileRef = storage.bucket().file('SnowWhite/' + filename);
        const url = await getDownloadURL(fileRef);
        res.json({ url });
    } catch (error) {
        console.error("Error fetching the download URL: ", error);
        res.status(500).send("Error fetching the download URL");
    }
});

const PORT = 8080;

module.exports = app;
