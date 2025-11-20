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
                    <td><button onclick="deletePatient(${p.id})">Delete</button></td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error loading patients:", error);
    }
}


// ================== MODAL OPEN/CLOSE ==================
const modal = document.getElementById("patientFormModal");
document.getElementById("addPatientBtn").addEventListener("click", () => {
    modal.style.display = "block";
});
document.getElementById("closeFormBtn").addEventListener("click", () => {
    modal.style.display = "none";
});


// ================== SAVE PATIENT WITH VALIDATION ==================
document.getElementById("patientForm").addEventListener("submit", async (e) => {
    e.preventDefault();

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

    const newPatient = { name, dob, contact };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPatient)
        });

        if (response.ok) {
            alert("Patient added successfully!");
            modal.style.display = "none";
            document.getElementById("patientForm").reset();
            loadPatients();
        } else {
            alert("Failed to add patient!");
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
