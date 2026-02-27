// 1. Base de datos original
const opcionesPorTipo = {
    "HDD": {
        secuenciales: ["Lento (<120)", "Normal (120-180)", "Rapido (>180)"],
        aleatorias: ["Lento (<0.50)", "Normal (0.50-1.20)", "Rapido (>1.20)"]
    },
    "SSD SATA": {
        secuenciales: ["Lento (<300)", "Normal (300-500)", "Rapido (>500)"],
        aleatorias: ["Lento (<20)", "Normal (20-40)", "Rapido (>40)"]
    },
    "SSD NVMe": {
        secuenciales: ["Lento (<2400)", "Normal (2400-5000)", "Rapido (>5000)"],
        aleatorias: ["Lento (<45)", "Normal (45-70)", "Rapido (>70)"]
    }
};

// 2. Diccionario para acortar la URL (mapeo)
const mapaCorto = {
    // Tipos
    "HDD": "h", "SSD SATA": "s", "SSD NVMe": "n",
    // Salud
    "Saludable": "s1", "Aceptable": "s2", "Riesgoso": "s3", "Desconocido": "s4",
    // Velocidades
    "Lento": "l", "Normal": "m", "Rapido": "r"
};

// Función inversa para leer la URL
const obtenerLargo = (valorCorto) => Object.keys(mapaCorto).find(key => mapaCorto[key] === valorCorto);

function actualizarPruebas() {
    const tipoSeleccionado = document.getElementById("tipo").value;
    const selectSecuenciales = document.getElementById("secuenciales");
    const selectAleatorias = document.getElementById("aleatorias");

    selectSecuenciales.innerHTML = "";
    selectAleatorias.innerHTML = "";

    if (opcionesPorTipo[tipoSeleccionado]) {
        agregarOpcionPlaceholder(selectSecuenciales);
        opcionesPorTipo[tipoSeleccionado].secuenciales.forEach(op => agregarOpcion(selectSecuenciales, op));

        agregarOpcionPlaceholder(selectAleatorias);
        opcionesPorTipo[tipoSeleccionado].aleatorias.forEach(op => agregarOpcion(selectAleatorias, op));
    }
}

function agregarOpcionPlaceholder(selectElement) {
    let opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Seleccionar...";
    opt.disabled = true; opt.selected = true;
    selectElement.appendChild(opt);
}

function agregarOpcion(selectElement, texto) {
    let opt = document.createElement("option");
    opt.value = texto; opt.textContent = texto;
    selectElement.appendChild(opt);
}

function generarURL() {
    // Extraemos solo la primera palabra de las pruebas (Lento, Normal, Rapido) para la URL
    const getCortoVel = (id) => mapaCorto[document.getElementById(id).value.split(' ')[0]] || "";

    const datosCortos = {
        t: mapaCorto[document.getElementById("tipo").value],
        f: document.getElementById("fecha").value,
        a: document.getElementById("analizador").value,
        s: mapaCorto[document.getElementById("salud").value.split(' ')[0]],
        ps: getCortoVel("secuenciales"),
        pa: getCortoVel("aleatorias")
    };

    const params = new URLSearchParams(datosCortos).toString();
    const urlFinal = `${window.location.origin}${window.location.pathname}?${params}`;

    navigator.clipboard.writeText(urlFinal).then(() => {
        alert("¡URL Corta copiada!");
    });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('t')) {
        // Traducimos de corto a largo
        const tipoLargo = obtenerLargo(urlParams.get('t'));
        document.getElementById("tipo").value = tipoLargo;
        document.getElementById("fecha").value = urlParams.get('f');
        document.getElementById("analizador").value = urlParams.get('a');
        
        // Buscar salud que empiece por la palabra mapeada
        const saludLetra = obtenerLargo(urlParams.get('s'));
        const opcionSalud = Array.from(document.getElementById("salud").options)
                            .find(opt => opt.text.startsWith(saludLetra));
        if(opcionSalud) document.getElementById("salud").value = opcionSalud.value;

        actualizarPruebas();

        // Buscar velocidad que empiece por la palabra mapeada
        const velSec = obtenerLargo(urlParams.get('ps'));
        const opcionSec = Array.from(document.getElementById("secuenciales").options)
                            .find(opt => opt.text.startsWith(velSec));
        if(opcionSec) document.getElementById("secuenciales").value = opcionSec.value;

        const velAle = obtenerLargo(urlParams.get('pa'));
        const opcionAle = Array.from(document.getElementById("aleatorias").options)
                            .find(opt => opt.text.startsWith(velAle));
        if(opcionAle) document.getElementById("aleatorias").value = opcionAle.value;

        document.querySelectorAll('input, select').forEach(el => el.style.pointerEvents = "none");
        document.querySelector("h2").innerText = "Reporte de Almacenamiento";
    }
};