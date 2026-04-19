package com.coforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coforge.entity.Job;
import com.coforge.entity.JobApplication;
@Repository
public interface JobsRepository extends JpaRepository<Job, Long> {

    List<Job> findByActive(boolean active);

    List<Job> findByLocation(String location);

    List<Job> findByRecruiterRecruiterId(Long recruiterId);
    List<Job> findDistinctBySkills_SkillIdIn(List<Long> skillIds);
    




    
}