# 🚀 CodeCollab – Real-Time Collaborative Code Editor

CodeCollab is a real-time collaborative coding platform where multiple users can join the same room and write code together live.

It supports:

✅ Real-time code sync  
✅ Multi-user collaboration  
✅ Language-based editor (Java / Python / JavaScript)  
✅ Live chat  
✅ Typing indicator  
✅ Cursor sharing  
✅ Code execution API  
✅ Room-based collaboration  
✅ Spring Boot + Angular + WebSocket architecture  

---

# 📌 Tech Stack

## Frontend
- Angular 20
- TypeScript
- SCSS
- SockJS
- STOMP WebSocket
- Monaco Editor

## Backend
- Java 21
- Spring Boot
- Spring WebSocket
- Spring Data JPA
- Hibernate
- MySQL

---

# 🏗 Project Architecture

Frontend:

```text
Angular UI
↓
SockJS + STOMP
↓
Spring Boot WebSocket
↓
MySQL Database
```

---

# 📂 Project Structure

## Frontend – Angular

```text
collab-code-ui/
│
├── src/
│   ├── app/
│   │   ├── code-editor/
│   │   ├── services/
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│
└── angular.json
```

## Backend – Spring Boot

```text
collab-code-backend/
│
├── controller/
├── model/
├── repository/
├── config/
└── application.properties
```

---

# ⚙️ Features

## 1. Real-Time Code Collaboration

Users can join the same room and edit code together instantly using WebSocket.

Example:

```text
Room: 123
User1 → Madhav
User2 → Friend
```

Both users see live updates.

---

## 2. Language-Based Code Storage

Code is stored separately based on:

- Room ID
- Language

Example:

```text
Room 123 + Java
Room 123 + Python
Room 123 + JavaScript
```

This prevents code mixing.

---

## 3. Chat System

Users can communicate inside room.

Features:

- Instant messages
- Room-based chat
- Live updates

---

## 4. Typing Indicator

Shows:

```text
User is typing...
```

using WebSocket events.

---

## 5. Cursor Sync

Shares cursor movement among users.

---

## 6. Run Code API

Frontend sends:

```json
{
  "code": "...",
  "language": "java"
}
```

Backend executes and returns output.

---

# 🔧 Backend Setup

## Step 1

Open backend folder:

```bash
cd collab-code-backend
```

## Step 2

Configure MySQL in:

```text
application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/collabdb
spring.datasource.username=root
spring.datasource.password=password
```

## Step 3

Run backend:

```bash
mvn spring-boot:run
```

Backend runs:

```text
http://localhost:8080
```

---

# 💻 Frontend Setup

## Step 1

Open frontend folder:

```bash
cd collab-code-ui
```

## Step 2

Install dependencies:

```bash
npm install
```

## Step 3

Run Angular:

```bash
ng serve
```

Frontend runs:

```text
http://localhost:4200
```

---

# 🔥 WebSocket Endpoints

Backend:

```text
/ws
```

Topics:

```text
/topic/code/{roomId}/{language}
/topic/chat/{roomId}
/topic/users/{roomId}
/topic/cursor/{roomId}
/topic/typing/{roomId}
```

App endpoints:

```text
/app/code
/app/chat
/app/cursor
/app/typing
/app/room
```

---

# 🧠 Database Design

Table:

```text
code_snippets
```

Columns:

| Column | Type |
|---|---|
| id | Long |
| roomId | String |
| language | String |
| code | TEXT |

Unique Constraint:

```text
roomId + language
```

---

# 🌍 Multi-Device Access

For same WiFi:

Use:

```bash
ng serve --host 0.0.0.0
```

Access:

```text
http://YOUR-IP:4200
```

For outside network:

Use:

- Tailscale
- Ngrok
- Cloud deployment

---

# 🚀 Future Enhancements

Planned features:

- Authentication
- Video calling
- Voice chat
- Multiple files
- Folder system
- Docker-based secure code execution
- Deployment to cloud
- Invite links
- AI code assistant

---

# 👨‍💻 Author

Madhav Reddy

Java Full Stack Developer

---

# ⭐ Project Goal

To build a real-time collaborative coding platform similar to:

- Google Docs for code
- Replit multiplayer editor
- Live coding interview platforms

using Java Spring Boot and Angular.
