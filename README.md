# Tarjeta Digital · Vue 3 + PrimeVue

Práctica 3.1 — Desarrollo de Aplicaciones Web y Móviles (UNACH, Facultad de Negocios).

Interfaz para capturar los datos de una persona, calcular su **RFC** (algoritmo del SAT: iniciales, fecha AAMMDD, homoclave y dígito verificador) y generar su **tarjeta digital de empleado** con código de barras.

## Módulos

- **Dashboard**: resumen de empleados, distribución por puesto y registros recientes.
- **Tarjeta digital**: formulario, cálculo de RFC, vista previa en vivo, foto opcional, guardar y descargar PNG.
- **Empleados**: tabla con búsqueda, abrir tarjeta y eliminar (datos guardados en `localStorage`).

## Tecnologías

Vue 3 · Vite · PrimeVue 4 (tema Aura) · PrimeIcons · Vue Router · JsBarcode · html-to-image

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Publicar

1. Sube el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Tarjeta digital con Vue + PrimeVue"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/tarjeta-digital.git
   git push -u origin main
   ```
2. En [Netlify](https://app.netlify.com) → *Add new site* → *Import an existing project* → elige el repositorio. La configuración de build ya está en `netlify.toml` (comando `npm run build`, carpeta `dist`).
3. Netlify te da un dominio gratuito `https://<nombre>.netlify.app` (puedes cambiar el nombre en *Site configuration → Change site name*).

---

Martín Emmanuel Erants Solórzano · Matrícula 100016732
