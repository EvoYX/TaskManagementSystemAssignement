 package com.tmsbackend.springbootserver.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tmsbackend.springbootserver.entity.Accounts;
 
// we put String for datatype because the primary key for Accounts table is long
public interface AccountsRepository extends JpaRepository<Accounts,String> {

    @Query(value ="SELECT * FROM accounts",nativeQuery = true)
    List<Accounts> findAllUser(String query);

    @Query(value="SELECT * FROM accounts WHERE username = :query",nativeQuery=true)
    List<Accounts> findByUsername(String query);



}