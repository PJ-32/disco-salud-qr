// Datos extraídos de tu tabla de referencia
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

function actualizarPruebas() {
    const tipoSeleccionado = document.getElementById("tipo").value;
    const selectSecuenciales = document.getElementById("secuenciales");
    const selectAleatorias = document.getElementById("aleatorias");

    // Limpiar opciones actuales
    selectSecuenciales.innerHTML = "";
    selectAleatorias.innerHTML = "";

    if (opcionesPorTipo[tipoSeleccionado]) {
        // Añadir opción vacía inicial para Secuenciales
        agregarOpcionVacia(selectSecuenciales);
        opcionesPorTipo[tipoSeleccionado].secuenciales.forEach(op => {
            agregarOpcion(selectSecuenciales, op);
        });

        // Añadir opción vacía inicial para Aleatorias
        agregarOpcionVacia(selectAleatorias);
        opcionesPorTipo[tipoSeleccionado].aleatorias.forEach(op => {
            agregarOpcion(selectAleatorias, op);
        });
    }
}

function agregarOpcionVacia(selectElement) {
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

function generarURL() {
    // Por ahora solo muestra un mensaje, pero aquí irá la lógica de la URL
    alert("Generar URL con los parámetros seleccionados");
}