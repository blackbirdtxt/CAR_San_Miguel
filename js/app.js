const form = document.getElementById('reportForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const tipo = document.getElementById('tipo').value;
        const descripcion = document.getElementById('descripcion').value;
        const ubicacion = document.getElementById('ubicacion').value;
        const nombre = document.getElementById('nombre').value;

        const reporte = { tipo, descripcion, ubicacion, nombre };

        let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
        reportes.push(reporte);
        localStorage.setItem('reportes', JSON.stringify(reportes));

        document.getElementById('mensaje').textContent = "Gracias. Su reporte fue enviado correctamente.";
        form.reset();
    });
}

function cargarReportes() {
    const tabla = document.getElementById('tablaReportes');
    let reportes = JSON.parse(localStorage.getItem('reportes')) || [];

    tabla.innerHTML = "";

    reportes.forEach(rep => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${rep.tipo}</td>
            <td>${rep.descripcion}</td>
            <td>${rep.ubicacion || "-"}</td>
            <td>${rep.nombre || "Anónimo"}</td>
        `;
        tabla.appendChild(fila);
    });
}
