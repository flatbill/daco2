import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError, observable } from 'rxjs';
import { catchError, map, tap, filter } from 'rxjs/operators';  //tap?
import { FormatDetail } from './FormatDetail';
import { MessageService } from './_services/index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//@Injectable()
@Injectable({
  providedIn: 'root',
})

export class FormatDetailService {
  private fdUrl = 'app/fdList1'; // URL to web api  
  //      !! look inside in-memory-data-service1  !!

  constructor(
    private http: HttpClient, 
    private messageService: MessageService) {}
  
    getFormatDetails0(): Observable<FormatDetail[]> {
    let bango = this.http
    .get<FormatDetail[]>(this.fdUrl)
    .pipe(map(data => data), catchError(this.handleError));   
    return bango;
  }

  getFormatDetails(): Observable<FormatDetail[]> {
    //alert('running getFormatDetails');
    let fdUrl2 = this.fdUrl  + "/?fdFilterInOut=in"; //i hate this but it works
    let bingo =
       this.http
      .get<FormatDetail[]>(fdUrl2) 
      .pipe(map(data => data), catchError(this.handleError));       
      return bingo; // duznt work without temp bingo ?
  }
  getFormatDetail(fdParmIdIn:number)   {
    //alert('running getFormatDetail');
    // this duznt work. whines about type mismatch for observable. stupid http.
    let fdUrl2 = this.fdUrl  + '/?id=12';  
    let bingo   =
       this.http
      .get<FormatDetail>(fdUrl2,  httpOptions)  
      .pipe(catchError(this.handleError)); 
      //.pipe(map(data => data), catchError(this.handleError));    
      return bingo ; // duznt work without temp bingo ?
  }
  addFormatDetail(fdParmIn: FormatDetail): Observable<FormatDetail> {
    //alert('running addFormatDetail');
    return this.http        
    .post<FormatDetail>(this.fdUrl, fdParmIn, httpOptions)
    .pipe(catchError(this.handleError));
    // instantiate an object before calling this and pass in the object.
  }

  chgFormatDetail(fdParmIn: FormatDetail): Observable<FormatDetail> {
    //alert('running chgFormatDetail');
    return this.http        
    .put<FormatDetail>(this.fdUrl, fdParmIn, httpOptions)
    .pipe(catchError(this.handleError));
    // instantiate an object before calling this and pass in the object.
  }

  readFormatDetail(fdParmIn: FormatDetail) : Observable<FormatDetail> {
    //alert ('running readFormatDetail');  // this is not http, try to read the array
    //alert('retrieve directly from the array without http?')
    // might need to declare public array that is a COPY of fdList1 ?
    let zukko : FormatDetail = new FormatDetail;
    zukko.id = 12;
    zukko.fdContentName = 'FluffyBunny';
    return new Observable();
  }

  private handleError(res: HttpErrorResponse | any) {
      console.error(res.error || res.body.error);
      return observableThrowError(res.error || 'Server error');
  }
}