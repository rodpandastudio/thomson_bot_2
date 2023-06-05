const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

let Fecha = new Date();
let dia;
let mes;
let año = Fecha.getFullYear();
if (Fecha.getDate() < 10) {
    dia = `0${Fecha.getDate()}`;
} else {
    dia = Fecha.getDate();
}
if (Fecha.getMonth() + 1 < 10) {
    mes = `0${Fecha.getMonth() + 1}`;
} else {
    mes = Fecha.getMonth() + 1;
}
Fecha = `${dia}/${mes}/${año}`;


const notasDevoluciones = new Schema({
    Fecha: { type: String, default: Fecha },
    Numero: { type: Number, require: true },
    Timestamp: { type: Number, default: Date.now() },
    NotaEntrega: { type: Number, require: true },
    Cliente: { type: String, require: true },
    RIF: { type: String, require: true },
    Direccion: { type: String, require: true },
    Telefono: { type: String, require: true },
    CantidadTotal: { type: Number, require: true },
    ValorTotal: { type: Number, require: true },
    Comentario: { type: String, require: true },
    Estado: { type: String, default: 'Procesado' },
    ComentarioAnualcion: { type: String, default: '' },
    PrecioActualNota: { type: Number, require: true },
    Productos: [{
        Codigo: { type: String, require: true },
        Cantidad: { type: Number, require: true },
        Valor: { type: Number, require: true },
    }],
});

module.exports = mongoose.model("notasDevoluciones", notasDevoluciones);