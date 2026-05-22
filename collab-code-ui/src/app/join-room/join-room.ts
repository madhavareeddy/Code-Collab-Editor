import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './join-room.html'
})
export class JoinRoomComponent {

  roomId: string = '';
  userName: string = '';   // 🔥 NEW ADD

  constructor(private router: Router) {}

  joinRoom() {

    if (!this.roomId.trim() || !this.userName.trim()) return;

    // 🔥 PASS USERNAME AS QUERY PARAM
    this.router.navigate(['/editor', this.roomId], {
      queryParams: { user: this.userName }
    });
  }
}