import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6
    },
    rol: {
        type: String,
        enum: ['ADMIN', 'ENCARGADO'],
        default: 'ENCARGADO'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

usuarioSchema.methods.toJSON = function () {
    const { password, __v, ...user } = this.toObject();
    return user;
};

export default model('Usuario', usuarioSchema);
