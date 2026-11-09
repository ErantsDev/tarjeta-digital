<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import JsBarcode from 'jsbarcode';

const props = defineProps({
    nombre: { type: String, default: '' },
    paterno: { type: String, default: '' },
    materno: { type: String, default: '' },
    puesto: { type: String, default: '' },
    departamento: { type: String, default: '' },
    fecha: { type: [Date, String], default: null },
    rfc: { type: String, default: '' },
    foto: { type: String, default: '' }
});

const barcode = ref(null);
const tarjeta = ref(null);
defineExpose({ el: tarjeta });

const iniciales = computed(() => ((props.nombre[0] || '') + (props.paterno[0] || '')).toUpperCase() || '?');
const fechaTxt = computed(() => {
    if (!props.fecha) return '—';
    const d = new Date(props.fecha);
    return isNaN(d) ? '—' : d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
});

const dibujar = async () => {
    await nextTick();
    if (!barcode.value) return;
    JsBarcode(barcode.value, props.rfc || 'SIN RFC', {
        format: 'CODE128',
        displayValue: false,
        height: 46,
        width: 1.6,
        margin: 0,
        background: 'transparent',
        lineColor: '#0e1430'
    });
};

onMounted(dibujar);
watch(() => props.rfc, dibujar);
</script>

<template>
    <div ref="tarjeta" class="tarjeta">
        <div class="franja"></div>
        <div class="anillos"></div>

        <header>
            <div class="sello"><i class="pi pi-building-columns"></i></div>
            <div>
                <strong>UNACH</strong>
                <span>Facultad de Negocios</span>
            </div>
            <span class="chip-nfc"><i class="pi pi-wifi"></i></span>
        </header>

        <div class="identidad">
            <div class="foto">
                <img v-if="foto" :src="foto" alt="Fotografía del empleado" />
                <span v-else>{{ iniciales }}</span>
            </div>
            <span class="puesto">{{ puesto || 'Empleado' }}</span>
        </div>

        <div class="nombre">
            <h2>{{ nombre || 'Nombre' }}</h2>
            <h3>{{ [paterno, materno].filter(Boolean).join(' ') || 'Apellidos' }}</h3>
        </div>

        <dl class="datos">
            <div>
                <dt>Departamento</dt>
                <dd>{{ departamento || '—' }}</dd>
            </div>
            <div>
                <dt>Nacimiento</dt>
                <dd>{{ fechaTxt }}</dd>
            </div>
        </dl>

        <footer>
            <div class="rfc">
                <span>RFC</span>
                <strong class="mono">{{ rfc || '—————————————' }}</strong>
            </div>
            <svg ref="barcode" class="codigo"></svg>
        </footer>
    </div>
</template>

<style scoped>
.tarjeta {
    position: relative;
    width: 100%;
    max-width: 330px;
    height: 520px;
    border-radius: 22px;
    overflow: hidden;
    color: #fff;
    background: linear-gradient(160deg, #1d2760 0%, #0e1430 55%, #0a0e24 100%);
    box-shadow:
        0 30px 60px -20px rgba(14, 20, 48, 0.55),
        0 0 0 1px rgba(255, 255, 255, 0.06) inset;
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.franja {
    position: absolute;
    inset: 0;
    background: linear-gradient(200deg, #f3c74f, #d9a520);
    clip-path: polygon(58% 0, 100% 0, 100% 34%);
}

.anillos {
    position: absolute;
    left: -80px;
    top: 150px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow:
        0 0 0 24px rgba(255, 255, 255, 0.02),
        0 0 0 48px rgba(255, 255, 255, 0.015);
}

header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.3rem 1.4rem 0;
}

header strong {
    display: block;
    font-size: 1rem;
    letter-spacing: 0.08em;
}

header span {
    font-size: 0.7rem;
    color: #b9c0e3;
}

.sello {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.chip-nfc {
    margin-left: auto;
    transform: rotate(90deg);
    color: #0e1430 !important;
    font-size: 1.1rem !important;
}

.identidad {
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 0.8rem;
    padding: 1.6rem 1.4rem 0;
}

.foto {
    width: 112px;
    height: 132px;
    border-radius: 18px;
    overflow: hidden;
    background: linear-gradient(135deg, #2a3680, #151c48);
    border: 3px solid #fff;
    display: grid;
    place-items: center;
    font-size: 2.4rem;
    font-weight: 800;
    color: #f3c74f;
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.5);
}

.foto img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.puesto {
    margin-bottom: 0.3rem;
    background: #f3c74f;
    color: #0e1430;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
}

.nombre {
    position: relative;
    padding: 1.1rem 1.4rem 0;
}

.nombre h2 {
    margin: 0;
    font-size: 1.55rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    text-transform: uppercase;
    word-break: break-word;
}

.nombre h3 {
    margin: 0.2rem 0 0;
    font-size: 1rem;
    font-weight: 500;
    color: #c3c9ea;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.datos {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    margin: 1rem 1.4rem 0;
}

.datos dt {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8e96c4;
}

.datos dd {
    margin: 0.15rem 0 0;
    font-size: 0.82rem;
    font-weight: 600;
}

footer {
    position: relative;
    margin-top: auto;
    background: #fff;
    color: #0e1430;
    padding: 0.85rem 1.4rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.rfc {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.rfc span {
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #d9a520;
}

.rfc strong {
    font-size: 0.95rem;
    letter-spacing: 0.06em;
}

.codigo {
    width: 100%;
    height: 46px;
}
</style>
