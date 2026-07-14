import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private http = inject(HttpClient);
  // Base API URL — resolved from environment (dev: localhost, prod: deployed backend)
  private apiUrl = environment.apiUrl;
  private v1Url = environment.apiV1Url;

  /**
   * Quotations
   */
  guardarCotizacion(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cotizaciones`, payload);
  }

  getAllCotizaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cotizaciones`);
  }

  deleteCotizacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cotizaciones/${id}`);
  }

  /**
   * Rendimientos
   */
  getRendimientos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rendimientos`);
  }

  createRendimiento(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rendimientos`, payload);
  }

  updateRendimiento(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/rendimientos/${id}`, payload);
  }

  deleteRendimiento(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rendimientos/${id}`);
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
