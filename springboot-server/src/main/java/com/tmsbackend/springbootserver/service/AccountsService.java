package com.tmsbackend.springbootserver.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.tmsbackend.springbootserver.components.Pagination;
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
    public boolean createResult(Accounts user){
        boolean result = accountRepository.createNewUser(user);
        return result;
    }

    public Pagination getAllPosts(int pageNo, int pageSize, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // create Pageable instance
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Accounts> accounts = accountRepository.findAll(pageable);
        System.out.println(accounts);

        // get content for page object
        List<Accounts> listOfAccounts = accounts.getContent();

        // List<Accounts> content= listOfAccounts.stream().map(post -> mapToDTO(post)).collect(Collectors.toList());

        Pagination result = new Pagination();
        result.setContent(listOfAccounts);
        result.setPageNo(accounts.getNumber());
        result.setPageSize(accounts.getSize());
        result.setTotalElements(accounts.getTotalElements());
        result.setTotalPages(accounts.getTotalPages());
        result.setLast(accounts.isLast());

        return result;
    }
    // List<Accounts> findAllUsers(String query);

    
}
