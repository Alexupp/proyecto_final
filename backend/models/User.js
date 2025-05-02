const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tipo: { type: String, enum: ['estudiante', 'docente', 'coordinador'], default: 'estudiante' }
});

module.exports = mongoose.model('User', userSchema);
