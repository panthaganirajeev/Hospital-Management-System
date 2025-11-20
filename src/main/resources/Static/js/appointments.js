// ================== CONFIG ==================
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
                    <td><button onclick="deleteAppointment(${a.id})">Delete</button></td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading appointments:", error);
    }
}



// ================== LOAD PATIENT & DOCTOR DROPDOWNS ==================
async function loadDropdowns() {
    // Load Patients
    const patientRes = await fetch(patientApi);
    const patients = await patientRes.json();

    const patientSelect = document.getElementById("patientId");
    patientSelect.innerHTML = `<option value="">Select Patient</option>`;
    patients.forEach(p => {
        patientSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });

    // Load Doctors
    const doctorRes = await fetch(doctorApi);
    const doctors = await doctorRes.json();

    const doctorSelect = document.getElementById("doctorId");
    doctorSelect.innerHTML = `<option value="">Select Doctor</option>`;
    doctors.forEach(d => {
        doctorSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
}



// ================== SHOW/HIDE MODAL ==================
const appointmentModal = document.getElementById("appointmentModal");

document.getElementById("open-appointment-form").addEventListener("click", () => {
    appointmentModal.style.display = "block";
    loadDropdowns(); // load doctor & patient lists
});

document.getElementById("closeAppointmentBtn").addEventListener("click", () => {
    appointmentModal.style.display = "none";
});



// ================== SAVE APPOINTMENT ==================
document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const patientId = document.getElementById("patientId").value;
    const doctorId = document.getElementById("doctorId").value;
    const date = document.getElementById("appointmentDate").value;
    const reason = document.getElementById("reason").value.trim();

    if (!patientId || !doctorId || !date || !reason) {
        alert("All fields are required!");
        return;
    }

    // Convert Date to MM/dd/yyyy format (because your controller expects it)
    const dateObj = new Date(date);
    const formattedDate = (dateObj.getMonth() + 1).toString().padStart(2, '0') + "/" +
                          dateObj.getDate().toString().padStart(2, '0') + "/" +
                          dateObj.getFullYear();


    try {
        const response = await fetch(`${appointmentApi}?patientId=${patientId}&doctorId=${doctorId}&appointmentDate=${formattedDate}&reason=${reason}`, {
            method: "POST"
        });

        if (response.ok) {
            alert("Appointment booked successfully!");
            appointmentModal.style.display = "none";
            document.getElementById("appointmentForm").reset();
            loadAppointments();
        } else {
            alert("Failed to book appointment.");
        }

    } catch (error) {
        alert("Error connecting to backend!");
        console.log(error);
    }
});



// ================== DELETE APPOINTMENT ==================
async function deleteAppointment(id) {
    if (confirm("Are you sure you want to delete this appointment?")) {
        await fetch(`${appointmentApi}/${id}`, { method: "DELETE" });
        loadAppointments();
    }
}



// Load appointments on page load
window.onload = loadAppointments;
