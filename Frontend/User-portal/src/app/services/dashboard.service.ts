import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTowers() {
    return this.http.get<any[]>(`${this.API_URL}/towers/`);
  }

  getUnits() {
    return this.http.get<any[]>(`${this.API_URL}/units/`);
  }

  //getUnitsByTower(towerId: number) {
    //return this.http.get<any[]>(
      //`${this.API_URL}/units/units-by-tower/${towerId}`
   // );
  //}
  // dashboard.service.ts
getUnitDetails(unitId: number) {
  return this.http.get<any>(
    `${this.API_URL}/units/details/${unitId}`
  );
}

getProfile() {
    return this.http.get(`${this.API_URL}/auth/me`);
  }

  getBookings() {
    return this.http.get<any[]>(`${this.API_URL}/bookings/`);
  }

  getLeases() {
    return this.http.get<any[]>(`${this.API_URL}/lease/`);
  }

  getPayments() {
    return this.http.get<any[]>(`${this.API_URL}/lease/my-payments`);
  }

  bookUnit(unitId: number, startDate?: string, endDate?: string) {
    return this.http.post(
      `${this.API_URL}/bookings/unit`,
      {
        unit_id: unitId,
        start_date: startDate,
        end_date: endDate
      }
    );
  }
}
