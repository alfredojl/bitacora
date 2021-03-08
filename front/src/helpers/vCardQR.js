const xlsx = require('xlsx');
const qr = require('qrcode')

const buildVcard = () => {
    let workbook = xlsx.readFile('./empleadosDSH.xlsx');
    let heads = workbook.SheetNames;
    xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]]).forEach((el, index) => {
        qr.toFile(`./${el.nombre.split(' ')[0]+ '-' + el.telefono}.png`, `BEGIN:VCARD
VERSION:3.0
N:${el.telefono};${el.nombre}
FN:${el.nombreEmbozado}
EMAIL;TYPE=INTERNET:${el.correo}
TEL;TYPE=voice,work,pref:${el.telefono}
END:VCARD`, {
                type: 'png',
                color: {
                    dark: '#4596d5'
                },
                errorCorrectionLevel: 'H'
            },
            (err) => {
                if (err)
                    return new Error(err);
                console.log('done ' + (index + 1) + ' ' + el.nombre);
            })
    })
};

buildVcard();