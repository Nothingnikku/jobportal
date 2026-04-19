package com.coforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coforge.entity.BookmarkedFreelancer;

public interface BookmarkedFreelancerRepository
        extends JpaRepository<BookmarkedFreelancer, Long> {

    List<BookmarkedFreelancer> findByBookmarkedBy_RecruiterId(Long recruiterId);

	void deleteByBookmarkedBy_RecruiterId(long recruiterID);
}