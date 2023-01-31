import { Informacao, FiltroPainelDTO } from 'app/models/models.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformacaoService {

  urlResource: string = environment.apiUrl + "/informacao";

  constructor(protected http: HttpClient) { }

  getAll(): Observable<Informacao[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Informacao[]>(this.urlResource + '/retornar-todos', {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getById(id: number): Observable<Informacao> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Informacao[]>(this.urlResource + '/retornar-por-id',id ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  save(dto: Informacao, edicao: boolean): Observable<any> {
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

  getByParametros(dto :FiltroPainelDTO): Observable<Informacao[]> {
    return this.http.post<Informacao[]>(this.urlResource + '/retornar-por-parametros', dto).pipe(catchError(this.handleError.bind(this)));
  }

  protected handleError(error: any): Observable<any> {
    return throwError(error.error || error);
  }

  downloadModelo(ano: string): Observable<any> {
    return this.http.get(this.urlResource + "/downloadModelo/"+ano, {
      responseType: "blob",
    });
  }

  uploadImagens(
    formData: FormData , idInformacao: number
  ): Observable<Informacao[]> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");
    return this.http
      .post(this.urlResource + "/upload-file/"+idInformacao, formData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getAllAnos(): Observable<Informacao[]> {
    return null;
  }

  getInformacaoRelatorio(dto :FiltroPainelDTO): Observable<Informacao[]>{
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Informacao[]>(this.urlResource + '/get-informacao-relatorio', dto , {headers}).pipe(catchError(this.handleError.bind(this)));

  }
}
