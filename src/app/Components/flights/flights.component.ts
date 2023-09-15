import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/Common/confirmation-dialog/confirmation-dialog.component';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { FlightDetailsComponent } from '../flight-details/flight-details.component';
@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  airplanes: any[] = [];
  destination_from: string = '';
  destination_to: string = '';
  departure_date: Date | null = null;
  departure_time: string = '';
  arrival_date: Date | null = null;
  arrival_time: string = '';
  airplane_id: string = '';
  flights: any[] = [];
  userRole: string = localStorage.getItem('role') || '';
  isLoading: boolean = false;
  isEditing: boolean = false;
  selectedFlightId: number | null = null;
  formSubmitted: boolean = false;

  displayedColumns: string[] = ['destination_from', 'destination_to', 'departure_time', 'arrival_time', 'airplane', 'actions'];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchAirplanes();
    this.fetchFlights();
  }

  fetchAirplanes(): void {
    this.apiService.getAirplanes().subscribe(data => {
      this.airplanes = data;
    });
  }
  openFlightDetails(flightId: number): void {
    const dialogRef = this.matDialog.open(FlightDetailsComponent, {
      data: { flightId: flightId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("aaaa", result, flightId)
      }
    });
  }
  


 
  fetchFlights() {
    this.isLoading = true;
    this.apiService.getFlights().subscribe((flights) => {
      this.flights = flights;
      this.isLoading = false;
    });
  }
  saveFlight(): void {
    this.formSubmitted = true;
    if (!this.isFormValid()) {
      return;
    }

    const formattedDepartureDateTime = this.formatDateAndTime(this.departure_date, this.departure_time);
    const formattedArrivalDateTime = this.formatDateAndTime(this.arrival_date, this.arrival_time);

    if (!formattedDepartureDateTime || !formattedArrivalDateTime) {
      return;
    }

    const flightData = {
      destination_from: this.destination_from,
      destination_to: this.destination_to,
      departure_datetime: formattedDepartureDateTime,
      arrival_datetime: formattedArrivalDateTime,
      airplane_id: this.airplane_id
    };

    if (this.isEditing && this.selectedFlightId) {
      this.updateFlight(this.selectedFlightId, flightData);
    } else {
      this.addFlight(flightData);
    }
  }
 
  addFlight(data: any): void {
    this.isLoading = true;
    this.apiService.addFlight(data).subscribe(
      () => {
        this.fetchFlights();
        this.isLoading = false;
        this.snackBar.open('Flight added successfully', 'Close', { duration: 3000 });
        this.resetForm();
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error adding the flight. Please try again.', 'Close', { duration: 3000 });
        console.error('Error adding flight: ', error);
      }
    );
  }

  editFlight(flight: any): void {
    this.destination_from = flight.destination_from;
    this.destination_to = flight.destination_to;
    this.airplane_id = flight.airplane_id;
    this.isEditing = true;
    this.selectedFlightId = flight.id;

    if (flight.departure_datetime && flight.arrival_datetime) {
      const departureDateTimeParts = flight.departure_datetime.split(' ');
      this.departure_date = new Date(departureDateTimeParts[0]);
      this.departure_time = departureDateTimeParts[1];

      const arrivalDateTimeParts = flight.arrival_datetime.split(' ');
      this.arrival_date = new Date(arrivalDateTimeParts[0]);
      this.arrival_time = arrivalDateTimeParts[1];
    }
  }

  updateFlight(id: number, data: any): void {
    this.isLoading = true;
    this.apiService.updateFlight(id, data).subscribe(
      () => {
        this.fetchFlights();
        this.snackBar.open('Flight updated successfully', 'Close', {
          duration: 3000
        });
        this.resetForm();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error updating the flight. Please try again.', 'Close', { duration: 3000 });
        console.error('Error updating flight: ', error);
      }
    );
  }

  deleteFlight(id: number): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this flight?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.apiService.deleteFlight(id).subscribe(() => {
          this.fetchFlights();
          this.snackBar.open('Flight deleted successfully', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        });
      }
    });
  }

  resetForm(): void {
    this.destination_from = '';
    this.destination_to = '';
    this.departure_date = null;
    this.departure_time = '';
    this.arrival_date = null;
    this.arrival_time = '';
    this.airplane_id = '';
    this.isEditing = false;
    this.selectedFlightId = null;
    this.formSubmitted = false;
  }

  onTimeSet(event: any, field: string) {
    if (field === 'departure') {
      this.departure_time = event;
    } else if (field === 'arrival') {
      this.arrival_time = event;
    }
  }

  formatDateAndTime(date: Date | null, time: string): string {
    if (!date || !time) {
      return '';
    }
    const formattedDate = new Date(date);
    const hoursMinutes = time.split(':');
    formattedDate.setHours(parseInt(hoursMinutes[0], 10));
    formattedDate.setMinutes(parseInt(hoursMinutes[1], 10));
    formattedDate.setSeconds(0);
    return formattedDate.toISOString().slice(0, 19).replace('T', ' ');
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  isFormValid(): boolean {
    return (
      this.destination_from.trim() !== '' &&
      this.destination_to.trim() !== '' &&
      !!this.departure_date &&
      this.departure_time.trim() !== '' &&
      !!this.arrival_date &&
      this.arrival_time.trim() !== ''
    );
  }

  getAirplaneName(airplaneId: number): string {
    const airplane = this.airplanes.find((a) => a.id === airplaneId);
    return airplane ? airplane.name_en : 'Unknown';
  }
}
