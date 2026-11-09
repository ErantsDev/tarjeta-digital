// Cálculo del RFC de persona física (13 caracteres) según el algoritmo del SAT:
// 4 letras del nombre + fecha AAMMDD + homoclave (2) + dígito verificador (1)

const PALABRAS_IGNORADAS = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'MC', 'MAC', 'VON', 'VAN', 'MI', 'DA', 'DI', 'DAS', 'DER', 'DIE', 'LE', 'EL', 'MAC'];
const NOMBRES_COMUNES = ['JOSE', 'J', 'J.', 'MARIA', 'MA', 'MA.', 'M', 'M.'];
const ALTISONANTES = [
    'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO',
    'KAKA', 'KOGE', 'KOJO', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN'
];

const limpiar = (txt = '') =>
    txt
        .toUpperCase()
        .normalize('NFD')
        .replace(/Ñ/g, 'Ñ') // conserva la Ñ
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^A-ZÑ& ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const sinPalabrasIgnoradas = (txt) =>
    txt
        .split(' ')
        .filter((p) => p && !PALABRAS_IGNORADAS.includes(p))
        .join(' ');

const primerNombreUtil = (nombre) => {
    const partes = nombre.split(' ').filter(Boolean);
    if (partes.length > 1 && NOMBRES_COMUNES.includes(partes[0])) return partes[1];
    return partes[0] || '';
};

const primeraVocalInterna = (txt) => {
    const m = txt.slice(1).match(/[AEIOU]/);
    return m ? m[0] : 'X';
};

function letrasIniciales(nombre, paterno, materno) {
    const n = primerNombreUtil(nombre);
    let clave;
    if (!materno) {
        clave = paterno.slice(0, 2) + n.slice(0, 2);
    } else if (paterno.length <= 2) {
        clave = paterno[0] + materno[0] + n.slice(0, 2);
    } else {
        clave = paterno[0] + primeraVocalInterna(paterno) + materno[0] + n[0];
    }
    clave = clave.replace(/Ñ/g, 'X').padEnd(4, 'X');
    if (ALTISONANTES.includes(clave)) clave = clave.slice(0, 3) + 'X';
    return clave;
}

function homoclave(nombreCompleto) {
    const valor = (c) => {
        if (c === ' ') return '00';
        if (c === '&') return '10';
        if (c === 'Ñ') return '40';
        if (/[0-9]/.test(c)) return '0' + c;
        const code = c.charCodeAt(0) - 64; // A=1
        if (code <= 9) return String(10 + code); // A-I: 11-19
        if (code <= 18) return String(11 + code); // J-R: 21-29
        return String(13 + code); // S-Z: 32-39
    };
    const cadena = '0' + [...nombreCompleto].map(valor).join('');
    let suma = 0;
    for (let i = 0; i < cadena.length - 1; i++) {
        suma += parseInt(cadena.slice(i, i + 2), 10) * parseInt(cadena[i + 1], 10);
    }
    const tres = suma % 1000;
    const tabla = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    return tabla[Math.floor(tres / 34)] + tabla[tres % 34];
}

function digitoVerificador(rfc12) {
    const tabla = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ';
    let suma = 0;
    for (let i = 0; i < 12; i++) suma += tabla.indexOf(rfc12[i]) * (13 - i);
    const r = suma % 11;
    if (r === 0) return '0';
    const d = 11 - r;
    return d === 10 ? 'A' : String(d);
}

/**
 * @param {{nombre:string, paterno:string, materno?:string, fecha:Date}} datos
 * @returns {string} RFC de 13 caracteres
 */
export function calcularRFC({ nombre, paterno, materno = '', fecha }) {
    const n = limpiar(nombre);
    const p = limpiar(paterno);
    const m = limpiar(materno);
    if (!n || !p || !(fecha instanceof Date) || isNaN(fecha)) return '';

    const iniciales = letrasIniciales(sinPalabrasIgnoradas(n), sinPalabrasIgnoradas(p), sinPalabrasIgnoradas(m));
    const aa = String(fecha.getFullYear()).slice(-2);
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');

    const base = iniciales + aa + mm + dd;
    const hc = homoclave(`${p} ${m} ${n}`.replace(/\s+/g, ' ').trim());
    return base + hc + digitoVerificador(base + hc);
}
