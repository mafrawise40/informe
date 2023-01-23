import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo } from 'app/models/models.dto';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {

  

  

  urlResource: string = environment.apiUrl + "/arquivo";

  constructor(protected http: HttpClient) { }

  getAll(): Observable<Arquivo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Arquivo[]>(this.urlResource + '/retornar-todos', {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getById(id: number): Observable<Arquivo> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Arquivo[]>(this.urlResource + '/retornar-por-id',id ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  save(dto: Arquivo, edicao: boolean): Observable<any> {
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

 

  
}
