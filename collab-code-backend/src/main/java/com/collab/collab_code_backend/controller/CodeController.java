package com.collab.collab_code_backend.controller;

import com.collab.collab_code_backend.model.CodeSnippet;
import com.collab.collab_code_backend.repository.CodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CodeController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private CodeRepository codeRepository;

    // 🔥 CODE SYNC + SAVE (FINAL CORRECT)
    @MessageMapping("/code")
    public void sendCode(Map<String, String> data) {

        String roomId = data.get("roomId");
        String code = data.get("code");
        String language = data.get("language");

        if (roomId == null || code == null || language == null) return;

        System.out.println("🔥 SAVE → Room: " + roomId + " | Lang: " + language);

        // 🔥 CHECK EXISTING (IMPORTANT)
        CodeSnippet snippet = codeRepository
                .findByRoomIdAndLanguage(roomId, language)
                .orElse(new CodeSnippet());

        // 🔥 UPDATE DATA
        snippet.setRoomId(roomId);
        snippet.setLanguage(language);
        snippet.setCode(code);

        codeRepository.save(snippet);

        // 🔥 SEND TO USERS
        messagingTemplate.convertAndSend(
                "/topic/code/" + roomId + "/" + language,
                code
        );
    }

    // 🟢 CURSOR SYNC
    @MessageMapping("/cursor")
    public void sendCursor(Map<String, Object> data) {

        String roomId = (String) data.get("roomId");

        if (roomId == null) return;

        messagingTemplate.convertAndSend(
                "/topic/cursor/" + roomId,
                data
        );
    }

    // 📥 LOAD CODE FROM DB (FINAL CORRECT)
    @GetMapping("/code/{roomId}/{language}")
    public String getCode(
            @PathVariable String roomId,
            @PathVariable String language) {

        System.out.println("📥 LOAD → Room: " + roomId + " | Lang: " + language);

        return codeRepository
                .findByRoomIdAndLanguage(roomId, language)
                .map(CodeSnippet::getCode)
                .orElse("");
    }
}