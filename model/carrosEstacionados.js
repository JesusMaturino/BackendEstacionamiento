const mongoose = require('mongoose');

const carroSchema = new mongoose.Schema({
    numero_placa: {
        type: String,
        required: true
    },
    tiempo_entrada: {
        type: String,
        required: false
    },
    tiempo_salida: {
        type: String,
        required: false
    },
    tiempo_estacionado: {
        type: String,
        required: false
    },
    tipo: {
        type: String,
        required: true
    },
    cantidad_a_pagar: {
        type: Number,
        required: false
    }
});

const carro = mongoose.model('carro', carroSchema);

module.exports = carro;