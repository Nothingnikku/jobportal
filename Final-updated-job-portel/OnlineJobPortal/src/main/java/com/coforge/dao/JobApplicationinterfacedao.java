package com.coforge.dao;
 
import com.coforge.entity.JobApplication;
 
public interface JobApplicationinterfacedao {
    public JobApplication save(JobApplication application);
    public void remove(JobApplication application);
    public JobApplication update(JobApplication application);
}
 
 
 