package com.coforge.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.coforge.entity.Job;
import com.coforge.repository.JobsRepository;

@Repository
public class JobsDao implements JobDaointerface{
   @Autowired
	JobsRepository jobsRepository;

   @Override
   public Job save(Job jobs) {
	  return jobsRepository.save(jobs);
   }

   @Override
   public Optional<Job> findById(long id) {
	return jobsRepository.findById(id);
   }

   @Override
   public void remove(Job jobs) {
	  jobsRepository.delete(jobs);
	
   }

   @Override
   public Job update(Job jobs) {
	return jobsRepository.save(jobs);
   }
}
