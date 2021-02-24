const config = require('../config/config');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(require('./routes/index'));

mongoose.connect(config.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw new Error(err)
    console.log('MongoDB/asistencia connected...')
});

app.listen(config.listenPort, () => console.log('Escuchando en puerto ', config.listenPort));
app.get('/', (req, res) => {
    res.send('¡Listo, funciono!')
})