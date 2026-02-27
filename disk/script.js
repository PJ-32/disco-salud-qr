// 1. Base de datos de rendimientos según tus especificaciones
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

/**
 * Actualiza dinámicamente los selects de pruebas según el Tipo elegido
 */
function actualizarPruebas() {
    const tipoSeleccionado = document.getElementById("tipo").value;
    const selectSecuenciales = document.getElementById("secuenciales");
    const selectAleatorias = document.getElementById("aleatorias");

    // Limpiamos las opciones previas
    selectSecuenciales.innerHTML = "";
    selectAleatorias.innerHTML = "";

    if (opcionesPorTipo[tipoSeleccionado]) {
        // Opción inicial vacía para Secuenciales
        agregarOpcionPlaceholder(selectSecuenciales);
        opcionesPorTipo[tipoSeleccionado].secuenciales.forEach(op => agregarOpcion(selectSecuenciales, op));

        // Opción inicial vacía para Aleatorias
        agregarOpcionPlaceholder(selectAleatorias);
        opcionesPorTipo[tipoSeleccionado].aleatorias.forEach(op => agregarOpcion(selectAleatorias, op));
    }
}

function agregarOpcionPlaceholder(selectElement) {
    let opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Seleccionar resultado...";
    opt.disabled = true;
    opt.selected = true;
    selectElement.appendChild(opt);
}

function agregarOpcion(selectElement, texto) {
    let opt = document.createElement("option");
    opt.value = texto;
    opt.textContent = texto;
    selectElement.appendChild(opt);
}

/**
 * Genera la URL con parámetros y la copia al portapapeles
 */
function generarURL() {
    const datos = {
        tipo: document.getElementById("tipo").value,
        fecha: document.getElementById("fecha").value,
        analizador: document.getElementById("analizador").value,
        salud: document.getElementById("salud").value,
        secuenciales: document.getElementById("secuenciales").value,
        aleatorias: document.getElementById("aleatorias").value
    };

    // Validación: que no falte ningún dato
    for (const key in datos) {
        if (!datos[key]) {
            alert(`Por favor, completa el campo: ${key}`);
            return;
        }
    }

    // Creamos los parámetros para la URL
    const params = new URLSearchParams(datos).toString();
    
    // Construimos la URL completa (funciona en Netlify o localmente)
    const urlFinal = `${window.location.origin}${window.location.pathname}?${params}`;

    // Copiar al portapapeles
    navigator.clipboard.writeText(urlFinal).then(() => {
        alert("¡URL copiada! Ya puedes compartir este reporte.");
    }).catch(err => {
        console.error("Error al copiar:", err);
        alert("URL generada: " + urlFinal);
    });
}

/**
 * Al cargar la página, verifica si hay datos en la URL para llenar la tabla
 */
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Si la URL contiene datos (es un reporte compartido)
    if (urlParams.has('tipo')) {
        document.getElementById("tipo").value = urlParams.get('tipo');
        document.getElementById("fecha").value = urlParams.get('fecha');
        document.getElementById("analizador").value = urlParams.get('analizador');
        document.getElementById("salud").value = urlParams.get('salud');

        // IMPORTANTE: Generar primero las opciones de las pruebas
        actualizarPruebas();

        // Asignar los valores guardados a las pruebas
        document.getElementById("secuenciales").value = urlParams.get('secuenciales');
        document.getElementById("aleatorias").value = urlParams.get('aleatorias');
        
        // Efecto "Reporte": Bloqueamos los campos para que no se editen por error
        document.querySelectorAll('input, select').forEach(el => {
            el.style.pointerEvents = "none";
        });
        
        document.querySelector("h2").innerText = "Reporte Generado";
    }
};