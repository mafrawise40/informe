import { InformacaoPessoa } from './../models/models.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from 'app/models/models.dto';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  

  urlResource: string = environment.apiUrl + "/pessoa";

  constructor(protected http: HttpClient) { }

  getAll(): Observable<Pessoa[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Pessoa[]>(this.urlResource + '/retornar-todos', {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getVinculosPessoa(id: number): Observable<InformacaoPessoa[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<InformacaoPessoa[]>(this.urlResource + '/get-vinculos',id, {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getById(id: number): Observable<Pessoa> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Pessoa[]>(this.urlResource + '/retornar-por-id',id ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getByParametros(dto: Pessoa): Observable<Pessoa[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Pessoa[]>(this.urlResource + '/get-by-paramentros',dto ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

 

  save(dto: Pessoa, edicao: boolean): Observable<any> {
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

  // getByParametros(dto :FiltroPainelDTO): Observable<Pessoa[]> {
  //   return this.http.post<Pessoa[]>(this.urlResource + '/retornar-por-parametros', dto).pipe(catchError(this.handleError.bind(this)));
  // }

  protected handleError(error: any): Observable<any> {
    return throwError(error.error || error);
  }

  downloadModelo(ano: string): Observable<any> {
    return this.http.get(this.urlResource + "/downloadModelo/"+ano, {
      responseType: "blob",
    });
  }

  uploadImagens(
    formData: FormData , idPessoa: number
  ): Observable<Pessoa[]> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");
    return this.http
      .post(this.urlResource + "/upload-file/"+idPessoa, formData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  
  

  getAllAnos(): Observable<Pessoa[]> {
    return null;
  }
}
