const express = require('express');

const router = express.Router();

const modeloEstacionamiento = require('../model/carrosEstacionados');

router.post('/', async (req, res) => {

    try {

        const { numero_placa, tiempo_entrada, tiempo_salida, tipo } = req.body;
        console.log(new Date);
        const informacionUsuario = {
            numero_placa,
            tiempo_entrada,
            tiempo_salida,
            tiempo_estacionado: "",
            tipo,
            cantidad_a_pagar: 0
        }

        let nuevoCarro = new modeloEstacionamiento(informacionUsuario);

        if (await nuevoCarro.save()) {
            res.status(200).json({ msg: 'Se guardo correctamente' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un problema con el servidor' });
    }

});

router.put('/', async (req, res) => {

    try {

        const { numero_placa, tiempo_salida } = req.body;


        const carro = await modeloEstacionamiento.findOne({ numero_placa });

        const { tiempo_entrada } = carro;
        let hours = Date.parse(tiempo_entrada) - Date.parse(tiempo_salida);

        let minutosDiferencia = Math.round(((hours % 86400000) % 3600000) / 60000) * -1;
        let horasDiferencia = (Math.floor((hours % 86400000) / 3600000)) * -1;
        let tiempoEstacionado = 0;

        if (horasDiferencia !== 1) {
            horasDiferencia *= 60;
            tiempoEstacionado = minutosDiferencia + horasDiferencia;
        } else {
            tiempoEstacionado = minutosDiferencia;
        }

        carro.tiempo_salida = tiempo_salida;
        carro.tiempo_estacionado = tiempoEstacionado;

        let cantidad_a_pagar = 0;

        if (carro.tipo === 'residente') {

            cantidad_a_pagar = tiempoEstacionado;

        } else if (carro.tipo === 'noResidente') {

            cantidad_a_pagar = tiempoEstacionado * 3;

        }

        carro.cantidad_a_pagar = cantidad_a_pagar;

        if (await carro.save()) {
            res.status(200).json({ msg: 'Se actualizo correctamente', });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un problema con el servidor' });
    }

});

router.get('/:tiempo_entrada', async (req, res) => {

    try {

        const { tiempo_entrada } = req.params;

        /* const traerCarrosEstacionadosPorHora = await modeloEstacionamiento.find({ tiempo_entrada });*/

        const traerCarrosEstacionadosPorHora = await modeloEstacionamiento.find({ 'tiempo_entrada': new RegExp(tiempo_entrada) });
        console.log(traerCarrosEstacionadosPorHora);
        let numero_placas = [],
            tiempo_estacionados = [],
            tipos = [],
            cantidades_a_pagar = [];

        traerCarrosEstacionadosPorHora.forEach(({ numero_placa, tiempo_estacionado, tipo, cantidad_a_pagar }) => {
            numero_placas.push(numero_placa);
            
            if (tiempo_estacionado === '') {
                tiempo_estacionados.push('Aun no se ha registrado su fecha de salida');
            } else {
                tiempo_estacionados.push(tiempo_estacionado + ' minutos');
            }

            tipos.push(tipo);
            cantidades_a_pagar.push(cantidad_a_pagar);
        });

        res.json({ numero_placas, tiempo_estacionados, tipos, cantidades_a_pagar });

    } catch (error) {
        res.status(500).json({ msg: 'Ocurrio un problema con el servidor' });
    }

});



module.exports = router;