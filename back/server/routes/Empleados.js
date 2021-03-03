const express = require('express');
const app = express();
const fs = require('fs');

const Empleado = require('../models/Empleados');
const url = '/empleado';

app.get(url, (req, res) => {
    let phone = req.query.phone;

    Empleado.find({ phone }, (err, empleadoDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: err
            });
        if (empleadoDB.length < 1)
            return res.json({
                ok: false,
                message: `No se encontró el empleado con el número de teléfono ${phone}.`
            });
        if (!empleadoDB[0].status)
            return res.json({
                ok: false,
                message: 'El empleado no está vigente.',
                empleado: empleadoDB
            })
        return res.json({
            ok: true,
            empleado: empleadoDB
        });
    });
});

app.get('/img', (req, res) => {
    let photo = req.query.photo;
    res.writeHead(200, { 'content-type': 'image/jpg' });
    fs.createReadStream(photo).pipe(res)
})

app.post(url, async(req, res) => {
    let body = req.body.data;

    await Empleado.updateOne({ phone: body.phone }, { $set: body }, { upsert: true }, (err, empleadoDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: err
            });
        return res.json({
            ok: true,
            message: 'Empleado agregado con éxito.'
        });
    });
    // res.json({
    //     ok: true
    // })
});

module.exports = app;