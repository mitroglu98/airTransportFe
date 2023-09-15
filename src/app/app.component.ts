import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userName: any;
  userRole: any;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.userName = localStorage.getItem('username');
    this.userRole = localStorage.getItem('role');
    if (token) {
      this.isLoggedIn = true;
  
    }
  }
 
  
  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
