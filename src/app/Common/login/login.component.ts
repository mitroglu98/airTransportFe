import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  isLoading: boolean = false;
  
  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {}

  login(email: string, password: string) {
    this.isLoading = true;
  
    this.apiService.login(email, password)
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.user.name);
        localStorage.setItem('role', response.user.role);
        this.isLoading = false; 

        this.router.navigate(['/airplanes']).then(() => {
          window.location.reload();
        });
      },
      error => {
        this.isLoading = false;
        this.snackBar.open(error.error.error, 'Close', {
          duration: 3000
        });
      });
  }
  

}
