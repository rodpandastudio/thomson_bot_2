const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require('bcryptjs')

const clientes = new Schema({
    Nombres: { type: String, require: true},
    Apellidos: { type: String, require: true},
    Cedula: { type: String, require: true},
    Empresa: { type: String, require: true},
    RIF: { type: String, require: true},
    Zona: { type: String, require: true},
    CodigoZona: { type: String, require: true},
    Direccion: { type: String, require: true},
    CodigoPostal: { type: String},
    _idVendedor: { type: String, require: true},
    NombresVendedor: { type: String, require: true},
    Codigo: { type: Number, require: true},
    ApellidosVendedor: { type: String, require: true},
    TipoPrecio: { type: String, require: true},
    email: { type: String, require: true},
    Contacto1: { type: String, require: true},
    Contacto2: { type: String},
    Estado: { type: String, default:'Activo'},
    SaldoFavor: { type: Number, default:0},
});


module.exports = mongoose.model("clientes", clientes);
