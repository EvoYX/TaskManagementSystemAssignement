package com.tmsbackend.springbootserver.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tmsbackend.springbootserver.entity.Accounts;
import com.tmsbackend.springbootserver.repository.AccountsRepository;

@Service
public class AccountsService {

    private AccountsRepository accountRepository;

    public AccountsService(AccountsRepository accountRepository){
        this.accountRepository = accountRepository;
    }
    public List<Accounts> findAllUsers(String query){
        List<Accounts> users= accountRepository.findAllUser(query);
        return users;
    }
    public List<Accounts> findUser(String query){
        List<Accounts> user=accountRepository.findByUsername(query);
        return user;
    }
    // List<Accounts> findAllUsers(String query);

    
}
