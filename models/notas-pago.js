const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const notasPago = new Schema({
    Numero: { type: Number, require: true },
    Cliente: { type: String, require: true },
    Timestamp: { type: String, require: true },
    Fecha: { type: String, require: true },
    RIF: { type: String, require: true },
    Direccion: { type: String, require: true },
    Telefono: { type: String, require: true },
    Comentario: { type: String, require: true },
    PagadoTotal: { type: Number, require: true },
    SubTotal: { type: Number, require: true },
    SaldoFavorInlcuido: { type: Number, require: true },
    Pendiente: { type: Number, require: true },
    Estado: { type: String, default: 'Procesado' },
    ComentarioAnualcion: { type: String, default: '' },
    Notas: [{
        Nota: { type: String, require: true },
        Pendiente: { type: Number },
        Pago: { type: Number, require: true },
        Restante: { type: Number },
        Observacion: { type: String, require: true },
        Modalidad: { type: String, require: true },
        Destino: { type: String },
        Referencia: { type: String },
        Comentario: { type: String, require: true }
    }],
});


module.exports = mongoose.model("notasPago", notasPago);