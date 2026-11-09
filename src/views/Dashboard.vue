<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { store } from '@/store/empleados';

const total = computed(() => store.empleados.length);
const ultimo = computed(() => store.empleados[0]);

const porPuesto = computed(() => {
    const conteo = {};
    store.empleados.forEach((e) => (conteo[e.puesto] = (conteo[e.puesto] || 0) + 1));
    return Object.entries(conteo)
        .map(([puesto, n]) => ({ puesto, n, pct: Math.round((n / total.value) * 100) }))
        .sort((a, b) => b.n - a.n);
});

const edadPromedio = computed(() => {
    const edades = store.empleados.filter((e) => e.fecha).map((e) => (Date.now() - new Date(e.fecha)) / 31557600000);
    return edades.length ? Math.round(edades.reduce((a, b) => a + b, 0) / edades.length) : '—';
});

const stats = computed(() => [
    { label: 'Empleados registrados', valor: total.value, icon: 'pi pi-users' },
    { label: 'Tarjetas emitidas', valor: total.value, icon: 'pi pi-id-card' },
    { label: 'Puestos distintos', valor: porPuesto.value.length, icon: 'pi pi-sitemap' },
    { label: 'Edad promedio', valor: edadPromedio.value, icon: 'pi pi-calendar' }
]);

const fecha = (iso) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
</script>

<template>
    <section class="hero">
        <div>
            <span class="eyebrow">Desarrollo de Aplicaciones Web y Móviles</span>
            <h1>Credenciales digitales para el personal</h1>
            <p>Genera el RFC de cada persona con el algoritmo del SAT y emite su tarjeta de empleado lista para descargar.</p>
            <router-link to="/tarjeta">
                <Button label="Crear tarjeta" icon="pi pi-plus" class="cta" />
            </router-link>
        </div>
        <div class="hero-art" aria-hidden="true">
            <div class="mini m1"></div>
            <div class="mini m2"></div>
            <div class="mini m3"><i class="pi pi-id-card"></i></div>
        </div>
    </section>

    <section class="stats">
        <div v-for="s in stats" :key="s.label" class="panel stat">
            <i :class="s.icon"></i>
            <div>
                <strong>{{ s.valor }}</strong>
                <span>{{ s.label }}</span>
            </div>
        </div>
    </section>

    <section class="fila">
        <div class="panel">
            <h2 class="panel-title">Registros recientes</h2>
            <div v-if="!total" class="vacio">
                <i class="pi pi-inbox"></i>
                <p>Aún no hay empleados. Crea la primera tarjeta para verla aquí.</p>
            </div>
            <ul v-else class="recientes">
                <li v-for="e in store.empleados.slice(0, 5)" :key="e.rfc">
                    <div class="ini">{{ (e.nombre[0] + e.paterno[0]).toUpperCase() }}</div>
                    <div class="info">
                        <strong>{{ e.nombre }} {{ e.paterno }} {{ e.materno }}</strong>
                        <span class="mono">{{ e.rfc }}</span>
                    </div>
                    <Tag :value="e.puesto" severity="secondary" />
                    <small>{{ fecha(e.creado) }}</small>
                </li>
            </ul>
        </div>

        <div class="panel">
            <h2 class="panel-title">Distribución por puesto</h2>
            <div v-if="!total" class="vacio"><p>Sin datos todavía.</p></div>
            <div v-for="p in porPuesto" :key="p.puesto" class="barra">
                <div class="barra-head">
                    <span>{{ p.puesto }}</span>
                    <strong>{{ p.n }}</strong>
                </div>
                <div class="barra-track"><div class="barra-fill" :style="{ width: p.pct + '%' }"></div></div>
            </div>

            <div v-if="ultimo" class="ultimo">
                <span>Último RFC emitido</span>
                <strong class="mono">{{ ultimo.rfc }}</strong>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2.2rem 2.4rem;
    border-radius: 22px;
    color: #fff;
    background: radial-gradient(90% 120% at 100% 0%, #2b3a8f 0%, transparent 60%), linear-gradient(135deg, #141b44, #0e1430);
    margin-bottom: 1.5rem;
}

.eyebrow {
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 700;
}

.hero h1 {
    margin: 0.5rem 0;
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    max-width: 520px;
}

.hero p {
    margin: 0 0 1.4rem;
    color: #b9c0e3;
    max-width: 520px;
    line-height: 1.55;
}

.cta {
    background: var(--gold) !important;
    border-color: var(--gold) !important;
    color: var(--ink) !important;
    font-weight: 700;
}

.hero-art {
    position: relative;
    width: 220px;
    height: 160px;
    flex-shrink: 0;
}

.mini {
    position: absolute;
    width: 110px;
    height: 160px;
    border-radius: 14px;
}

.m1 {
    right: 110px;
    background: rgba(255, 255, 255, 0.06);
    transform: rotate(-14deg);
}
.m2 {
    right: 55px;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(-4deg);
}
.m3 {
    right: 0;
    background: linear-gradient(180deg, #f3c74f, #d9a520);
    transform: rotate(8deg);
    display: grid;
    place-items: center;
    color: var(--ink);
    font-size: 2.2rem;
}

.stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem 1.3rem;
}

.stat i {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--gold) 18%, transparent);
    color: #b5860f;
    font-size: 1.2rem;
}

.stat strong {
    display: block;
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1;
}

.stat span {
    font-size: 0.8rem;
    color: var(--muted);
}

.fila {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 1.5rem;
}

.vacio {
    text-align: center;
    color: var(--muted);
    padding: 1.5rem 0;
}

.vacio i {
    font-size: 2rem;
    opacity: 0.6;
}

.recientes {
    list-style: none;
    margin: 0;
    padding: 0;
}

.recientes li {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--border);
}

.recientes li:last-child {
    border-bottom: 0;
}

.ini {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--ink);
    color: var(--gold);
    font-weight: 700;
    font-size: 0.85rem;
}

.info {
    flex: 1;
    min-width: 0;
}

.info strong {
    display: block;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info span,
.recientes small {
    font-size: 0.78rem;
    color: var(--muted);
}

.barra {
    margin-bottom: 1rem;
}

.barra-head {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 0.35rem;
}

.barra-track {
    height: 8px;
    border-radius: 999px;
    background: var(--border);
    overflow: hidden;
}

.barra-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #4f5bd5, var(--gold));
    transition: width 0.4s ease;
}

.ultimo {
    margin-top: 1.4rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--ink);
    color: #fff;
}

.ultimo span {
    display: block;
    font-size: 0.72rem;
    color: #9aa2cc;
    margin-bottom: 0.25rem;
}

.ultimo strong {
    font-size: 1.1rem;
    color: var(--gold);
    letter-spacing: 0.06em;
}

@media (max-width: 1100px) {
    .stats {
        grid-template-columns: repeat(2, 1fr);
    }
    .fila {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .hero {
        padding: 1.6rem;
    }
    .hero-art {
        display: none;
    }
    .hero h1 {
        font-size: 1.5rem;
    }
    .recientes small {
        display: none;
    }
}
</style>
