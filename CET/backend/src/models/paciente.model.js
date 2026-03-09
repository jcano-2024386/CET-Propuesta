import { Schema, model } from 'mongoose';

const pacienteSchema = new Schema({
    codigoAcademico: {
        type: String,
        required: [true, 'El código académico es obligatorio'],
        unique: true,
        trim: true,
        uppercase: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [5, 'Edad mínima 5 años'],
        max: [30, 'Edad máxima 30 años']
    },
    grado: {
        type: String,
        required: [true, 'El grado es obligatorio'],
        trim: true
    },
    seccion: {
        type: String,
        trim: true,
        uppercase: true
    },
    genero: {
        type: String,
        enum: ['M', 'F'],
        required: [true, 'El género es obligatorio']
    },
    telefono: {
        type: String,
        trim: true
    },
    telefonoEmergencia: {
        type: String,
        trim: true
    },
    alergias: {
        type: String,
        trim: true,
        default: 'Ninguna'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Índice para búsqueda rápida
pacienteSchema.index({ codigoAcademico: 1 });
pacienteSchema.index({ nombre: 'text', apellido: 'text' });

export default model('Paciente', pacienteSchema);
