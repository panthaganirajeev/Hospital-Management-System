// ================== CONFIG ==================
const doctorApiUrl = "http://localhost:8090/api/doctors";


// ================== LOAD DOCTORS ==================
async function loadDoctors() {
    try {
        const res = await fetch(doctorApiUrl);
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
                        <button onclick="deleteDoctor(${doc.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading doctors:", error);
        document.querySelector("#doctors-table tbody").innerHTML =
            `<tr><td colspan="5">Error connecting to Backend.</td></tr>`;
    }
}



// ================== SHOW/HIDE DOCTOR MODAL ==================
const doctorModal = document.getElementById("doctorFormModal");

document.getElementById("addDoctorBtn").addEventListener("click", () => {
    doctorModal.style.display = "block";
});

document.getElementById("closeDoctorFormBtn").addEventListener("click", () => {
    doctorModal.style.display = "none";
});


// ================== SAVE DOCTOR WITH VALIDATION ==================
document.getElementById("doctorForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("doctorName").value.trim();
    const specialization = document.getElementById("specialization").value.trim();
    const contact = document.getElementById("doctorContact").value.trim();

    // --- VALIDATION ---

    // Name: letters only
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(name)) {
        alert("Doctor name must contain letters only.");
        return;
    }

    // Specialization: letters only
    const specRegex = /^[A-Za-z ]+$/;
    if (!specRegex.test(specialization)) {
        alert("Specialization must contain letters only.");
        return;
    }

    // Contact: digits only
    const contactRegex = /^[0-9]+$/;
    if (!contactRegex.test(contact)) {
        alert("Contact must contain digits only.");
        return;
    }

    if (contact.length < 10) {
        alert("Contact must be at least 10 digits.");
        return;
    }

    const newDoctor = { name, specialization, contact };

    try {
        const response = await fetch(doctorApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDoctor)
        });

        if (response.ok) {
            alert("Doctor added successfully!");
            doctorModal.style.display = "none";
            document.getElementById("doctorForm").reset();
            loadDoctors();
        } else {
            alert("Failed to add doctor!");
        }

    } catch (error) {
        console.log("Error:", error);
        alert("Error connecting to backend!");
    }
});



// ================== DELETE DOCTOR ==================
async function deleteDoctor(id) {
    if (confirm("Are you sure you want to delete this doctor?")) {
        await fetch(`${doctorApiUrl}/${id}`, { method: "DELETE" });
        loadDoctors();
    }
}



// Load Doctors on page load
window.onload = loadDoctors;
