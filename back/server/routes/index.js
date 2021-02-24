const express = require('express');

const app = express();

app.use(require('./Empleados'))
app.use(require('./Asistencia'))
app.use(require('./Upload'))

module.exports = app;