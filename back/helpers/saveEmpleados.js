const xlsx = require('xlsx');
const Empleado = require('../server/models/Empleados');
const path = require('path');
const os = require('os');
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw new Error(err)
    console.log('MongoDB/asistencia connected...')
});

const saveEmpleados = async() => {
    Empleado.find({}, (err, empleadosDB) => {
            if (err) throw new Error(err);
            let count = 0;
            empleadosDB.forEach(el => {
                let photo = el.photo.split('.');
                photo[1] = 'jpg';
                photo = photo.join('.');
                el.photo = photo;
                Empleado.updateMany({ phone: el.phone }, el, (err, empleadoDB) => {
                    if (err) throw new Error(err);
                    count++;
                    console.log('Hecho ', count);
                })
            })
        })
        // let workbook = xlsx.readFile('./empleadosDSH.xlsx');
        // let heads = workbook.SheetNames;
        // let errors = [],
        //     empleados = [];
        // for ([index, el] of xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]]).entries()) {
        //     // console.log(index, el.nombre);
        //     let photo = path.resolve(os.homedir() + '/employeesPhotos/' + el.nombre.split(' ')[0] + '-' +
        //         el.telefono + '.png');
        //     await Empleado.create({
        //         name: el.nombreEmbozado,
        //         phone: el.telefono,
        //         email: el.correo,
        //         photo
        //     }, (err, empleadoDB) => {
        //         if (err) errors.push(err)
        //         empleados.push(empleadoDB);
        //     })
        // }
        // xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]]).forEach(async(el, index) => {
        //     let photo = path.resolve(os.homedir() + '/employeesPhotos/' + el.nombre.split(' ')[0] + '-' +
        //         el.telefono + '.png');
        //     await Empleado.create({
        //         name: el.nombre,
        //         phone: el.telefono,
        //         email: el.correo,
        //         photo
        //     }, (err, empleadoDB) => {
        //         if (err) errors.push(err)
        //         empleados.push(empleadoDB);
        //     })
        // })
        // if (errors.length > 0)
        //     console.log('Hubo errores:\n', errors);
        // else
        //     console.log('Sin errores');
        // console.log(empleados);
}

saveEmpleados();