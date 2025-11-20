// ================== CONFIG ==================
const apiUrl = "http://localhost:8090/api/patients";


// ================== LOAD PATIENTS ==================
async function loadPatients() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const tbody = document.querySelector("#patients-table tbody");
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No patient records found.</td></tr>`;
            return;
        }

        data.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.dob}</td>
                    <td>${p.contact}</td>
                    <td>
                        <button onclick="editPatient(${p.id})">Edit</button>
                        <button onclick="deletePatient(${p.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading patients:", error);
    }
}



// ================== MODAL OPEN/CLOSE ==================
const modal = document.getElementById("patientFormModal");
const modalTitle = document.getElementById("patientModalTitle");

document.getElementById("addPatientBtn").addEventListener("click", () => {
    modal.style.display = "block";
    modalTitle.innerText = "Add Patient";
    document.getElementById("patientId").value = ""; // clear edit ID
    document.getElementById("patientForm").reset();
});

document.getElementById("closeFormBtn").addEventListener("click", () => {
    modal.style.display = "none";
});



// ================== EDIT PATIENT ==================
async function editPatient(id) {
    modal.style.display = "block";
    modalTitle.innerText = "Edit Patient";

    const res = await fetch(`${apiUrl}/${id}`);
    const patient = await res.json();

    // Fill form fields
    document.getElementById("patientId").value = id;
    document.getElementById("name").value = patient.name;
    document.getElementById("dob").value = patient.dob;
    document.getElementById("contact").value = patient.contact;
}



// ================== SAVE PATIENT (ADD + EDIT) ==================
document.getElementById("patientForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("patientId").value; // blank = add, value = edit

    const name = document.getElementById("name").value.trim();
    const dob = document.getElementById("dob").value;
    const contact = document.getElementById("contact").value.trim();

    // --- VALIDATION ---
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(name)) {
        alert("Name must contain letters only (A-Z).");
        return;
    }

    const contactRegex = /^[0-9]+$/;
    if (!contactRegex.test(contact)) {
        alert("Contact must contain digits only.");
        return;
    }

    if (contact.length < 10) {
        alert("Contact must be at least 10 digits.");
        return;
    }

    const patientData = { name, dob, contact };

    let url = apiUrl;
    let method = "POST";

    if (id) {
        // Editing mode
        url = `${apiUrl}/${id}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert(id ? "Patient updated successfully!" : "Patient added successfully!");
            modal.style.display = "none";
            document.getElementById("patientForm").reset();
            loadPatients();
        } else {
            alert("Failed to save patient!");
        }

    } catch (error) {
        alert("Error connecting to backend!");
        console.log(error);
    }
});



// ================== DELETE PATIENT ==================
async function deletePatient(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        loadPatients();
    }
}



// Load data on page load
window.onload = loadPatients;
