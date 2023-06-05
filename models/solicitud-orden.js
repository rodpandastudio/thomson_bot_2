const mongoose = require("mongoose");

const { Schema } = mongoose;


const solicitudOrden = new Schema({
   Usuario : {type: String, require: true},
   NumeroOrden : {type: String, require: true},
   EstadoEnvio : {type: String, require: true},
});

module.exports = mongoose.model("solicitudOrden",solicitudOrden);
