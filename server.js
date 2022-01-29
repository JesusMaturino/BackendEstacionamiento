const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const estacionamiento = require('./routes/estacionamiento');

const port = process.env.PORT || 8000;

const app = express();

//Middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

//Conexion a base de datos (MongoDB)
const uri = 'mongodb+srv://admin:admin123@estacionamiento.miezn.mongodb.net/DataBaseEstacionamiento?retryWrites=true&w=majority';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Rutas
app.use('/estacionamiento', estacionamiento);


//Correr servidor
app.listen(port, () => {
    console.log('Server is running... ', port);
});