const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.get("/aran", (req, res) => {
    res.send(true);
});

app.listen(4000);