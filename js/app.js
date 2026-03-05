import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// PEGA TU CONFIG AQUÍ
const firebaseConfig = {
  apiKey: "AIzaSyDqTPSPy0l646ZJWLTCfPpa1YjvzTRVBRw",
  authDomain: "car-san-miguel.firebaseapp.com",
  projectId: "car-san-miguel",
  storageBucket: "car-san-miguel.firebasestorage.app",
  messagingSenderId: "55038319521",
  appId: "1:55038319521:web:11268ba8b3c034839649e0",
  measurementId: "G-3J70RY3YJH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("reportForm");
const tabla = document.getElementById("tablaReportes");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        await addDoc(collection(db, "reportes"), {
            await addDoc(collection(db, "reportes"), {
              tipo,
              descripcion,
              ubicacion,
              nombre,
              estado: "Pendiente",
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
