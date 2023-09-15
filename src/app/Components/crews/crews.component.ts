import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/Common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-crews',
  templateUrl: './crews.component.html',
  styleUrls: ['./crews.component.css']
})
export class CrewsComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  position: string = '';
  crews: any[] = [];
  userRole: string = localStorage.getItem('role') || '';
  isLoading: boolean = false;
  isEditing: boolean = false;
  selectedCrewId: number | null = null;

  displayedColumns: string[] = ['firstName', 'lastName', 'position'];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchCrews();
    if (this.userRole === 'operator2') {
      this.displayedColumns.push('actions');
    }
  }

  fetchCrews(): void {
    this.apiService.getCrews().subscribe(data => {
      this.crews = data;
    });
  }

  saveCrew(): void {
    this.isLoading = true; 

    const crewData = {
      first_name: this.firstName,
      last_name: this.lastName,
      position: this.position
    };

    if (this.isEditing && this.selectedCrewId !== null) {
      this.apiService.updateCrew(this.selectedCrewId, crewData).subscribe(
        () => this.handleSuccess('Crew updated successfully'),
        error => this.handleError(error)
      );
    } else {
      this.apiService.addCrew(crewData).subscribe(
        () => this.handleSuccess('Crew added successfully'),
        error => this.handleError(error)
      );
    }
  }

  handleSuccess(message: string): void {
    this.fetchCrews();
    this.isLoading = false;
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.resetForm();
  }

  handleError(error: any): void {
    this.isLoading = false;
    this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
    console.error('Error:', error);
  }

  editCrew(crew: any): void {
    this.firstName = crew.first_name;
      this.lastName = crew.last_name;
      this.position = crew.position;
    this.isEditing = true;
    this.selectedCrewId = crew.id;
  }

  deleteCrew(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this crew member?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.apiService.deleteCrew(id).subscribe(
          () => this.handleSuccess('Crew deleted successfully'),
          error => this.handleError(error)
        );
      }
    });
  }

  resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.position = '';
    this.isEditing = false;
    this.selectedCrewId = null;
  }
}
