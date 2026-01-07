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

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/auth/users`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/auth/update/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/auth/delete/${id}`);
  }

  // CREATE
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/bookings/create`, data);
  }

  // READ ALL
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/bookings/`);
  }

  // READ ONE
  getBookingById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/bookings/get/${id}`);
  }

  // UPDATE (ADMIN)
  updateBooking(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/bookings/update/${id}`, data);
  }

  // DELETE (optional)
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/bookings/delete/${id}`);
  }
  
  getTowers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/towers/`);
  }

  // CREATE tower
  createTower(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/towers/create`, data);
  }

  // GET single tower
  getTowerById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/towers/get/${id}`);
  }

  // UPDATE tower
  updateTower(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/towers/update/${id}`, data);
  }

  // DELETE tower
  deleteTower(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/towers/delete/${id}`);
  }

  // GET all units
  getUnits() {
  return this.http.get<any[]>(`${this.API_URL}/units/`);
}

// GET single unit
 getUnitById(id: number) {
  return this.http.get<any>(`${this.API_URL}/units/get/${id}`);
}

// CREATE unit (admin)
createUnit(data: any) {
  return this.http.post(
    `${this.API_URL}/units/create`,
    data,
  );
}

// UPDATE unit (admin)
updateUnit(id: number, data: any) {
  return this.http.patch(
    `${this.API_URL}/units/update/${id}`,
    data,
  );
}

// DELETE unit (admin)
deleteUnit(id: number) {
  return this.http.delete(
    `${this.API_URL}/units/delete/${id}`,
  );
}

getAmenities() {
  return this.http.get<any[]>(`${this.API_URL}/amenities/`);
}

createAmenity(data: any) {
  return this.http.post(
    `${this.API_URL}/amenities/create`,
    data,
  );
}
updateAmenity(id: number, data: any) {
  return this.http.patch(
    `${this.API_URL}/amenities/update/${id}`,
    data,
  );
}

deleteAmenity(id: number) {
  return this.http.delete(
    `${this.API_URL}/amenities/delete/${id}`,
  );
}

 createLease(data: any) {
  return this.http.post(`${this.API_URL}/lease/create`, data);
}

// USER DETAILS
getUserBookings(userId: number) {
  return this.http.get<any[]>(`${this.API_URL}/bookings/user/${userId}`);
}

getUserLeases(userId: number) {
  return this.http.get<any[]>(`${this.API_URL}/lease/user/${userId}`);
}

getUserPayments(userId: number) {
  return this.http.get<any[]>(`${this.API_URL}/lease/payments/user/${userId}`);
}

}
