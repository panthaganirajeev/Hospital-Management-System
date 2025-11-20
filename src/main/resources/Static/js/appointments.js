// ================== API CONFIG ==================
const appointmentApi = "http://localhost:8090/api/appointments";
const patientApi = "http://localhost:8090/api/patients";
const doctorApi = "http://localhost:8090/api/doctors";


// ================== LOAD APPOINTMENTS ==================
async function loadAppointments() {
    try {
        const res = await fetch(appointmentApi);
        const appointments = await res.json();

        const tbody = document.querySelector("#appointments-table tbody");
        tbody.innerHTML = "";

        if (!appointments || appointments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">No appointments found.</td></tr>`;
            return;
        }

        appointments.forEach(a => {
            tbody.innerHTML += `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.appointmentDate}</td>
                    <td>--</td>
                    <td>${a.patient?.name || "N/A"}</td>
                    <td>${a.doctor?.name || "N/A"}</td>
                    <td>${a.reason}</td>
                    <td>
                        <button onclick="editAppointment(${a.id})">Edit</button>
                        <button onclick="deleteAppointment(${a.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading appointments:", error);
    }
}



// ================== LOAD PATIENT & DOCTOR DROPDOWNS ==================
async function loadDropdowns(selectedPatient = "", selectedDoctor = "") {

    // Load Patients
    const patientRes = await fetch(patientApi);
    const patients = await patientRes.json();

    const patientSelect = document.getElementById("patientId");
    patientSelect.innerHTML = `<option value="">Select Patient</option>`;

    patients.forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}" ${p.id == selectedPatient ? "selected" : ""}>${p.name}</option>`;
    });

    // Load Doctors
    const doctorRes = await fetch(doctorApi);
    const doctors = await doctorRes.json();

    const doctorSelect = document.getElementById("doctorId");
    doctorSelect.innerHTML = `<option value="">Select Doctor</option>`;

    doctors.forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}" ${d.id == selectedDoctor ? "selected" : ""}>${d.name}</option>`;
    });
}



// ================== SHOW/HIDE MODAL ==================
const appointmentModal = document.getElementById("appointmentModal");
const appointmentTitle = document.getElementById("appointmentModalTitle");

document.getElementById("open-appointment-form").addEventListener("click", () => {
    appointmentModal.style.display = "block";
    appointmentTitle.innerText = "Book Appointment";

    document.getElementById("appointmentId").value = ""; // reset
    document.getElementById("appointmentForm").reset();

    loadDropdowns(); // fresh dropdowns
});

document.getElementById("closeAppointmentBtn").addEventListener("click", () => {
    appointmentModal.style.display = "none";
});



// ================== EDIT APPOINTMENT ==================
async function editAppointment(id) {
    appointmentModal.style.display = "block";
    appointmentTitle.innerText = "Edit Appointment";

    const res = await fetch(`${appointmentApi}/${id}`);
    const a = await res.json();

    document.getElementById("appointmentId").value = id;

    // convert backend date (yyyy-MM-dd) for input type="date"
    document.getElementById("appointmentDate").value = a.appointmentDate;

    document.getElementById("reason").value = a.reason;

    await loadDropdowns(a.patient.id, a.doctor.id);
}



// ================== SAVE APPOINTMENT (ADD + EDIT) ==================
document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("appointmentId").value;
    const patientId = document.getElementById("patientId").value;
    const doctorId = document.getElementById("doctorId").value;
    const date = document.getElementById("appointmentDate").value;
    const reason = document.getElementById("reason").value.trim();

    if (!patientId || !doctorId || !date || !reason) {
        alert("All fields are required!");
        return;
    }

    // Convert yyyy-MM-dd to MM/dd/yyyy for controller
    const d = new Date(date);
    const formattedDate =
        (d.getMonth() + 1).toString().padStart(2, "0") + "/" +
        d.getDate().toString().padStart(2, "0") + "/" +
        d.getFullYear();

    let url = `${appointmentApi}?patientId=${patientId}&doctorId=${doctorId}&appointmentDate=${formattedDate}&reason=${reason}`;
    let method = "POST";

    if (id) {
        // EDIT MODE → PUT URL
        url = `${appointmentApi}/${id}?patientId=${patientId}&doctorId=${doctorId}&appointmentDate=${formattedDate}&reason=${reason}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, { method: method });

        if (response.ok) {
            alert(id ? "Appointment updated!" : "Appointment booked!");
            appointmentModal.style.display = "none";
            loadAppointments();
        } else {
            alert("Error saving appointment");
        }

    } catch (error) {
        console.log("Error:", error);
        alert("Connection Error");
    }
});



// ================== DELETE APPOINTMENT ==================
async function deleteAppointment(id) {
    if (confirm("Delete this appointment?")) {
        await fetch(`${appointmentApi}/${id}`, { method: "DELETE" });
        loadAppointments();
    }
}



// ================== INITIAL LOAD ==================
window.onload = loadAppointments;
