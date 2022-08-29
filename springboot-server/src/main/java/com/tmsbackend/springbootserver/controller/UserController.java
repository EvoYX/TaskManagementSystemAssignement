package com.tmsbackend.springbootserver.controller;

import java.security.cert.PKIXRevocationChecker.Option;
import java.util.List;
import java.util.Optional;

import javax.swing.RepaintManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tmsbackend.springbootserver.AppConstants;
import com.tmsbackend.springbootserver.components.Pagination;
import com.tmsbackend.springbootserver.entity.Accounts;
import com.tmsbackend.springbootserver.repository.AccountsRepository;
import com.tmsbackend.springbootserver.service.AccountsService;

@RestController
@RequestMapping("")// this the route default path. eg: requestmapping("/api") then in findAll, the route will be localhost/api/findAll
@CrossOrigin(origins = "http://localhost:3000")

public class UserController {
    @Autowired
    private AccountsRepository accRepo;

    private AccountsService accountService;
    
    public UserController(AccountsService accountService){
        this.accountService = accountService;
    
    }
    
    //Using Path Variable
    @GetMapping("/{username}")
    public ResponseEntity<List<Accounts>> findUser(@PathVariable("username") String username){
        return ResponseEntity.ok(accountService.findUser(username));
    }
    //Using Params
    @GetMapping("/")
    public ResponseEntity<List<Accounts>> findUserThroughParam(@RequestParam("username") String username){
        return ResponseEntity.ok(accountService.findUser(username));
    }
 
    
    @GetMapping("/findAll")

    public ResponseEntity<List<Accounts>> searchProducts(String query){
        return ResponseEntity.ok(accountService.findAllUsers(query));
    }
    @GetMapping("/api/users")
    public Pagination getAllUsers(
        @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
        @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
        @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
        @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir
    ){
        return accountService.getAllPosts(pageNo, pageSize, sortBy, sortDir);
    }
    // there are different way of doing insert
    //Method 1: (Using entity to do create function)
    @PostMapping("/api/users/addUser")
    @CrossOrigin(origins = "http://localhost:3000")

    public ResponseEntity createUser(@RequestBody Accounts user){
        Optional<Accounts> newUser= accRepo.findById(user.getUsername());
        // Checking for duplicate username
        if(newUser.isPresent()){
            return ResponseEntity.badRequest().body("Duplicate Username Found!");
        }
        else{
            //insert data into database
            accRepo.save(user);
            return ResponseEntity.ok("Insert successfully");

        }

    }

    @PostMapping("/api/users/addUserWithQuery")
    public ResponseEntity createUserQuery(@RequestBody Accounts user){
        return  ResponseEntity.ok(accountService.createResult(user));
    }

}
