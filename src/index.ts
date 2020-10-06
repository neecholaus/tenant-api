import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.status(500).send({
        error: true,
        errorMessage: 'invalid route'
    });
});

app.listen(9000);