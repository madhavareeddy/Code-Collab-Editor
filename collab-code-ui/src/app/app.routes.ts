import { Routes } from '@angular/router';
import { CodeEditorComponent } from './code-editor/code-editor';
import { JoinRoomComponent } from './join-room/join-room';

export const routes: Routes = [
  {
    path: '',
    component: JoinRoomComponent   // ✅ FIRST PAGE
  },
  {
    path: 'editor/:id',
    component: CodeEditorComponent
  }
];