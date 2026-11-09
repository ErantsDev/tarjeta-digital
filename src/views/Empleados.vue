<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { store } from '@/store/empleados';

const router = useRouter();
const confirm = useConfirm();
const filtro = ref('');

const fecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-MX') : '—');

const borrar = (e) =>
    confirm.require({
        header: 'Eliminar empleado',
        message: `¿Eliminar a ${e.nombre} ${e.paterno}?`,
        icon: 'pi pi-exclamation-triangle',
        acceptProps: { label: 'Eliminar', severity: 'danger' },
        rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
        accept: () => store.eliminar(e.rfc)
    });
</script>

<template>
    <div class="page-head">
        <h1>Empleados</h1>
        <p>Personas con tarjeta digital guardada en este navegador.</p>
    </div>

    <div class="panel">
        <DataTable
            :value="store.empleados"
            :globalFilterFields="['nombre', 'paterno', 'materno', 'rfc', 'puesto', 'departamento']"
            :filters="{ global: { value: filtro, matchMode: 'contains' } }"
            paginator
            :rows="8"
            dataKey="rfc"
            stripedRows
        >
            <template #header>
                <div class="cabecera">
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filtro" placeholder="Buscar por nombre, RFC o puesto" />
                    </IconField>
                    <router-link to="/tarjeta"><Button label="Nueva tarjeta" icon="pi pi-plus" /></router-link>
                </div>
            </template>
            <template #empty>No hay empleados registrados.</template>

            <Column header="Nombre">
                <template #body="{ data }">{{ data.nombre }} {{ data.paterno }} {{ data.materno }}</template>
            </Column>
            <Column field="rfc" header="RFC">
                <template #body="{ data }"><span class="mono">{{ data.rfc }}</span></template>
            </Column>
            <Column field="puesto" header="Puesto">
                <template #body="{ data }"><Tag :value="data.puesto" severity="secondary" /></template>
            </Column>
            <Column field="departamento" header="Departamento" />
            <Column header="Nacimiento">
                <template #body="{ data }">{{ fecha(data.fecha) }}</template>
            </Column>
            <Column header="" style="width: 7rem">
                <template #body="{ data }">
                    <Button icon="pi pi-id-card" text rounded v-tooltip.top="'Ver tarjeta'" @click="router.push({ path: '/tarjeta', query: { rfc: data.rfc } })" />
                    <Button icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Eliminar'" @click="borrar(data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.cabecera {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}
</style>
