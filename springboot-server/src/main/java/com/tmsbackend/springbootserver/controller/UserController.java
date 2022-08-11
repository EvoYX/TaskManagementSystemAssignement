package com.tmsbackend.springbootserver.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tmsbackend.springbootserver.entity.Accounts;
import com.tmsbackend.springbootserver.service.AccountsService;

@RestController
@RequestMapping("")
public class UserController {
    private AccountsService accountService;
    public UserController(AccountsService accountService){
        this.accountService = accountService;
    
    }
    @GetMapping("/")
    public ResponseEntity<List<Accounts>> findUser(@RequestParam("username") String query){
        return ResponseEntity.ok(accountService.findUser(query));
    }
    
    @GetMapping("/findAll")
    public ResponseEntity<List<Accounts>> searchProducts(String query){
        return ResponseEntity.ok(accountService.findAllUsers(query));
    }
    

}
