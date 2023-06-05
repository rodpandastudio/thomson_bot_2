require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client, LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const methodOverride = require("method-override");
const clientesDB = require('./models/clientes')
const notasEntregaDB = require('./models/notas-entrega')
const ordenesComprasDB = require('./models/ordenes-compras')
const devolucionesMontosDB = require('./models/notas-devolucion-monto')
const devolucionesProductosDB = require('./models/notas-devolucion')
const notasPagosDB = require('./models/notas-pago')
const solicitudesOrdenesDB = require('./models/solicitud-orden')
const cron = require('node-cron');
let moment = require('moment-timezone');
moment().tz("America/Caracas").format();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

//Inicializacion
const app = express();

//routes
require("./database");

app.set("port", process.env.PORT || 5000);

//Middlewears
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//routes
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//validar con base de datos real
//Crear solicitud que se le enviara a rafael para aprobar o rechazar ordenes de compra

//reporte de deudas de todos los clientes a Raffael
cron.schedule('0 0 8 * * * 1', async () => {// change to 0 0 8 * * * 1 to run every monday at 8:00 am, but validate the timezone first

    let notas = await notasEntregaDB.find({Estado: 'Por cobrar'}).sort({Timestamp: -1})
    let cantidadTotal = 0
    let netoTotal = 0
    let saldoTotal = 0
    notas = notas.map((data) =>{
        let vencimientoDate = new Date(data.Vencimiento.split("/")[2], (+data.Vencimiento.split("/")[1] - 1), data.Vencimiento.split("/")[0])
        let hoy = new Date()
        //sumar 5 dias a hoy
        hoy.setDate(hoy.getDate() + 5)
        let dias = vencimientoDate - hoy
        clase = ""
        if(dias <= 0){
            if(data.Estado == "Por cobrar"){
                clase = 'text-danger'
                netoTotal = data.Neto + netoTotal
                saldoTotal = data.Saldo + saldoTotal
            }
        }
        return{
            Cliente: data.Cliente,
            Neto: data.Neto,
            Saldo: data.Saldo,
            CantidadTotal: data.CantidadTotal,
            Clase: clase
        }
    })

    notas = notas.filter((data) => data.Clase == 'text-danger')
    
    let clientesDeuda = []

    for(i=0; i< notas.length; i++){

        let validacion = clientesDeuda.find((data) => data.Cliente == notas[i].Cliente)
        if(validacion){

            let index = clientesDeuda.findIndex((data) => data.Cliente == notas[i].Cliente)
            clientesDeuda[index].CantidadNotas = clientesDeuda[index].CantidadNotas + 1
            clientesDeuda[index].Neto = clientesDeuda[index].Neto + notas[i].Neto
            clientesDeuda[index].Saldo = clientesDeuda[index].Saldo + notas[i].Saldo

        }else{

            let subdata = {
                Cliente: notas[i].Cliente,
                CantidadNotas: 1,
                Neto: notas[i].Neto,
                Saldo: notas[i].Saldo,
            }

            clientesDeuda.push(subdata)

        }
    }

    //sort clientesDeuda by Saldo
    clientesDeuda.sort((a, b) => (a.Saldo > b.Saldo) ? -1 : 1)

    let mensaje = `*Reporte de deudas vencidas de clientes*\n\n`

    for(i=0; i< clientesDeuda.length; i++){
        mensaje = mensaje + `*${clientesDeuda[i].Cliente.trim()}*\nCantidad de notas: ${clientesDeuda[i].CantidadNotas}\nNeto: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+clientesDeuda[i].Neto.toFixed(2))}\nSaldo: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+clientesDeuda[i].Saldo.toFixed(2))}\n\n`
    }

    let numero = `584242449255@c.us`


    client.sendMessage(numero, mensaje)


});

//Reporte de deudas de todos los clientes a cada cliente
cron.schedule('0 0 9 * * * 1', async () => {// change to 0 0 8 * * * 1 to run every monday at 9:00 am, but validate the timezone first
    
    try {
        let notas = await notasEntregaDB.find({Estado: 'Por cobrar'}).sort({Timestamp: -1})
        let cantidadTotal = 0
        let netoTotal = 0
        let saldoTotal = 0
        notas = notas.map((data) =>{
            let vencimientoDate = new Date(data.Vencimiento.split("/")[2], (+data.Vencimiento.split("/")[1] - 1), data.Vencimiento.split("/")[0])
            let hoy = new Date()
            //sumar 5 dias a hoy
            hoy.setDate(hoy.getDate() + 5)
            let dias = vencimientoDate - hoy
            clase = ""
            if(dias <= 0){
                if(data.Estado == "Por cobrar"){
                    clase = 'text-danger'
                    netoTotal = data.Neto + netoTotal
                    saldoTotal = data.Saldo + saldoTotal
                }
            }
            return{
                Cliente: data.Cliente,
                Neto: data.Neto,
                Saldo: data.Saldo,
                CantidadTotal: data.CantidadTotal,
                Clase: clase
            }
        })
    
        notas = notas.filter((data) => data.Clase == 'text-danger')
        
        let clientesDeuda = []
    
        for(i=0; i< notas.length; i++){
    
            let validacion = clientesDeuda.find((data) => data.Cliente == notas[i].Cliente)
    
            if(validacion){
    
                let index = clientesDeuda.findIndex((data) => data.Cliente == notas[i].Cliente)
                clientesDeuda[index].CantidadNotas = clientesDeuda[index].CantidadNotas + 1
                clientesDeuda[index].Neto = clientesDeuda[index].Neto + notas[i].Neto
                clientesDeuda[index].Saldo = clientesDeuda[index].Saldo + notas[i].Saldo
    
            }else{
    
                let clienteBase = await clientesDB.findOne({Empresa: notas[i].Cliente})

    
                let subdata = {
                    Cliente: notas[i].Cliente,
                    CantidadNotas: 1,
                    Neto: notas[i].Neto,
                    Saldo: notas[i].Saldo,
                    NumeroTelefonico: clienteBase ? +clienteBase.Contacto1 : null 
                }
    
                clientesDeuda.push(subdata)
    
            }
        }
    
        //sort clientesDeuda by Saldo
        clientesDeuda.sort((a, b) => (a.Saldo > b.Saldo) ? -1 : 1)
    
        
        for(i=0; i< clientesDeuda.length; i++){
            let mensaje = `*Reporte de deuda*\n\n`
            mensaje = mensaje + `\nCantidad de notas: ${clientesDeuda[i].CantidadNotas}\nNeto: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+clientesDeuda[i].Neto.toFixed(2))}\nSaldo: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+clientesDeuda[i].Saldo.toFixed(2))}\n\n`
            let numeroEnviar = `58${clientesDeuda[i].NumeroTelefonico}@c.us`
            client.sendMessage(numeroEnviar, mensaje)
        }

    }catch(err){
        console.log(err)
    }



});


//reporte de cierre diario
cron.schedule('0 0 17 * * * *', async () => {// change to 0 0 17 * * * 1 to run every monday at 5:00 pm, but validate the timezone first

    try {
        let montoVendido = 0
        let montoCobrado = 0
        let egresoDevolucion = 0
        let egresoAnulacion = 0
        let egresoGeneral = 0
        let cuentasCobrar = 0
    
        let fecha = moment().tz("America/Caracas").format('DD/MM/YYYY')
        
        let notasEntregas = await notasEntregaDB.find({Fecha: fecha}).sort({Timestamp: -1})
        let notasAnuladas = await notasEntregaDB.find({FechaAnulacion: fecha}).sort({Timestamp: -1})    
        let devolucionesMonto = await devolucionesMontosDB.find({Fecha: fecha}).sort({Timestamp: -1})
        let devolucionesProductos = await devolucionesProductosDB.find({Fecha: fecha}).sort({Timestamp: -1})
        let notasPendientesCobros = await notasEntregaDB.find({Estado: 'Por cobrar'}).sort({Timestamp: -1})
        let notasPagos = await notasPagosDB.find({Fecha: fecha}).sort({Timestamp: -1})
    
        for(i=0; i< notasPendientesCobros.length; i++){
            cuentasCobrar = cuentasCobrar + notasPendientesCobros[i].Saldo
        }
    
        for(i=0; i< notasEntregas.length; i++){
            montoVendido = montoVendido + notasEntregas[i].Neto
        }
        for(i=0; i< notasPagos.length; i++){
            montoCobrado = montoCobrado + notasPagos[i].PagadoTotal
        }
        for(i=0; i< devolucionesMonto.length; i++){
            egresoDevolucion = egresoDevolucion + devolucionesMonto[i].Productos[0].Precio
        }
        for(i=0; i< devolucionesProductos.length; i++){
            egresoDevolucion = egresoDevolucion + devolucionesProductos[i].ValorTotal
        }
        for(i=0; i< notasAnuladas.length; i++){
            egresoAnulacion = egresoAnulacion + notasAnuladas[i].Neto
        }
    
    
        montoVendido = montoVendido.toFixed(2)
        cuentasCobrar = cuentasCobrar.toFixed(2)
        montoCobrado = montoCobrado.toFixed(2)
        egresoDevolucion = egresoDevolucion.toFixed(2)
        egresoAnulacion = egresoAnulacion.toFixed(2)
        egresoGeneral = (+egresoDevolucion + +egresoAnulacion).toFixed(2)
    
        let mensaje = `*Reporte de cierre diario*\n\n`
        mensaje = mensaje + `Monto vendido: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+montoVendido)}\nMonto cobrado: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+montoCobrado)}\nEgreso por devoluciones: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+egresoDevolucion)}\nEgreso por anulaciones: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+egresoAnulacion)}\nEgreso general: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+egresoGeneral)}\nCuentas por cobrar: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+cuentasCobrar)} \n\n`
    
        let numero = `584242449255@c.us`
    
        client.sendMessage(numero, mensaje)

    }catch(err){
        console.log(err)
    }
    


})
/*
//Envio de solicitudes de aprobacion de ordenes de compra
cron.schedule('* * * * *', async () => {

    try {


        let solicitudesOrdenes = await solicitudesOrdenesDB.find({EstadoEnvio: 'Pendiente'}).sort({Timestamp: -1})
    
        let mensaje = `*Solicitudes de ordenes de compra para revisión*\n\n`
    
    
        for(i=0; i< solicitudesOrdenes.length; i++){
    
            let ordenBase = await ordenesComprasDB.findOne({Numero: solicitudesOrdenes[i].NumeroOrden})
    
            mensaje = mensaje + `*Cliente: ${ordenBase.Cliente}*\n Numero: ${ordenBase.Numero}\n Monto: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(+ordenBase.PrecioTotal)}:\n Link: http://localhost:6500/aprobar-rechazar-orden/${ordenBase.Numero} \n\n`
       
            await solicitudesOrdenesDB.findByIdAndUpdate(solicitudesOrdenes[i]._id, {EstadoEnvio: 'Enviado'})
        }
        
        if(solicitudesOrdenes.length > 0){
    
            let numero = `584242449255@c.us`
            client.sendMessage(numero, mensaje)
        }
    }catch(err){
        console.log(err)
    }

    
})

// change to 0 0 18 * * * 1 to run every monday at 6:00 pm, but validate the timezone first


//Validar timezone para pooder realizar el cron

*/

cron.schedule('0 7 * * * * *', async () => {

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let fechaCompleta = new Date().toLocaleString("en-US", {timeZone: timezone})

    
    let numero = `584242449255@c.us`
    let mensaje = `${timezone}\n${fechaCompleta}}`


    client.sendMessage(numero, mensaje)


})

// Enviar QR al cliente
client.on('qr', (qr) => {
   qrcode.generate(qr, { small: true });
})

// Indicador de inició de sesión
client.on('ready', () => {
   console.log('Client is ready!');
});

//cierre

client.initialize();

// cierre del whatsap bot

app.listen(app.get("port"), () => {
    console.log("Escuchando en " + app.get("port"));
});