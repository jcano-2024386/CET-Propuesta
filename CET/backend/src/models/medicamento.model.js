import { Schema, model } from 'mongoose';

const medicamentoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del medicamento es obligatorio'],
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
        enum: ['ANALGESICO', 'ANTIBIOTICO', 'ANTIINFLAMATORIO', 'ANTIHISTAMINICO', 'ANTIACIDO', 'VITAMINAS', 'OTRO'],
        default: 'OTRO'
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [0, 'La cantidad no puede ser negativa'],
        default: 0
    },
    cantidadMinima: {
        type: Number,
        default: 5,
        min: [1, 'La cantidad mínima debe ser al menos 1']
    },
    unidad: {
        type: String,
        enum: ['PASTILLAS', 'ML', 'SOBRES', 'CAPSULAS', 'AMPOLLAS', 'OTRO'],
        default: 'PASTILLAS'
    },
    fechaVencimiento: {
        type: Date,
        required: [true, 'La fecha de vencimiento es obligatoria']
    },
    proveedor: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Virtual para saber si está por agotarse o agotado
medicamentoSchema.virtual('estado').get(function () {
    if (this.cantidad === 0) return 'AGOTADO';
    if (this.cantidad <= this.cantidadMinima) return 'BAJO_STOCK';
    const hoy = new Date();
    const diasParaVencer = Math.ceil((this.fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    if (diasParaVencer <= 30) return 'POR_VENCER';
    return 'DISPONIBLE';
});

medicamentoSchema.set('toJSON', { virtuals: true });
medicamentoSchema.set('toObject', { virtuals: true });

export default model('Medicamento', medicamentoSchema);
