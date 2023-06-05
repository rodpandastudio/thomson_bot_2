const mongoose = require("mongoose");

const { Schema } = mongoose;

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

const ordenesCompras = new Schema({
    Timestamp: { type: Number, default: Date.now() },
    Fecha: { type: String, default: Fecha },
    Numero: { type: String, require: true },
    _idUserClient: { type: String, require: true },
    Cliente: { type: String, require: true },
    _idCliente: { type: String, require: true },
    Estado: { type: String, default: "Pendiente" },
    Vendedor: { type: String, require: true },
    _idVendedor: { type: String, require: true },
    CantidadTotal: { type: Number, require: true },
    PrecioTotal: { type: Number, require: true },
    Productos: [
    {
        Codigo: { type: String, require: true },
        Descripcion: { type: String, require: true },
        Cantidad: { type: String, require: true },
        Cantidad2: { type: String, require: true },
        PrecioUnidad: { type: String, require: true },
        PrecioTotal: { type: String, require: true },
        PrecioTotal2: { type: String, require: true },
    },
  ],
});

module.exports = mongoose.model("ordenes Compras Clientes Vendedores",ordenesCompras);
