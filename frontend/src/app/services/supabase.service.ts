import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private http = inject(HttpClient);
  // Base API URL
  private apiUrl = 'http://localhost:3000/api';
  private v1Url = 'http://localhost:3000/api/v1';

  /**
   * Quotations
   */
  guardarCotizacion(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cotizaciones`, payload);
  }

  /**
   * Generic CRUD Factory for Catalogs
   */
  getAll(resource: string, params?: any): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<any[]>(`${this.v1Url}/${resource}`, { params: httpParams });
  }

  getById(resource: string, id: string): Observable<any> {
    return this.http.get(`${this.v1Url}/${resource}/${id}`);
  }

  create(resource: string, data: any): Observable<any> {
    return this.http.post(`${this.v1Url}/${resource}`, data);
  }

  update(resource: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.v1Url}/${resource}/${id}`, data);
  }

  delete(resource: string, id: string): Observable<any> {
    return this.http.delete(`${this.v1Url}/${resource}/${id}`);
  }

  /**
   * Get Catalog for selection in local (legacy - replaced by generic CRUD)
   */
  getCatalogo(): Observable<any[]> {
    return this.getAll('flores');
  }
}
