import { reactive, watch } from 'vue';

const KEY = 'tarjeta-digital:empleados';

const leer = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        return [];
    }
};

export const store = reactive({
    empleados: leer(),

    guardar(empleado) {
        const i = this.empleados.findIndex((e) => e.rfc === empleado.rfc);
        const registro = { ...empleado, creado: new Date().toISOString() };
        if (i >= 0) this.empleados.splice(i, 1, registro);
        else this.empleados.unshift(registro);
    },

    eliminar(rfc) {
        this.empleados = this.empleados.filter((e) => e.rfc !== rfc);
    }
});

watch(
    () => store.empleados,
    (val) => {
        try {
            localStorage.setItem(KEY, JSON.stringify(val));
        } catch {
            /* sin almacenamiento disponible */
        }
    },
    { deep: true }
);
