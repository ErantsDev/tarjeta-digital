import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

// Hash history: funciona en Netlify/Vercel/GitHub Pages sin reglas de redirección
export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                { path: '', name: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { titulo: 'Dashboard' } },
                { path: 'tarjeta', name: 'tarjeta', component: () => import('@/views/TarjetaDigital.vue'), meta: { titulo: 'Tarjeta digital' } },
                { path: 'empleados', name: 'empleados', component: () => import('@/views/Empleados.vue'), meta: { titulo: 'Empleados' } }
            ]
        },
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});
