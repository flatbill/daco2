import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError, observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';  //tap?
import { ContentChoice } from './contentChoice';
import { MessageService } from './_services/index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//@Injectable()
@Injectable({
  providedIn: 'root',
})

export class ContentChoicesService {
  private ccUrl = 'app/ccList1'; // URL to web api  
  //                 !! look inside in-memory-data-service1  !!
  private ccUrl2 = 'app/ccList2'; // for the excel import

  constructor(
    private http: HttpClient, 
    private messageService: MessageService) {}

  getContentChoicesList() {
    return this.http
      .get<ContentChoice[]>(this.ccUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }

  getContentChoicesList2(){  //ccList2 is for excel
    return this.http
    .get<ContentChoice[]>(this.ccUrl2)  
    .pipe(map(data => data), catchError(this.handleError));
  }

  getHero(idParmIn: number): Observable<ContentChoice> {
    return this.getContentChoicesList().pipe(
      map(kkk => kkk.find(zzz => ContentChoice.prototype.id  == idParmIn))
      // should be ContentChoice.id = idParmIn
      // but it gives an error.  hmmm, try prototype stuck in the middle.
      // haven't really tried getHero yet.
    );
  }

  
  //billy, somehow tie this to logging and messaging?
  //addHero(ccParmIn: ContentChoice): Observable<ContentChoice> { 
  //   return this.http
  //   .post<ContentChoice>(this.ccUrl, ccParmIn, httpOptions)
   //  .pipe(
   //   tap((ccParmIn: ContentChoice) => this.log(`added stuff}`)),
   //   catchError(this.handleError));
  //}

      
    addContentChoice(ccParmIn: ContentChoice): Observable<ContentChoice> {
      //alert('running addContentChoice');
      return this.http        
      .post<ContentChoice>(this.ccUrl, ccParmIn, httpOptions)
      .pipe(catchError(this.handleError));
    // beware, you have to pass in a ContentChoice object.
    // that means you gotta instantiate an object before calling.
    // you must set id before calling this function.
    //alert(ccParmIn.contentName); 
    }

    addContentChoice2(ccParmIn: ContentChoice): Observable<ContentChoice> {
      //alert('running addContentChoice2'); //billy ccList2
      return this.http        
      .post<ContentChoice>(this.ccUrl2, ccParmIn, httpOptions)
      .pipe(catchError(this.handleError));
    }

    
  deleteContentChoice(ccParmIn: ContentChoice): Observable<ContentChoice> { 
    var ccUrlplusId = this.ccUrl + '/' + ccParmIn.id;
    //alert(ccUrlplusId);
    return this.http      
    .delete<ContentChoice>(ccUrlplusId, httpOptions)
    .pipe(catchError(this.handleError));
        // passing in a cc object of type ContentChoice 
    // called module that has delete-capability
    // wants me to pass in just the URL + HttpOptions
    // stick /nnn on the url before calling delete, where nnn is the id.
    // source for delete is in file: 
    // client.d.ts in folder angular common http src
    // I'm confused on how http module ties to in-memory-data-service
    // and it seems we are inconsistent in what our callee needs:
    // he wants us to pass in a object sometimes,
    // but he wants us to pass in an URL sometimes.
}



  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }
}