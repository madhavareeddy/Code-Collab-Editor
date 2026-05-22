package com.collab.collab_code_backend.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "code_snippets",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"roomId", "language"})
    }
)
public class CodeSnippet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomId;

    @Column(nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT")
    private String code;

    // ✅ Default constructor
    public CodeSnippet() {}

    // ✅ Constructor
    public CodeSnippet(String roomId, String language, String code) {
        this.roomId = roomId;
        this.language = language;
        this.code = code;
    }

    // 🔹 GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "CodeSnippet{" +
                "id=" + id +
                ", roomId='" + roomId + '\'' +
                ", language='" + language + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
}