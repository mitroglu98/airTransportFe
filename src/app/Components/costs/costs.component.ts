import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/Common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.css']
})
export class CostsComponent implements OnInit {
  cost: any = {
    amount: 0,
    description: '',
    fuel_cost: 0,
    crew_cost: 0,
    service_cost: 0,
  };
  costs: any[] = [];
  userRole: string = localStorage.getItem('role') || '';
  isLoading: boolean = false;
  isEditing: boolean = false;
  selectedCostId: number | null = null;

  displayedColumns: string[] = ['amount', 'description', 'fuel_cost', 'crew_cost', 'service_cost'];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private matDialog: MatDialog) {
    if (this.userRole === 'operator1' || this.userRole === 'operator2') {
      this.displayedColumns.push('actions');
    }
  }

  ngOnInit(): void {
    this.fetchCosts();
  }

  fetchCosts(): void {
    this.apiService.getCosts().subscribe(data => {
      this.costs = data;
    });
  }

  saveCost(): void {
    if (this.isEditing && this.selectedCostId) {
      this.updateCost(this.selectedCostId, this.cost);
    } else {
      this.addCost(this.cost);
    }
  }

  addCost(data: any): void {
    this.isLoading = true;
    this.apiService.addCost(data).subscribe(
      () => {
        this.fetchCosts();
        this.isLoading = false;
        this.snackBar.open('Cost added successfully', 'Close', { duration: 3000 });
        this.resetForm();
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error adding the cost. Please try again.', 'Close', { duration: 3000 });
        console.error('Error adding cost: ', error);
      }
    );
  }

  editCost(cost: any): void {
    this.cost = { ...cost };
    this.isEditing = true;
    this.selectedCostId = cost.id;
  }

  updateCost(id: number, data: any): void {
    this.isLoading = true;
    this.apiService.updateCost(id, data).subscribe(
      () => {
        this.fetchCosts();
        this.snackBar.open('Cost updated successfully', 'Close', { duration: 3000 });
        this.resetForm();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error updating the cost. Please try again.', 'Close', { duration: 3000 });
        console.error('Error updating cost: ', error);
      }
    );
  }

  deleteCost(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this cost?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.apiService.deleteCost(id).subscribe(() => {
          this.fetchCosts();
          this.snackBar.open('Cost deleted successfully', 'Close', { duration: 3000 });
          this.isLoading = false;
        });
      }
    });
  }

  resetForm(): void {
    this.cost = {
      amount: 0,
      description: '',
      fuel_cost: 0,
      crew_cost: 0,
      service_cost: 0,
    };
    this.isEditing = false;
    this.selectedCostId = null;
  }
}
