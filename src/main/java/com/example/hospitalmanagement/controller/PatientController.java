package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:8090")  // ✅ Allow frontend (HTML/JS) to call backend APIs
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // ✅ Get all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // ✅ Get patient by ID
    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    // ✅ Add new patient
    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    // ✅ Update patient by ID
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        patient.setId(id);
        return patientRepository.save(patient);
    }

    // ✅ Delete patient by ID
    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        patientRepository.deleteById(id);
        return "Patient deleted successfully!";
    }
}
