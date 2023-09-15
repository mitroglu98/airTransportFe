import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  isLoading:boolean = false;
  constructor(private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {}
  
 
  register(name: string, email: string, password: string) {
    this.isLoading = true;

  

    this.apiService.register(name, email, password, 'operator1')
        .subscribe(response => {
            this.isLoading = false;
            
            this.snackBar.open('Successfully registered!', 'Close', {
                duration: 1500
            });

            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 1500);
        },
        error => {
          this.isLoading = false;
      
          let errorMessage = error.error.message; 
      
          if (error.error.errors) {
              const errorFields = Object.keys(error.error.errors); 
              errorMessage = ''; 
              
              errorFields.forEach(field => {
                  errorMessage += error.error.errors[field].join(' ') + ' ';
              });
          }
      
          this.snackBar.open(errorMessage.trim(), 'Close', {
              duration: 3000
          });
      }
    );
}



}
