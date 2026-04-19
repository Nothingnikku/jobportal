
package com.coforge.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coforge.entity.Freelancer;
import com.coforge.entity.Recruiter;
import com.coforge.service.Adminservice;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController
@RequestMapping("/admin")
@Validated
public class Admincontroller {

    @Autowired
    private Adminservice adminservice;

    // //  Create Admin
    // @PostMapping
    // public ResponseEntity<Admin> saveAdmin(@Valid @RequestBody Admin admin) {
    //     return new ResponseEntity<>(adminservice.save(admin), HttpStatus.CREATED);
    // }

    // //  Update Admin
    // @PutMapping
    // public ResponseEntity<Admin> updateAdmin(@Valid @RequestBody Admin admin) {
    //     return new ResponseEntity<>(adminservice.update(admin), HttpStatus.OK);
    // }

    // //  Get Admin by ID
    // @GetMapping("/{id}")
    // public ResponseEntity<Admin> getAdminById(@PathVariable long id) {
    //     return new ResponseEntity<>(adminservice.findById(id), HttpStatus.OK);
    // }

    //  Admin sees all recruiters
    @GetMapping("/recruiters")
    public ResponseEntity<List<Recruiter>> getAllRecruiters() {
        return new ResponseEntity<>(adminservice.getAllRecruiters(), HttpStatus.OK);
    }
    

@Autowired
    private Adminservice adminService;

    // ✅ Admin sees all unverified recruiters
    @GetMapping("/recruiters/unverified")
    public List<Recruiter> getUnverifiedRecruiters() {
        return adminService.getUnverifiedRecruiters();
    }

    // ✅ Admin verifies recruiter
    @PutMapping("/recruiter/{id}/verify")
    public ResponseEntity<Recruiter> verifyRecruiter(
            @PathVariable Long id) {

        Recruiter verifiedRecruiter =
                adminService.verifyRecruiter(id);

        return ResponseEntity.ok(verifiedRecruiter);
    }


    //  Admin sees all freelancers
    @GetMapping("/freelancers")
    public ResponseEntity<List<Freelancer>> getAllFreelancers() {
        return new ResponseEntity<>(adminservice.getAllFreelancers(), HttpStatus.OK);
    }

    // ✅ Admin sees all unverified freelancers
    @GetMapping("/freelancers/unverified")
    public List<Freelancer> getUnverifiedFreelancers() {
        return adminService.getUnverifiedFreelancers();
    }

    // ✅ Admin verifies freelancer
    @PutMapping("/freelancer/{id}/verify")
    public ResponseEntity<Freelancer> verifyFreelancer(@PathVariable Long id) {
        Freelancer verifiedFreelancer = adminService.verifyFreelancer(id);
        return ResponseEntity.ok(verifiedFreelancer);
    }

    @DeleteMapping("/recruiter/{id}/reject")
    public ResponseEntity<String> rejectRecruiter(@PathVariable Long id) {
        adminService.rejectRecruiter(id);
        return ResponseEntity.ok("Recruiter rejected");
    }

    // ✅ Admin rejects freelancer
    @DeleteMapping("/freelancer/{id}/reject")
    public ResponseEntity<String> rejectFreelancer(@PathVariable Long id) {
        adminService.rejectFreelancer(id);
        return ResponseEntity.ok("Freelancer rejected");
    }
}
