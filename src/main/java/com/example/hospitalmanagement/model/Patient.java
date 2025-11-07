package com.example.hospitalmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String dob;       // Matches "DOB" in HTML (can be stored as String or LocalDate)
    private String contact;   // Matches "Contact" column
    private String disease;   // Optional - you can keep this for internal record

    public Patient() {
    }

    public Patient(Long id, String name, String dob, String contact, String disease) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.contact = contact;
        this.disease = disease;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }
}
