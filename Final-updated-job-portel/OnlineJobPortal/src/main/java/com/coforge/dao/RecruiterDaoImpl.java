package com.coforge.dao;

import java.util.List;

import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Repository;
 
import com.coforge.entity.Recruiter;

import com.coforge.repository.RecruiterRepository;
 
@Repository

public class RecruiterDaoImpl implements RecruiterDao {
 
    @Autowired

    private RecruiterRepository recruiterRepository;
 
    @Override

    public Recruiter save(Recruiter recruiter) {

        return recruiterRepository.save(recruiter);

    }
 
    @Override

    public Optional<Recruiter> findById(Long id) {

        return recruiterRepository.findById(id);

    }
 
    @Override

    public Optional<Recruiter> findByEmail(String email) {

        return recruiterRepository.findByEmail(email);

    }
 
    @Override

    public List<Recruiter> findAll() {

        return recruiterRepository.findAll();

    }
 
	

}
 