import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// PEGA TU CONFIG AQUÍ
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("reportForm");
const tabla = document.getElementById("tablaReportes");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        await addDoc(collection(db, "reportes"), {
            tipo: tipo.value,
            descripcion: descripcion.value,
            ubicacion: ubicacion.value,
            nombre: nombre.value,
            fecha: serverTimestamp()
        });

        document.getElementById("mensaje").textContent = "Gracias. Su reporte fue enviado correctamente.";
        form.reset();
    });
}

if (tabla) {
    const q = query(collection(db, "reportes"), orderBy("fecha", "desc"));

    onSnapshot(q, (snapshot) => {
        tabla.innerHTML = "";
        document.getElementById("contador").textContent = snapshot.size + " Reportes";

        snapshot.forEach(doc => {
            const data = doc.data();
            tabla.innerHTML += `
                <tr>
                    <td><span class="badge bg-primary">${data.tipo}</span></td>
                    <td>${data.descripcion}</td>
                    <td>${data.ubicacion || "-"}</td>
                    <td>${data.nombre || "Anónimo"}</td>
                    <td>${data.fecha ? new Date(data.fecha.seconds * 1000).toLocaleString() : ""}</td>
                </tr>
            `;
        });
    });
}
