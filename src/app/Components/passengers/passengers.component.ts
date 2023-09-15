import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/Common/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.css']
})
export class PassengersComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  passengers: any[] = [];
  userRole: string = localStorage.getItem('role') || '';
  isLoading: boolean = false;
  isEditing: boolean = false;
  selectedPassengerId: number | null = null;

  displayedColumns: string[] = ['firstName', 'lastName'];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private matDialog: MatDialog) {
    if (this.userRole === 'operator2') {
      this.displayedColumns.push('actions');
    }
  }

  ngOnInit(): void {
    console.log(this.userRole);
    this.fetchPassengers();
  }

  fetchPassengers(): void {
    this.apiService.getPassengers().subscribe(data => {
      this.passengers = data;
    });
  }

  savePassenger(): void {
    const passengerData = {
      first_name: this.firstName,
      last_name: this.lastName
    };
    
    if (this.isEditing && this.selectedPassengerId) {
      this.updatePassenger(this.selectedPassengerId, passengerData);
    } else {
      this.addPassenger(passengerData);
    }
  }

  addPassenger(data: any): void {
    this.isLoading = true;
    this.apiService.addPassenger(data).subscribe(
      () => {
        this.fetchPassengers();
        this.isLoading = false;
        this.snackBar.open('Passenger added successfully', 'Close', { duration: 3000 });
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error adding the passenger. Please try again.', 'Close', { duration: 3000 });
        console.error('Error adding passenger: ', error);
      }
    );
  }

  editPassenger(passenger: any): void {
    this.firstName = passenger.first_name;
    this.lastName = passenger.last_name;
    this.isEditing = true;
    this.selectedPassengerId = passenger.id;
  }

  updatePassenger(id: number, data: any): void {
    this.isLoading = true;
    this.apiService.updatePassenger(id, data).subscribe(
      () => {
        this.fetchPassengers();
        this.snackBar.open('Passenger updated successfully', 'Close', {
          duration: 3000
        });
        this.resetForm();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error updating the passenger. Please try again.', 'Close', { duration: 3000 });
        console.error('Error updating passenger: ', error);
      }
    );
  }
  
  
  deletePassenger(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this passenger?"
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.apiService.deletePassenger(id).subscribe(() => {
          this.fetchPassengers();
          this.snackBar.open('Passenger deleted successfully', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        });
      }
    });
  }
  
  resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.isEditing = false;
    this.selectedPassengerId = null;
  }
}
