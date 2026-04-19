package com.coforge.service;

import java.util.List;

import com.coforge.entity.Skill;

public interface SkillService {

    Skill createSkill(Skill skill);

    Skill getSkillById(Long id);

    List<Skill> getAllSkills();

    void deleteSkill(Long id);
}