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

const notaEntrega = new Schema({
    Timestamp: { type: Number, require: Date.now() },
    Fecha: { type: String, require: true },
    Vencimiento: { type: String, require: true },
    Numero: { type: Number, require: true },
    Factura: [{ type: String, default: "-" }],
    Control: [{ type: String, default: "-" }],
    Cliente: { type: String, require: true },
    TodoFactuado: {type: Boolean, default: false},
    RIF: { type: String, require: true },
    Direccion: { type: String, require: true },
    Telefono: { type: String, require: true },
    FechaAnulacion: { type: String, require: true },
    Neto: { type: Number, require: true },
    Neto2: { type: Number, require: true },
    Saldo: { type: Number, require: true },
    CantidadTotal: { type: Number, require: true },
    CantidadTotal2: { type: Number, require: true },
    Vendedor: { type: String, require: true },
    _idVendedor: { type: String, require: true },
    _idCliente: { type: String, require: true },
    TipoPrecio: { type: String, require: true },
    PorcentajeComision: { type: Number, require: true },
    Comision: { type: Number, require: true },
    Comision2: { type: Number, require: true },
    PorcentajeComisionCancelada: { type: Number, default: 0 },
    NumeroOrden: { type: String, default: "-" },
    EstadoComision: { type: String, default: "Por pagar" },
    EstadoComisionSupervisor: { type: String, default: "Por pagar" },
    Estado: { type: String, default: "Por cobrar" },
    ComentarioAnualcion: { type: String, default: '' },
    Zona: { type: String, require: true },
    Mes: { type: String, require: true },
    Anio: { type: String, require: true },
    CodigoZona: { type: String, require: true },
    LibroContable :{ type: Boolean, default: false },
    CodigoCliente:{ type: String, require: true },
    CodigoVendedor:{ type: String, require: true },
    Transporte: { type: String, require: true },
    Almacen: { type: String, require: true },
    Nota : { type: String, default: '' },
    MontoTransporte:  { type: Number, require: true },
    Descuento: { type: Number, default: 0 },
    TipoDescuento:{ type: String, default: "" },
    DescuentoValor: { type: Number, default: 0 },
    SubTotal: { type: Number, default: 0 },
    Productos: [{
        Codigo: { type: String, require: true },
        Producto: { type: String, require: true },
        Descripcion: { type: String, require: true },
        Cantidad: { type: String, require: true },
        Facturado: { type: Boolean, default: false },
        Cantidad2: { type: String, require: true },
        PrecioUnidad: { type: String, require: true },
        PrecioTotal: { type: String, require: true },
        PrecioTotal2: { type: String, require: true },
    }],
    HistorialPago: [{
        Pago: { type: String, require: true },
        Comentario: { type: String, require: true },
        Recibo: { type: Number, require: true },
        Modalidad: { type: String, require: true },
        FechaPago: { type: String, default: Fecha },
        user: { type: String, require: true },
        Timestamp: { type: Number, default: Date.now() },
    }],
});

module.exports = mongoose.model("Notas entrega", notaEntrega);