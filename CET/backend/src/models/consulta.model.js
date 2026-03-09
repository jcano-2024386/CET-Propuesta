import { Schema, model } from 'mongoose';

const medicamentoSuministradoSchema = new Schema({
    medicamento: {
        type: Schema.Types.ObjectId,
        ref: 'Medicamento',
        required: true
    },
    nombreMedicamento: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: [1, 'La cantidad debe ser al menos 1']
    },
    dosis: {
        type: String,
        trim: true
    }
}, { _id: false });

const consultaSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El paciente es obligatorio']
    },
    encargado: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El encargado es obligatorio']
    },
    fechaConsulta: {
        type: Date,
        default: Date.now
    },
    sintomas: {
        type: String,
        required: [true, 'Los síntomas son obligatorios'],
        trim: true
    },
    diagnostico: {
        type: String,
        trim: true
    },
    tratamiento: {
        type: String,
        trim: true
    },
    medicamentosSuministrados: [medicamentoSuministradoSchema],
    observaciones: {
        type: String,
        trim: true
    },
    seguimientoRequerido: {
        type: Boolean,
        default: false
    },
    estado: {
        type: String,
        enum: ['ACTIVA', 'CERRADA', 'SEGUIMIENTO'],
        default: 'ACTIVA'
    }
}, { timestamps: true });

consultaSchema.index({ paciente: 1, fechaConsulta: -1 });
consultaSchema.index({ fechaConsulta: -1 });

export default model('Consulta', consultaSchema);
