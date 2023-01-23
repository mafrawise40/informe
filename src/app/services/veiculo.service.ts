import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Veiculo } from 'app/models/models.dto';
import { environment } from 'environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {



  urlResource: string = environment.apiUrl + "/veiculo";

  constructor(protected http: HttpClient) { }

  getAll(): Observable<Veiculo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Veiculo[]>(this.urlResource + '/retornar-todos', {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getAllCaGeral(): Observable<Veiculo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Veiculo[]>(this.urlResource + '/retornar-todos-carater-geral', {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  incluirCarater(id: number): Observable<Veiculo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Veiculo[]>(this.urlResource + '/incluir-carater-geral', id , {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  incluirDesfecho(dto: Veiculo): Observable<Veiculo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    
    return this.http.post<Veiculo[]>(this.urlResource + '/incluir-desfecho', dto , {headers}).pipe(catchError(this.handleError.bind(this)));
  }



  getVinculosVeiculo(id: number): Observable<Veiculo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Veiculo[]>(this.urlResource + '/get-vinculos',id, {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getById(id: number): Observable<Veiculo> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Veiculo[]>(this.urlResource + '/retornar-por-id',id ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

  getByParametros(dto: Veiculo): Observable<Veiculo[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/json'
    });
    return this.http.post<Veiculo[]>(this.urlResource + '/get-by-paramentros',dto ,  {headers}).pipe(catchError(this.handleError.bind(this)));
  }

 

  save(dto: Veiculo, edicao: boolean): Observable<any> {
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

  // getByParametros(dto :FiltroPainelDTO): Observable<Veiculo[]> {
  //   return this.http.post<Veiculo[]>(this.urlResource + '/retornar-por-parametros', dto).pipe(catchError(this.handleError.bind(this)));
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
    formData: FormData , idVeiculo: number
  ): Observable<Veiculo[]> {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");
    return this.http
      .post(this.urlResource + "/upload-file/"+idVeiculo, formData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  
  


}
