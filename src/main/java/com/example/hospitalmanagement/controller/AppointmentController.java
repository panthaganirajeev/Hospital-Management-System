package com.example.hospitalmanagement.controller;


import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.repository.AppointmentRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                 DoctorRepository doctorRepository,
                                 PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Appointment getAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Appointment addAppointment(@RequestParam Long patientId,
                                      @RequestParam Long doctorId,
                                      @RequestParam @DateTimeFormat(pattern = "MM/dd/yyyy") LocalDate appointmentDate,
                                      @RequestParam String reason) {

        var patient = patientRepository.findById(patientId).orElse(null);
        var doctor = doctorRepository.findById(doctorId).orElse(null);

        if (patient == null || doctor == null) {
            throw new RuntimeException("Invalid patient or doctor ID");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        // You can directly use the LocalDate object Spring created
        appointment.setAppointmentDate(appointmentDate);
        appointment.setReason(reason);

        return appointmentRepository.save(appointment);
    }
    @DeleteMapping("/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return "Appointment deleted successfully!";
    }
    @GetMapping("/count")
    public long getAppointmentCount() {
        return appointmentRepository.count();
    }

}
