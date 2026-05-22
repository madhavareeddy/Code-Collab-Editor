package com.collab.collab_code_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class RoomController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 👥 USERS PER ROOM
    private Map<String, Set<String>> usersPerRoom = new ConcurrentHashMap<>();

    // 👥 JOIN ROOM
    @MessageMapping("/room")
    public void joinRoom(Map<String, String> data) {

        String roomId = data.get("roomId");
        String user = data.get("user");

        if (roomId == null || user == null) return;

        // ✅ create room if not exists
        usersPerRoom.computeIfAbsent(roomId, k -> new HashSet<>());

        // ✅ avoid duplicates
        usersPerRoom.get(roomId).add(user);

        System.out.println("👤 User joined: " + user + " in room: " + roomId);

        // 🔥 send updated users list
        messagingTemplate.convertAndSend(
                "/topic/users/" + roomId,
                usersPerRoom.get(roomId)
        );
    }

    // 💬 CHAT
    @MessageMapping("/chat")
    public void sendMessage(Map<String, String> message) {

        String roomId = message.get("roomId");

        if (roomId == null) return;

        System.out.println("💬 Chat: " + message);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + roomId,
                message
        );
    }

    // 🔥 TYPING INDICATOR (NEW)
    @MessageMapping("/typing")
    public void typing(Map<String, String> data) {

        String roomId = data.get("roomId");
        String user = data.get("user");

        if (roomId == null || user == null) return;

        // 🔥 send only username
        messagingTemplate.convertAndSend(
                "/topic/typing/" + roomId,
                user
        );
    }
}