package com.codinggoline.userservice.repository;

import com.codinggoline.userservice.entity.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends Neo4jRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPseudo(String pseudo);

    boolean existsByEmail(String email);

    @Query("MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie) RETURN m, r")
    Object findUserRatings(String userId);
}
