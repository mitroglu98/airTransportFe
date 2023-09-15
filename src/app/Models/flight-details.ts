export interface FlightDetails {
    id: string;
    passengers: Passenger[];
    costs: Cost[];
    crews: Crew[];
  }
  export interface Flight {
    id: number;
    destination_from: string;
    destination_to: string;
  }
  export interface Passenger {
    id: string;
    first_name: string;
    last_name: string;
  }
  
  export interface Cost {
    id: string;
    amount: number;
    description: string;
  }
  
  export interface Crew {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
  }
  