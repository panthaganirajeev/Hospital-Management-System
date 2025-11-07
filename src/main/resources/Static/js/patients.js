const apiUrl = "/api/patients"; // same origin (Spring Boot serves both)

// Fetch and display all patients
async function loadPatients() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tbody = document.querySelector("#patients-table tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No patient records found.</td></tr>`;
        return;
    }

    data.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.dob}</td>
            <td>${p.contact}</td>
            <td>
                <button onclick="deletePatient(${p.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Show/Hide modal form
const modal = document.getElementById("patientFormModal");
document.getElementById("addPatientBtn").addEventListener("click", () => {
    modal.style.display = "block";
});
document.getElementById("closeFormBtn").addEventListener("click", () => {
    modal.style.display = "none";
});

// Handle form submit
document.getElementById("patientForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPatient = {
        name: document.getElementById("name").value,
        dob: document.getElementById("dob").value,
        contact: document.getElementById("contact").value
    };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient)
    });

    if (response.ok) {
        alert("Patient added successfully!");
        modal.style.display = "none";
        e.target.reset();
        loadPatients();
    } else {
        alert("Failed to add patient!");
    }
});

// Delete patient
async function deletePatient(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
        const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (response.ok) {
            alert("Patient deleted successfully!");
            loadPatients();
        }
    }
}

// Load data on page load
window.onload = loadPatients;
