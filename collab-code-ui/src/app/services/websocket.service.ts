import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient!: Client;

  // ✅ CONNECT
  connect(
    roomId: string,
    userName: string,
    language: string,
    callback: (msg: any) => void
  ) {

    // 🔥 CLOSE OLD SOCKET
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (e) {
        console.log("Old socket already closed");
      }
    }

    // 🔥 CREATE NEW SOCKET
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://100.69.38.25:8080/ws'),
      reconnectDelay: 5000
    });

    // ✅ CONNECTED
    this.stompClient.onConnect = () => {

      console.log(`✅ CONNECTED → Room: ${roomId}, Lang: ${language}`);

      // 🔥 CODE TOPIC
      const codeTopic = `/topic/code/${roomId}/${language}`;

      console.log("📡 SUBSCRIBED:", codeTopic);

      this.stompClient.subscribe(codeTopic, (message: IMessage) => {

        console.log("📥 CODE RECEIVED:", message.body);

        callback({
          type: 'code',
          data: message.body
        });
      });

      // 👥 USERS
      this.stompClient.subscribe(`/topic/users/${roomId}`, (message: IMessage) => {

        callback({
          type: 'users',
          data: JSON.parse(message.body)
        });
      });

      // 💬 CHAT
      this.stompClient.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {

        callback({
          type: 'chat',
          data: JSON.parse(message.body)
        });
      });

      // 🟢 CURSOR
      this.stompClient.subscribe(`/topic/cursor/${roomId}`, (message: IMessage) => {

        callback({
          type: 'cursor',
          data: JSON.parse(message.body)
        });
      });

      // 🔥 TYPING
      this.stompClient.subscribe(`/topic/typing/${roomId}`, (message: IMessage) => {

        callback({
          type: 'typing',
          data: message.body
        });
      });

      // 👥 JOIN ROOM
      this.joinRoom(roomId, userName);
    };

    // ❌ ERRORS
    this.stompClient.onStompError = (frame) => {
      console.error("❌ STOMP ERROR:", frame);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error("❌ SOCKET ERROR:", error);
    };

    // 🚀 START
    this.stompClient.activate();
  }

  // ✅ SEND CODE
  sendCode(roomId: string, code: string, language: string) {

    if (!this.stompClient || !this.stompClient.connected) {
      console.log("❌ SOCKET NOT CONNECTED");
      return;
    }

    console.log("📤 SEND CODE:", roomId, language);

    this.stompClient.publish({
      destination: '/app/code',
      body: JSON.stringify({
        roomId,
        code,
        language
      })
    });
  }

  // 👥 JOIN ROOM
  joinRoom(roomId: string, user: string) {

    if (!this.stompClient || !this.stompClient.connected) return;

    this.stompClient.publish({
      destination: '/app/room',
      body: JSON.stringify({
        roomId,
        user
      })
    });
  }

  // 💬 SEND CHAT
  sendMessage(roomId: string, user: string, text: string) {

    if (!this.stompClient || !this.stompClient.connected) return;

    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify({
        roomId,
        user,
        text
      })
    });
  }

  // 🟢 CURSOR
  sendCursor(roomId: string, cursor: any) {

    if (!this.stompClient || !this.stompClient.connected) return;

    this.stompClient.publish({
      destination: '/app/cursor',
      body: JSON.stringify({
        roomId,
        position: cursor.position,
        user: cursor.user
      })
    });
  }

  // 🔥 TYPING
  sendTyping(roomId: string, user: string) {

    if (!this.stompClient || !this.stompClient.connected) return;

    this.stompClient.publish({
      destination: '/app/typing',
      body: JSON.stringify({
        roomId,
        user
      })
    });
  }

  // ❌ DISCONNECT
  disconnect() {

    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("❌ DISCONNECTED");
    }
  }
}