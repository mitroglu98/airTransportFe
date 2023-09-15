import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/Common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-airplanes',
  templateUrl: './airplanes.component.html',
  styleUrls: ['./airplanes.component.css']
})
export class AirplanesComponent implements OnInit {
  airplanes: any[] = [];
  displayedColumns: string[] = ['name_en', 'name_cg', 'type', 'actions'];
  currentUserRole: string | null = null;


  isLoading: boolean = false;
  isEditing: boolean = false;
  editingAirplaneId: number | null = null;

  airplaneData = {
    name_en: '',
    name_cg: '',
    type: ''
  };
  
  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUserRole = localStorage.getItem('role');
    this.fetchAirplanes();
  }

  fetchAirplanes(): void {
    this.apiService.getAirplanes().subscribe(data => {
      this.airplanes = data;
      
    });
  }

  onSubmit(airplaneForm: any): void {
    if (this.isEditing && this.editingAirplaneId !== null) {
      this.updateAirplane(this.editingAirplaneId);
    } else {
      this.addAirplane(airplaneForm);
    }
  }

  addAirplane(airplaneForm: any): void {
    const payload = {
      ...airplaneForm.value
    };

    this.apiService.addAirplane(payload).subscribe(
      () => {
        this.snackBar.open('Airplane added successfully!', 'Close', { duration: 3000 });
        this.fetchAirplanes();
        airplaneForm.reset();
      },
      error => {
        this.snackBar.open('Error adding airplane', 'Close', { duration: 3000 });
      }
    );
  }

  editAirplane(airplaneId: number): void {
    const airplane = this.airplanes.find(plane => plane.id === airplaneId);
    if (airplane) {
      this.airplaneData.name_en = airplane.name_en;
      this.airplaneData.name_cg = airplane.name_cg;
      this.airplaneData.type = airplane.type;
      this.isEditing = true;
      this.editingAirplaneId = airplaneId;
    }
  }

  updateAirplane(airplaneId: number): void {
    this.apiService.updateAirplane(airplaneId, this.airplaneData).subscribe(
      () => {
        this.snackBar.open('Airplane updated successfully!', 'Close', { duration: 3000 });
        this.fetchAirplanes();
        this.resetForm();
      },
      error => {
        this.snackBar.open('Error updating airplane', 'Close', { duration: 3000 });
      }
    );
  }

  deleteAirplane(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // if user clicked Yes
        this.apiService.deleteAirplane(id).subscribe(
            () => {
                this.snackBar.open('Airplane deleted successfully!', 'Close', {
                    duration: 3000,
                });
                this.fetchAirplanes();  // Refresh the list after deletion
            },
            error => {
                this.snackBar.open('Error deleting airplane', 'Close', {
                    duration: 3000,
                });
            }
        );
      }
    });
  }

  resetForm(): void {
    this.airplaneData = {
      name_en: '',
      name_cg: '',
      type: ''
    };
    this.isEditing = false;
  }
}
