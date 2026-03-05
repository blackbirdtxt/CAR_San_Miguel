import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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

// 🧩 Pega AQUÍ tu configuración de Firebase EXACTA
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

// 📩 FORMULARIO (index.html)
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const nombre = document.getElementById("nombre").value.trim();

    if (!tipo || !descripcion) {
      alert("Por favor complete los campos Tipo y Descripción.");
      return;
    }

    try {
      await addDoc(collection(db, "reportes"), {
        tipo,
        descripcion,
        ubicacion,
        nombre,
        estado: "Pendiente",
        fecha: serverTimestamp()
      });
      document.getElementById("mensaje").textContent =
        "Gracias. Su reporte fue enviado correctamente.";
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Hubo un error enviando tu reporte.");
    }
  });
}

// 🛠 PANEL ADMIN
if (tabla) {

  const contador = document.getElementById("contador");
  const selectAll = document.getElementById("selectAll");
  const btnEliminarSeleccionados = document.getElementById("eliminarSeleccionados");

  const q = query(collection(db, "reportes"), orderBy("fecha", "desc"));

  onSnapshot(q, (snapshot) => {
    tabla.innerHTML = "";

    let pendientes = 0;
    let revision = 0;
    let resueltos = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      if (data.estado === "Pendiente") pendientes++;
      if (data.estado === "En revisión") revision++;
      if (data.estado === "Resuelto") resueltos++;

      tabla.innerHTML += `
        <tr>
          <td><input type="checkbox" class="selectItem" value="${id}"></td>
          <td><span class="badge bg-primary">${data.tipo}</span></td>
          <td>${data.descripcion}</td>
          <td>${data.ubicacion || "-"}</td>
          <td>${data.nombre || "Anónimo"}</td>
          <td>
            <select class="form-select form-select-sm estadoSelect" data-id="${id}">
              <option ${data.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
              <option ${data.estado === "En revisión" ? "selected" : ""}>En revisión</option>
              <option ${data.estado === "Resuelto" ? "selected" : ""}>Resuelto</option>
            </select>
          </td>
          <td><button class="btn btn-sm btn-danger eliminarBtn" data-id="${id}">🗑</button></td>
        </tr>
      `;
    });

    contador.textContent = snapshot.size + " Reportes";
    document.getElementById("statPendiente").textContent = pendientes;
    document.getElementById("statRevision").textContent = revision;
    document.getElementById("statResuelto").textContent = resueltos;

    activarEventos();
  });

  function activarEventos() {

    document.querySelectorAll(".eliminarBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "reportes", btn.dataset.id));
      });
    });

    document.querySelectorAll(".estadoSelect").forEach(select => {
      select.addEventListener("change", async () => {
        await updateDoc(doc(db, "reportes", select.dataset.id), {
          estado: select.value
        });
      });
    });

    if (selectAll) {
      selectAll.addEventListener("change", () => {
        document.querySelectorAll(".selectItem").forEach(cb => {
          cb.checked = selectAll.checked;
        });
      });
    }

    if (btnEliminarSeleccionados) {
      btnEliminarSeleccionados.addEventListener("click", async () => {
        const seleccionados = document.querySelectorAll(".selectItem:checked");
        for (let cb of seleccionados) {
          await deleteDoc(doc(db, "reportes", cb.value));
        }
      });
    }
  }
}
