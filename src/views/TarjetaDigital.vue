<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Message from 'primevue/message';
import { toPng } from 'html-to-image';
import EmployeeCard from '@/components/EmployeeCard.vue';
import { calcularRFC } from '@/utils/rfc';
import { store } from '@/store/empleados';

const toast = useToast();
const router = useRouter();

const puestos = ['Empleado', 'Docente', 'Administrativo', 'Coordinador', 'Director', 'Investigador'];
const hoy = new Date();

const vacio = () => ({ nombre: '', paterno: '', materno: '', fecha: null, puesto: 'Empleado', departamento: '', foto: '' });
const form = reactive(vacio());
const rfc = ref('');
const enviado = ref(false);
const card = ref(null);
const archivo = ref(null);

const errores = computed(() => ({
    nombre: !form.nombre.trim(),
    paterno: !form.paterno.trim(),
    fecha: !form.fecha
}));
const hayErrores = computed(() => Object.values(errores.value).some(Boolean));

const generar = () => {
    enviado.value = true;
    if (hayErrores.value) {
        toast.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Completa nombre, apellido paterno y fecha de nacimiento.', life: 3000 });
        return;
    }
    rfc.value = calcularRFC(form);
    toast.add({ severity: 'success', summary: 'RFC generado', detail: rfc.value, life: 2500 });
};

const limpiar = () => {
    Object.assign(form, vacio());
    rfc.value = '';
    enviado.value = false;
    if (archivo.value) archivo.value.value = '';
};

const cargarFoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
        toast.add({ severity: 'error', summary: 'Imagen muy pesada', detail: 'Máximo 2 MB.', life: 3000 });
        return;
    }
    const lector = new FileReader();
    lector.onload = () => (form.foto = lector.result);
    lector.readAsDataURL(f);
};

const copiar = async () => {
    try {
        await navigator.clipboard.writeText(rfc.value);
        toast.add({ severity: 'info', summary: 'Copiado', detail: 'RFC copiado al portapapeles', life: 1800 });
    } catch {
        /* sin permiso de portapapeles */
    }
};

const guardar = () => {
    if (!rfc.value) return;
    store.guardar({ ...form, fecha: form.fecha?.toISOString(), rfc: rfc.value });
    toast.add({ severity: 'success', summary: 'Empleado guardado', detail: `${form.nombre} ${form.paterno}`, life: 2500 });
};

const descargar = async () => {
    try {
        const png = await toPng(card.value.el, { pixelRatio: 3, cacheBust: true });
        const a = document.createElement('a');
        a.href = png;
        a.download = `tarjeta-${rfc.value || 'empleado'}.png`;
        a.click();
    } catch {
        toast.add({ severity: 'error', summary: 'No se pudo exportar', detail: 'Intenta de nuevo.', life: 3000 });
    }
};

// Permite abrir una tarjeta guardada desde Empleados (?rfc=...)
const q = router.currentRoute.value.query.rfc;
const previo = q && store.empleados.find((e) => e.rfc === q);
if (previo) {
    Object.assign(form, { ...previo, fecha: previo.fecha ? new Date(previo.fecha) : null });
    rfc.value = previo.rfc;
}
</script>

<template>
    <div class="page-head">
        <h1>Tarjeta digital</h1>
        <p>Captura los datos de la persona, genera su RFC y obtén su credencial de empleado.</p>
    </div>

    <div class="grid">
        <section class="panel">
            <h2 class="panel-title"><span class="step">1</span> Datos de la persona</h2>

            <div class="campos">
                <div class="campo span-2">
                    <label for="nombre">Nombre(s)</label>
                    <InputText id="nombre" v-model="form.nombre" placeholder="Ej. Susana" :invalid="enviado && errores.nombre" fluid />
                    <small v-if="enviado && errores.nombre" class="err">El nombre es obligatorio.</small>
                </div>

                <div class="campo">
                    <label for="paterno">Apellido paterno</label>
                    <InputText id="paterno" v-model="form.paterno" placeholder="Ej. Rojas" :invalid="enviado && errores.paterno" fluid />
                    <small v-if="enviado && errores.paterno" class="err">Obligatorio.</small>
                </div>

                <div class="campo">
                    <label for="materno">Apellido materno</label>
                    <InputText id="materno" v-model="form.materno" placeholder="Ej. Mérida" fluid />
                </div>

                <div class="campo">
                    <label for="fecha">Fecha de nacimiento</label>
                    <DatePicker
                        inputId="fecha"
                        v-model="form.fecha"
                        dateFormat="dd/mm/yy"
                        :maxDate="hoy"
                        showIcon
                        iconDisplay="input"
                        placeholder="dd/mm/aaaa"
                        :invalid="enviado && errores.fecha"
                        fluid
                    />
                    <small v-if="enviado && errores.fecha" class="err">Selecciona una fecha.</small>
                </div>

                <div class="campo">
                    <label for="puesto">Puesto</label>
                    <Select inputId="puesto" v-model="form.puesto" :options="puestos" fluid />
                </div>

                <div class="campo span-2">
                    <label for="depto">Departamento</label>
                    <InputText id="depto" v-model="form.departamento" placeholder="Ej. Recursos Humanos" fluid />
                </div>

                <div class="campo span-2">
                    <label>Fotografía (opcional)</label>
                    <label class="subir">
                        <input ref="archivo" type="file" accept="image/*" @change="cargarFoto" />
                        <i class="pi pi-image"></i>
                        <span>{{ form.foto ? 'Cambiar fotografía' : 'Seleccionar imagen (máx. 2 MB)' }}</span>
                    </label>
                </div>
            </div>

            <div class="botones">
                <Button label="Generar RFC" icon="pi pi-bolt" @click="generar" />
                <Button label="Limpiar" icon="pi pi-eraser" severity="secondary" outlined @click="limpiar" />
            </div>

            <div class="resultado">
                <h2 class="panel-title"><span class="step">2</span> RFC calculado</h2>
                <InputGroup>
                    <InputGroupAddon><i class="pi pi-hashtag"></i></InputGroupAddon>
                    <InputText :modelValue="rfc" readonly placeholder="Presiona “Generar RFC”" class="mono rfc-input" />
                    <Button icon="pi pi-copy" severity="secondary" :disabled="!rfc" @click="copiar" v-tooltip.top="'Copiar'" aria-label="Copiar RFC" />
                </InputGroup>
                <Message v-if="rfc" severity="secondary" size="small" variant="simple" class="nota">
                    13 caracteres: iniciales + fecha AAMMDD + homoclave + dígito verificador (algoritmo SAT).
                </Message>
            </div>
        </section>

        <section class="panel preview">
            <h2 class="panel-title"><span class="step">3</span> Vista previa</h2>
            <div class="escenario">
                <EmployeeCard ref="card" v-bind="form" :rfc="rfc" />
            </div>
            <div class="botones centro">
                <Button label="Guardar" icon="pi pi-save" :disabled="!rfc" @click="guardar" />
                <Button label="Descargar PNG" icon="pi pi-download" severity="contrast" outlined :disabled="!rfc" @click="descargar" />
            </div>
        </section>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 1.5rem;
    align-items: start;
}

.campos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 1.1rem;
}

.campo {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.campo label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--muted);
}

.span-2 {
    grid-column: span 2;
}

.err {
    color: #e5484d;
    font-size: 0.75rem;
}

.subir {
    display: flex !important;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    border: 1.5px dashed var(--border);
    border-radius: 10px;
    cursor: pointer;
    color: var(--muted) !important;
    transition: border-color 0.15s;
}

.subir:hover {
    border-color: var(--gold);
}

.subir input {
    display: none;
}

.botones {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
}

.botones.centro {
    justify-content: center;
}

.resultado {
    margin-top: 1.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
}

.rfc-input {
    font-size: 1.05rem;
    letter-spacing: 0.08em;
    font-weight: 600;
}

.nota {
    margin-top: 0.6rem;
}

.preview {
    position: sticky;
    top: 88px;
}

.escenario {
    display: grid;
    place-items: center;
    padding: 1.5rem 0.75rem;
    border-radius: 14px;
    background:
        radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--muted) 25%, transparent) 1px, transparent 0) 0 0 / 18px 18px,
        color-mix(in srgb, var(--bg) 70%, var(--surface));
}

@media (max-width: 1100px) {
    .grid {
        grid-template-columns: 1fr;
    }
    .preview {
        position: static;
    }
}

@media (max-width: 560px) {
    .campos {
        grid-template-columns: 1fr;
    }
    .span-2 {
        grid-column: auto;
    }
    .escenario {
        transform-origin: top center;
    }
}
</style>
