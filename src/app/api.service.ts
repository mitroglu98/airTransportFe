import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlightDetails } from './Models/flight-details';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      })
    );
  }

  register(name: string, email: string, password: string, role: string): Observable<any> {
    const body = { name, email, password, role };
    return this.http.post(`${this.apiUrl}/register`, body);
  }
  getPassengerFirstName(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/passengers/first-name`, { headers: headers });
  }  
  addAirplane(airplaneData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/airplanes`, airplaneData, { headers: headers });
  }

  updateAirplane(id: number, airplaneData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/airplanes/${id}`, airplaneData, { headers: headers });
  }

  getAirplanes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/airplanes`, { headers: headers });
  }

  deleteAirplane(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/airplanes/${id}`, { headers: headers });
  }

  getFlightDetails(flightId: number): Observable<FlightDetails> {
    const headers = this.getAuthHeaders();
    return this.http.get<FlightDetails>(`${this.apiUrl}/flights/${flightId}/details`, { headers: headers });
  }

  updateFlightDetails(flightId: number, details: FlightDetails): Observable<FlightDetails> {
    const headers = this.getAuthHeaders();
    return this.http.put<FlightDetails>(`${this.apiUrl}/flights/${flightId}/details`, details, { headers: headers });
  }
  getCrews(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/crews`, { headers: headers });
  }
  
  addCrew(crewData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/crews`, crewData, { headers: headers });
  }
  
  deleteCrew(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/crews/${id}`, { headers: headers });
  }
  
  updateCrew(id: number, crewData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/crews/${id}`, crewData, { headers: headers });
  }

  getPassengers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/passengers`, { headers: headers });
  }
  



  getCosts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/costs`, { headers: headers });
  }

  addCost(costData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/costs`, costData, { headers: headers });
  }

  deleteCost(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/costs/${id}`, { headers: headers });
  }

  updateCost(id: number, costData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/costs/${id}`, costData, { headers: headers });
  }
  getFlights(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/flights`, { headers: headers });
}

addFlight(flightData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/flights`, flightData, { headers: headers });
}

updateFlight(id: number, flightData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/flights/${id}`, flightData, { headers: headers });
}

deleteFlight(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/flights/${id}`, { headers: headers });
}
getPassengersForFlight(flightId: number): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(`${this.apiUrl}/flights/${flightId}/passengers`, { headers: headers });
}

addPassenger(passengerData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.apiUrl}/passengers`, passengerData, { headers: headers });
}

updatePassenger(passengerId: number, passengerData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.put(`${this.apiUrl}/passengers/${passengerId}`, passengerData, { headers: headers });
}

deletePassenger(passengerId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.apiUrl}/passengers/${passengerId}`, { headers: headers });
}
addPassengerToFlight(passengerId: number, flightId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  const body = { passenger_id: passengerId };
  return this.http.post(`${this.apiUrl}/flights/${flightId}/passengers`, body, { headers: headers });
}
}
