import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.css']
})
export class FlightDetailsComponent implements OnInit {
  flight: any = {};
  passengers: any[] = [];
  isLoading = false;
  flightId: any = 0;
  showPassengerDialog = false;
  editPassenger = false;
  passengerData: any = {};
  availablePassengers: any[] = [];
  selectedPassengerId: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { flightId: any },
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.flightId = parseInt(this.data.flightId.id);
    this.loadAvailablePassengers();
  }
  
  


  loadPassengers() {
    this.isLoading = true;
    this.apiService.getPassengersForFlight(this.flightId).subscribe(
      (passengers) => {
        this.passengers = passengers;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  addPassengerToFlight() {
    if (this.selectedPassengerId) {
      this.apiService.addPassengerToFlight(this.selectedPassengerId, this.flightId).subscribe(
        () => {
          this.loadPassengers();
          this.showSuccessMessage('Passenger added to flight successfully');
        },
        (error) => {
          console.error(error);
          this.showErrorMessage('This passenger already exist on this flight');
        }
      );
    }
  }

  loadAvailablePassengers() {
    this.isLoading = true;
    this.apiService.getPassengers().subscribe(
      (passengers) => {
        this.availablePassengers = passengers;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  openPassengerDialog(passenger: any) {
    if (passenger) {
      // Editing existing passenger
      this.editPassenger = true;
      this.passengerData = { ...passenger };
    } else {
      // Adding a new passenger
      this.editPassenger = false;
      this.passengerData = {};
    }
    this.showPassengerDialog = true;
  }

  savePassenger() {
    if (this.editPassenger) {
      // Update existing passenger
      this.apiService.updatePassenger(this.passengerData.id, this.passengerData).subscribe(
        () => {
          this.showPassengerDialog = false;
          this.loadPassengers();
          this.showSuccessMessage('Passenger updated successfully');
        },
        (error) => {
          console.error(error);
          this.showErrorMessage('Error updating passenger');
        }
      );
    } else {
      // Add a new passenger
      this.apiService.addPassenger({ ...this.passengerData, flight_id: this.flightId }).subscribe(
        () => {
          this.showPassengerDialog = false;
          this.loadPassengers();
          this.showSuccessMessage('Passenger added successfully');
        },
        (error) => {
          console.error(error);
          this.showErrorMessage('Error adding passenger');
        }
      );
    }
  }

  cancelPassenger() {
    this.showPassengerDialog = false;
    this.editPassenger = false;
    this.passengerData = {};
  }


  private showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 1000);
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 1000);
  }
}
