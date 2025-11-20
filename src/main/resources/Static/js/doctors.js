// ================== CONFIG ==================
const doctorApi = "http://localhost:8090/api/doctors";


// ================== LOAD DOCTORS ==================
async function loadDoctors() {
    try {
        const res = await fetch(doctorApi);
        const doctors = await res.json();

        const tbody = document.querySelector("#doctors-table tbody");
        tbody.innerHTML = "";

        if (!doctors || doctors.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No doctor records found.</td></tr>`;
            return;
        }

        doctors.forEach(doc => {
            tbody.innerHTML += `
                <tr>
                    <td>${doc.id}</td>
                    <td>${doc.name}</td>
                    <td>${doc.specialization}</td>
                    <td>${doc.contact}</td>
                    <td>
                        <button onclick="editDoctor(${doc.id})">Edit</button>
                        <button onclick="deleteDoctor(${doc.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading doctors:", error);
    }
}



// ================== SHOW/HIDE MODAL ==================
const doctorModal = document.getElementById("doctorFormModal");
const doctorTitle = document.getElementById("doctorModalTitle");

document.getElementById("addDoctorBtn").addEventListener("click", () => {
    doctorModal.style.display = "block";
    doctorTitle.innerText = "Add Doctor";

    document.getElementById("doctorId").value = "";
    document.getElementById("doctorForm").reset();
});

document.getElementById("closeDoctorFormBtn").addEventListener("click", () => {
    doctorModal.style.display = "none";
});



// ================== EDIT DOCTOR ==================
async function editDoctor(id) {
    doctorModal.style.display = "block";
    doctorTitle.innerText = "Edit Doctor";

    const res = await fetch(`${doctorApi}/${id}`);
    const d = await res.json();

    document.getElementById("doctorId").value = d.id;
    document.getElementById("doctorName").value = d.name;
    document.getElementById("doctorSpecialization").value = d.specialization;
    document.getElementById("doctorContact").value = d.contact;
}



// ================== SAVE DOCTOR ==================
document.getElementById("doctorForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("doctorId").value;

    const doctorData = {
        name: document.getElementById("doctorName").value,
        specialization: document.getElementById("doctorSpecialization").value,
        contact: document.getElementById("doctorContact").value
    };

    let url = doctorApi;
    let method = "POST";

    if (id) {
        url = `${doctorApi}/${id}`;
        method = "PUT";
    }

    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData)
    });

    if (response.ok) {
        alert(id ? "Doctor updated!" : "Doctor added!");

        doctorModal.style.display = "none";
        loadDoctors();
    }
});



// ================== DELETE DOCTOR ==================
async function deleteDoctor(id) {
    if (confirm("Delete this doctor?")) {
        await fetch(`${doctorApi}/${id}`, { method: "DELETE" });
        loadDoctors();
    }
}



// Load doctors on page load
window.onload = loadDoctors;
