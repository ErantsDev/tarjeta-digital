<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import { store } from '@/store/empleados';

const route = useRoute();
const abierto = ref(false);
const oscuro = ref(document.documentElement.classList.contains('app-dark'));

const menu = [
    { titulo: 'General', items: [{ label: 'Dashboard', icon: 'pi pi-th-large', to: '/' }] },
    {
        titulo: 'Módulos',
        items: [
            { label: 'Tarjeta digital', icon: 'pi pi-id-card', to: '/tarjeta' },
            { label: 'Empleados', icon: 'pi pi-users', to: '/empleados', badge: true }
        ]
    }
];

const titulo = computed(() => route.meta.titulo || '');

const alternarTema = () => {
    oscuro.value = !oscuro.value;
    document.documentElement.classList.toggle('app-dark', oscuro.value);
};

watch(() => route.fullPath, () => (abierto.value = false));
</script>

<template>
    <div class="shell" :class="{ 'menu-abierto': abierto }">
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-mark"><i class="pi pi-building-columns"></i></div>
                <div>
                    <strong>Facultad de Negocios</strong>
                    <span>UNACH · Campus IV</span>
                </div>
            </div>

            <nav>
                <div v-for="grupo in menu" :key="grupo.titulo" class="grupo">
                    <span class="grupo-titulo">{{ grupo.titulo }}</span>
                    <router-link v-for="item in grupo.items" :key="item.to" :to="item.to" class="nav-item" exact-active-class="activo">
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                        <em v-if="item.badge && store.empleados.length" class="badge">{{ store.empleados.length }}</em>
                    </router-link>
                </div>
            </nav>

            <div class="sidebar-foot">
                <i class="pi pi-code"></i>
                <span>Vue 3 + PrimeVue</span>
            </div>
        </aside>

        <div class="velo" @click="abierto = false"></div>

        <div class="main">
            <header class="topbar">
                <Button icon="pi pi-bars" text rounded class="hamburguesa" @click="abierto = !abierto" aria-label="Menú" />
                <div class="ruta">
                    <span>Universidad Autónoma de Chiapas</span>
                    <i class="pi pi-angle-right"></i>
                    <strong>{{ titulo }}</strong>
                </div>
                <div class="acciones">
                    <Button :icon="oscuro ? 'pi pi-sun' : 'pi pi-moon'" text rounded @click="alternarTema" v-tooltip.bottom="'Cambiar tema'" aria-label="Cambiar tema" />
                    <div class="usuario">
                        <Avatar label="ME" shape="circle" class="avatar" />
                        <span>Martín Emmanuel Erants</span>
                    </div>
                </div>
            </header>

            <main class="contenido">
                <router-view />
            </main>
        </div>

        <Toast position="bottom-right" />
        <ConfirmDialog />
    </div>
</template>

<style scoped>
.shell {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 264px;
    background: radial-gradient(120% 60% at 0% 0%, #1f2a63 0%, transparent 60%), var(--ink);
    color: #cfd4ec;
    display: flex;
    flex-direction: column;
    padding: 1.4rem 1rem;
    z-index: 30;
    transition: transform 0.25s ease;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 0.5rem 1.4rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand strong {
    display: block;
    color: #fff;
    font-size: 0.95rem;
}

.brand span {
    font-size: 0.75rem;
    color: var(--gold-soft);
    opacity: 0.8;
}

.brand-mark {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--gold), #f3c74f);
    color: var(--ink);
    font-size: 1.2rem;
}

nav {
    flex: 1;
    margin-top: 1.2rem;
}

.grupo {
    margin-bottom: 1.2rem;
}

.grupo-titulo {
    display: block;
    padding: 0 0.75rem 0.5rem;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7c84ad;
    font-weight: 700;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.75rem;
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.92rem;
    transition: background 0.15s;
    position: relative;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
}

.nav-item.activo {
    background: rgba(217, 165, 32, 0.14);
    color: #fff;
}

.nav-item.activo::before {
    content: '';
    position: absolute;
    left: -1rem;
    top: 20%;
    bottom: 20%;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: var(--gold);
}

.nav-item.activo i {
    color: var(--gold);
}

.badge {
    margin-left: auto;
    font-style: normal;
    font-size: 0.72rem;
    font-weight: 700;
    background: var(--gold);
    color: var(--ink);
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
}

.sidebar-foot {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.78rem;
    color: #7c84ad;
    padding: 0 0.75rem;
}

.main {
    flex: 1;
    margin-left: 264px;
    min-width: 0;
}

.topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 68px;
    padding: 0 2rem;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
}

.hamburguesa {
    display: none !important;
}

.ruta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted);
    font-size: 0.88rem;
}

.ruta strong {
    color: var(--text);
}

.acciones {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.usuario {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.3rem 0.8rem 0.3rem 0.3rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    font-size: 0.85rem;
    font-weight: 600;
}

.avatar {
    background: var(--ink) !important;
    color: var(--gold) !important;
    font-weight: 700;
    font-size: 0.8rem;
}

.contenido {
    padding: 2rem;
    max-width: 1280px;
}

.velo {
    display: none;
}

@media (max-width: 991px) {
    .sidebar {
        transform: translateX(-100%);
    }
    .menu-abierto .sidebar {
        transform: none;
    }
    .menu-abierto .velo {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(5, 8, 25, 0.5);
        z-index: 25;
    }
    .main {
        margin-left: 0;
    }
    .hamburguesa {
        display: inline-flex !important;
    }
    .topbar {
        padding: 0 1rem;
    }
    .contenido {
        padding: 1.25rem 1rem;
    }
    .ruta span,
    .ruta i,
    .usuario span {
        display: none;
    }
    .usuario {
        padding: 0.3rem;
    }
}
</style>
