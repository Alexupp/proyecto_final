const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación
const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(express.json()); // Parsear JSON en el cuerpo de las solicitudes

// Usar las rutas de usuarios
app.use('/api/users', userRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => {
        console.error('❌ Error de conexión:', err);
        process.exit(1); // Termina el proceso si hay un error de conexión
    });

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});


//IMPORTANTE NO VA NADA DE DELETE NI NADA DE ESO JODER, DURE TRABADO 2 HORAS POR ESO

