const express = require('express');
const fileUpload = require('express-fileupload');
const Empleado = require('../models/Empleados');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

const ruta = '/upload';

app.use(fileUpload({ useTempFiles: false }));

app.post(ruta, async(req, res) => {
    let file = req.files.filePhoto;
    let phone = req.body.phone;
    let pathUpload = path.resolve(os.homedir() + '/employeesPhotos/' + file.name)

    if (!fs.existsSync(path.resolve(os.homedir() + '/employeesPhotos/')))
        fs.mkdirSync(path.resolve(os.homedir() + '/employeesPhotos/'));

    file.mv(pathUpload);
    // res.json({
    //         ok: true,
    //         message: 'Todo ok.'
    //     })
    await Empleado.updateOne({ phone }, { $set: { photo: pathUpload } }, (err, empleadoDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: err
            })
        return res.json({
            ok: true,
            message: `Empleado con número de teléfono ${ phone } fue agregado correctamente.`
        })
    })
});

module.exports = app;