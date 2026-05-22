import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MonacoEditorModule
  ],
  templateUrl: './code-editor.html',
  styleUrls: ['./code-editor.scss']
})
export class CodeEditorComponent implements OnInit, OnDestroy {

  roomId: string = '';
  code: string = '';
  output: string = '';
  selectedLanguage: string = 'java';

  // 🔥 MONACO OPTIONS
  editorOptions = {
    theme: 'vs-dark',
    language: 'java',
    automaticLayout: true,
    fontSize: 16,
    minimap: {
      enabled: false
    }
  };

  users: string[] = [];

  messages: any[] = [];
  newMessage: string = '';
  userName: string = '';

  typingTimeout: any;

  cursorPosition: any = null;

  saveStatus: string = 'Saved ✅';

  typingUser: string = '';
  typingClearTimer: any;

  constructor(
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private http: HttpClient
  ) {}

  // ✅ INIT
  ngOnInit(): void {

    this.roomId =
      this.route.snapshot.paramMap.get('id') || '';

    this.userName =
      this.route.snapshot.queryParamMap.get('user') || 'Guest';

    console.log('👤 USER:', this.userName);

    // 🔥 LOAD SAVED CODE
    this.loadSavedCode();

    // 🔥 CONNECT SOCKET
    this.connectSocket();
  }

  // ❌ DESTROY
  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  // 🔥 SOCKET CONNECT
  connectSocket() {

    console.log(
      '📡 CONNECT:',
      this.roomId,
      this.selectedLanguage
    );

    this.websocketService.connect(
      this.roomId,
      this.userName,
      this.selectedLanguage,
      (msg: any) => {

        // 🔥 CODE SYNC
        if (msg.type === 'code') {

          console.log('📥 SYNC:', msg.data);

          if (msg.data === this.code) return;

          this.code = msg.data;
        }

        // 👥 USERS
        else if (msg.type === 'users') {
          this.users = msg.data;
        }

        // 💬 CHAT
        else if (msg.type === 'chat') {
          this.messages.push(msg.data);
        }

        // 🟢 CURSOR
        else if (msg.type === 'cursor') {
          this.cursorPosition = msg.data;
        }

        // 🔥 TYPING
        else if (msg.type === 'typing') {

          if (msg.data !== this.userName) {

            this.typingUser =
              msg.data + ' is typing...';

            clearTimeout(this.typingClearTimer);

            this.typingClearTimer = setTimeout(() => {
              this.typingUser = '';
            }, 1000);
          }
        }
      }
    );
  }

  // 🔥 LOAD DB CODE
  loadSavedCode(): void {

    console.log(
      '📥 LOAD:',
      this.roomId,
      this.selectedLanguage
    );

    this.http.get(
      `http://100.69.38.25:8080/code/${this.roomId}/${this.selectedLanguage}`,
      { responseType: 'text' }
    ).subscribe({

      next: (res) => {

        console.log('💾 LOADED:', res);

        this.code = res || '';
      },

      error: () => {

        console.log('⚠️ NO SAVED CODE');

        this.code = '';
      }
    });
  }

  // 🔥 LANGUAGE CHANGE
  onLanguageChange() {

    console.log(
      '🔄 LANGUAGE:',
      this.selectedLanguage
    );

    // 🔥 MONACO LANGUAGE CHANGE
    this.editorOptions = {
      ...this.editorOptions,
      language: this.selectedLanguage
    };

    // 🔥 CLEAR
    this.code = '';

    // 🔥 DISCONNECT OLD
    this.websocketService.disconnect();

    // 🔥 LOAD NEW CODE
    this.loadSavedCode();

    // 🔥 RECONNECT
    setTimeout(() => {
      this.connectSocket();
    }, 300);
  }

  // 🔥 CODE CHANGE
  onCodeChange(newCode: string): void {

    this.code = newCode;

    this.saveStatus = 'Saving... ⏳';

    // 🔥 TYPING
    this.websocketService.sendTyping(
      this.roomId,
      this.userName
    );

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {

      console.log('📤 SEND:', newCode);

      this.websocketService.sendCode(
        this.roomId,
        newCode,
        this.selectedLanguage
      );

      this.saveStatus = 'Saved ✅';

    }, 200);
  }

  // 🟢 CURSOR
  onCursorMove(event: any): void {

    const position =
      event.target.selectionStart;

    this.websocketService.sendCursor(
      this.roomId,
      {
        position,
        user: this.userName
      }
    );
  }

  // 💬 CHAT
  sendChat(): void {

    if (!this.newMessage.trim()) return;

    this.websocketService.sendMessage(
      this.roomId,
      this.userName,
      this.newMessage
    );

    this.newMessage = '';
  }

  // ▶️ RUN CODE
  runCode(): void {

    this.http.post(
      'http://localhost:8080/run',
      {
        code: this.code,
        language: this.selectedLanguage
      },
      { responseType: 'text' }

    ).subscribe({

      next: (res) => {
        this.output = res;
      },

      error: () => {
        this.output = 'Error running code ❌';
      }
    });
  }
}