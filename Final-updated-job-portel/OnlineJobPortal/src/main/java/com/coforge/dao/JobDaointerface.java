package com.coforge.dao;

import java.util.Optional;

import com.coforge.entity.Job;

public interface JobDaointerface {
   public Job save(Job jobs);
   public Optional<Job> findById(long id);
   public void remove (Job jobs);
   public Job update (Job jobs);
}
