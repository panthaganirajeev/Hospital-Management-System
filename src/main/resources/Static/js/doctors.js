
document.addEventListener('DOMContentLoaded', function() {
    // 1. Define the API endpoint for your Spring Boot DoctorController
    // This assumes your DoctorController is mapped to '/api/doctors'
    const API_URL = '/api/doctors';
    const tableBody = document.querySelector('#doctors-table tbody');

    function fetchDoctors() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors. Status: ' + response.status);
                }
                return response.json();
            })
            .then(doctors => {
                // Clear the 'Loading' row
                tableBody.innerHTML = '';

                if (doctors.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="5">No doctor records found.</td></tr>';
                    return;
                }

                // 2. Populate the table with the fetched data
                doctors.forEach(doctor => {
                    const row = tableBody.insertRow();

                    // IMPORTANT: These property names (id, name, specialization, contact)
                    // MUST MATCH the field names in your Doctor Model (Java).
                    row.insertCell().textContent = doctor.id;
                    row.insertCell().textContent = doctor.name;
                    row.insertCell().textContent = doctor.specialization || 'General Practice'; // Assuming a 'specialization' field
                    row.insertCell().textContent = doctor.contactNumber || 'N/A';

                    const actionCell = row.insertCell();
                    actionCell.innerHTML = '<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>';
                });
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
                tableBody.innerHTML = '<tr><td colspan="5" class="error-message">Error: Could not connect to the doctor API.</td></tr>';
            });
    }

    fetchDoctors();
});