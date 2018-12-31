import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError, observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';  //tap?
import { ProductGridListItem } from './productGridList';
import { MessageService } from './_services/index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//@Injectable()
@Injectable({
  providedIn: 'root',
})

export class ProductGridService {
  private pgUrl = 'app/pgList1'; // URL to web api  
  //      !! look inside in-memory-data-service1  !!

  constructor(
    private http: HttpClient, 
    private messageService: MessageService) {}

  getProductGridList() {
    return this.http
      .get<ProductGridListItem[]>(this.pgUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }

  chgProductGridListItem(pgParmIn: ProductGridListItem): Observable<ProductGridListItem> {
    //alert ('running chgProductGridListItem');
    return this.http
    .put<ProductGridListItem>(this.pgUrl, pgParmIn, httpOptions)
    .pipe(catchError(this.handleError)); 
  }
 
//deleteProductGridItem(pgParmIn: ProductGridListItem) { 
    // blank-out the pg row+slot+type (don't really delete it)
    //alert ('running deleteProductGridItem');
    //alert(pgParmIn.pgContentName);
    // deleteProductGridItem(pgParmIn: ProductGridListItem): Observable<ProductGridListItem> { 
    //  var ccUrlplusId = this.ccUrl + '/' + pgParmIn.id;
    //alert(ccUrlplusId);  
    // return this.http      
    // .delete<ProductGridListItem>(ccUrlplusId, httpOptions)
    // .pipe(catchError(this.handleError));
   
//}  
    

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }
}