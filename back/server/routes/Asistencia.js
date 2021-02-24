const express = require('express');
const app = express();
const moment = require('moment');

const Asistencia = require('../models/Asistencia');
const url = '/asistencia';

moment.locale('es-mx');

app.post(url, async(req, res) => {
    let body = req.body.data;
    if (body.checkIn)
        body.checkIn = moment(body.checkIn)
    if (body.checkOut)
        body.checkOut = moment(body.checkOut)

    // res.json({
    //     ok: true
    // })
    await Asistencia.create(body, (err, asistDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: err
            });
        return res.json({
            ok: true,
            asist: asistDB
        });
    });
});

app.get(url, async(req, res) => {
    let phone = req.query.phone;
    let day = req.query.day;

    await Asistencia.find({
        phone,
        $or: [
            { checkIn: { $lte: moment(day + ' 23:59:59'), $gte: moment(day) } },
            { checkOut: { $lte: moment(day + ' 23:59:59'), $gte: moment(day) } }
        ]
    }, (err, asistDB) => {
        if (err)
            return res.status(501).json({
                ok: false,
                message: err
            });
        return res.json({
            ok: true,
            asistencia: asistDB
        });
    });
});

module.exports = app;