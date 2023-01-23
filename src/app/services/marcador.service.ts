import { MarcadorMaps } from './../models/models.dto';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarcadorService {

  

  urlResource: string = environment.apiUrl + "/marcador";

  constructor(protected http: HttpClient) { }

  getAll(): Observable<MarcadorMaps[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<MarcadorMaps[]>(this.urlResource + '/retornar-todos', {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getById(id: number): Observable<MarcadorMaps> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<MarcadorMaps[]>(this.urlResource + '/retornar-por-id',id ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  save(dto: MarcadorMaps, edicao: boolean): Observable<any> {
    if (edicao) {
      return this.http
        .put(this.urlResource, dto)
        .pipe(catchError(this.handleError.bind(this)));
    } else {
      return this.http
        .post(this.urlResource, dto)
        .pipe(catchError(this.handleError.bind(this)));
    }
  }

  delete(id): Observable<any> {
    return this.http
      .delete(this.urlResource + "/" + id)
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteImagem(id, idImagem): Observable<any> {
    return this.http
      .delete(this.urlResource + "/" + id + "/" +idImagem)
      .pipe(catchError(this.handleError.bind(this)));
  }

 

  protected handleError(error: any): Observable<any> {
    return throwError(error.error || error);
  }

 

  uploadImagens(
    formData: FormData , idMarcadorMaps: number
  ): Observable<MarcadorMaps[]> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");
    return this.http
      .post(this.urlResource + "/upload-file/"+idMarcadorMaps, formData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getAllAnos(): Observable<MarcadorMaps[]> {
    return null;
  }
}
