package com.collab.collab_code_backend.repository;

import com.collab.collab_code_backend.model.CodeSnippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeRepository extends JpaRepository<CodeSnippet, Long> {

    // 🔥 Find by Room + Language
    Optional<CodeSnippet> findByRoomIdAndLanguage(String roomId, String language);
}