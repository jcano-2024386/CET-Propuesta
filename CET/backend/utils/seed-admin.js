'use strict';

import Usuario from '../src/models/usuario.model.js';

export const createDefaultAdmin = async () => {
    try {
        const adminExiste = await Usuario.findOne({ email: 'admin@cet.kinal.edu.gt' });
        if (!adminExiste) {
            await Usuario.create({
                nombre: 'Administrador CET',
                email: 'admin@cet.kinal.edu.gt',
                password: 'Admin2025!',
                rol: 'ADMIN'
            });
            console.log('✅ Admin por defecto creado');
            console.log('   Email: admin@cet.kinal.edu.gt');
            console.log('   Password: Admin2025!');
        }
    } catch (error) {
        console.error('Error creando admin:', error.message);
    }
};
