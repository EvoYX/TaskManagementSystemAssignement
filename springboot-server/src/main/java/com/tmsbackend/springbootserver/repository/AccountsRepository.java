 package com.tmsbackend.springbootserver.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tmsbackend.springbootserver.entity.Accounts;

@Repository
// we put String for datatype because the primary key for Accounts table is long
public interface AccountsRepository extends JpaRepository<Accounts,String> {

    @Query(value ="SELECT * FROM accounts",nativeQuery = true)
    List<Accounts> findAllUser(String query);

    @Query(value="SELECT * FROM accounts WHERE username = :query",nativeQuery=true)
    List<Accounts> findByUsername(String query);

    @Query(value = "INSERT INTO accounts (username,email,password,status,user_group) values(testing,test,j,s,us)",nativeQuery = true)
    Boolean createNewUser(Accounts user);
}