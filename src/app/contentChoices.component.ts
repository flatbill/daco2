// typescript lint disabled cuz of naggy error shown on export line:
// Experimental support for decorators is a feature that is subject to change...
// c:\users\ASP0363\appdata\roaming\code\user\settings.json
import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { FormsModule }          from '@angular/forms';
import {ContentChoice}          from './contentChoice';
import {ProductGridListItem}    from './productGridList';
import {DcFormatListItem}       from './dcFormatList';
import {FormatDetail}           from './formatDetail';
import {SkuFormat}              from './skuFormat';
import {MaskAndText}            from './maskAndText';
import {FormatCompose}         from './formatCompose';
import {FormatLiteral}         from './formatLiteral';
import {FormatMask}            from './formatMask';
import * as XLSX from 'xlsx'; //as XLSX creates the NAMESPACE XLSX 
import { getHostElement } from '@angular/core/src/render3';  //

type AOA = any[][];           // array of arrays 
@Component({
     selector: 'my-selector1'    //tied to app.component.html 
    ,templateUrl: 'contentChoices.component.html' 
    ,changeDetection: ChangeDetectionStrategy.OnPush	
})
export class ContentChoicesComponent implements OnInit {
  // declare properties of this component.
  //  this.property  var   let
  //  
  // arrays here are used by contentChoices.component.html (ngfor)
  contentChoiceArray1:  ContentChoice[]; 
  productGridArray0:    ProductGridListItem[];     
  productGridArray1:    ProductGridListItem[];  
  dateCodeFormatArray0: DcFormatListItem[];  // raw list
  dateCodeFormatArray1: DcFormatListItem[];  // filtered list  
  formatDetailArray0:   FormatDetail[];  // raw list
  formatDetailArray1:   FormatDetail[];   // filtered list
  skuFormatArray0:      SkuFormat[];
  skuFormatArray1:      SkuFormat[];
  formatComposeArray0:  FormatCompose[];  // raw array
  //formatComposeArray1:  FormatCompose[];  // compose format details into readable array
  maskAndTextArray0:     MaskAndText[];
  formatLiteralArray0:   FormatLiteral[];
  formatMaskArray0:      FormatMask[];
  //myXlHdgMsg: string =  ' Import Format data from Excel   ===> ' ; This page is for finding Date Code Formats that fit your criteria. 
  myMsg: string = ' Please import from XL, then drag & drop Content to filter Format info. ' ;
  myModal1Msg1: string  = 'modal1 header info goes here';
  myModal1Msg2: string  = 'more modal1 info goes here';
  dragHelpMsg:  string  = 'drag & drop';
  dfHelpMsg: string     = 'click + to expand these lists';
  pg1HelpMsg: string    = 'drop here to filter a specific grid row/slot ';
  pg0Heading: string    = ' drop here to filter all grid slots  ';
  selectedDF: DcFormatListItem;
  selectedCC: ContentChoice;
  selectedFD: FormatDetail;
  selectedPG: ProductGridListItem; 
  selectedPG0: ProductGridListItem;  //MAYBE shorten these
  fc: FormatCompose;
  sf: SkuFormat; 
  mt: MaskAndText;
  fl: FormatLiteral;
  whatCcIamDragging: ContentChoice;
  whatPgIamDropping: ProductGridListItem;
  xlData: AOA = [ [1, 2], [3, 4] ]; //  aoa means 'array of arrays' 
  itemToSearchFor: string = '';
  firstScreenYN: string = 'Y';
  ///////////////////////////////////////////////////////////////////
  constructor(
    private cdr: ChangeDetectorRef
    // services are hard. we removed services, and put their code in this component. hooray!
  ) {}  
         
  ngOnInit() {
    this.initDummyArrays();
    this.dfFilter();   
  };  
  
  getDFList(){
    // set dateCodeFormatArray1  by filtering dateCodeFormatArray0 
    // leave dateCodeFormatArray0 alone. 
    //dont accidentally remove entries from dateCodeFormatArray0.
    this.dateCodeFormatArray1 = 
      this.dateCodeFormatArray0.filter(rrr => rrr.dfFilterInOut == 'in');  
    this.formatDetailArray1 = this.formatDetailArray0;
    this.cdr.markForCheck();

  }

  delPgItem(pgParmIn: ProductGridListItem){
    //alert('running delPgItem');    
    // a delete is really a 'blank out'. 
    pgParmIn.pgContentName = '----------';
    pgParmIn.pgContentShow = '----------';
    pgParmIn.pgContentId   = 0;
    pgParmIn.pgContentType = '???';
    pgParmIn.pgMask        = ' ';  
    this.chgPgItem(pgParmIn);     
  }

  chgDFItem(dfParmIn: DcFormatListItem){
    var i = this.dateCodeFormatArray0.findIndex(x => x.dfFormatKey == dfParmIn.dfFormatKey);
    this.dateCodeFormatArray0[i] = dfParmIn;
  }
 
  chgPgItem(pgParmIn: ProductGridListItem){
    //alert('running chgPGItem0');
    var i = this.productGridArray1.findIndex(x => x.id == pgParmIn.id);
    this.productGridArray1[i] = pgParmIn;
  }
 
  addCC(ParmIn: string){
    this.selectedCC = new ContentChoice ;
    this.selectedCC.id = 13; 
    this.selectedCC.contentName = ParmIn  ;
    if (this.selectedCC.contentName == 'Literal')
      {this.selectedCC.contentType = 'lit'}
    else
      {this.selectedCC.contentType = 'jwf'}
    this.contentChoiceArray1.push(
      { id:this.selectedCC.id, 
        contentName:this.selectedCC.contentName, 
        contentType:this.selectedCC.contentType,
        contentMask:this.selectedCC.contentMask}
    );
  }

  addDF(xlParmIn: string){
    this.selectedDF = new DcFormatListItem ; 
    this.selectedDF.id = null;     
    this.selectedDF.dfFilterInOut  = 'in' ;
    var firstComma = xlParmIn.toString().indexOf(",");
    this.selectedDF.dfFormatKey  =  xlParmIn.toString().substring(0,firstComma);
    firstComma = firstComma + 1;
    var firstCommaComma = xlParmIn.toString().indexOf(",,");   
    this.selectedDF.dfFormatName  = xlParmIn.toString().substring(firstComma,firstCommaComma);
    //this.selectedDF.dfFormatName = 'woozoo';
    //this.selectedDF.dfFormatDesc xlParmIn.toString().substring(firstComma);
    this.dateCodeFormatArray0.push(
      { id:this.selectedDF.id,
        dfFormatKey: this.selectedDF.dfFormatKey,
        dfFormatName: this.selectedDF.dfFormatName,
        dfFormatDesc:  this.selectedDF.dfFormatDesc,  
        dfFilterInOut: this.selectedDF.dfFilterInOut}
    );
  }

  addFD (fdParmIn: any){
    // adds one row to formatDetailArray0 from xl snippet
    this.selectedFD = new FormatDetail ; 
    this.selectedFD.id = null;  
    var fdXLsplit = fdParmIn.toString().split(',');

    this.selectedFD.fdFormatKey = fdXLsplit[0];
    this.selectedFD.fdRow = fdXLsplit[1];
    this.selectedFD.fdRowSlot = fdXLsplit[2];    
    this.selectedFD.fdContentName = fdXLsplit[3];
    this.selectedFD.fdFilterInOut = 'in' ;
    //this.selectedFD.fdMask = fdXLsplit[4]; 
    var q: string = fdXLsplit[4].replace('""',''); //kill double double quotes
    this.selectedFD.fdMask = q; 

    this.formatDetailArray0.push(
      { id:this.selectedFD.id,
        fdFormatKey: this.selectedFD.fdFormatKey,
        fdRow: this.selectedFD.fdRow,
        fdRowSlot: this.selectedFD.fdRowSlot,
        fdContentName: this.selectedFD.fdContentName,
        fdMask: this.selectedFD.fdMask,
        fdFilterInOut: this.selectedFD.fdFilterInOut }
    );
  }
  addSF (sfParmIn: any){
    // adds one row to skuFormatArray0 from xl snippet
    this.sf = new SkuFormat ; 
    this.sf.id = null;  
    var fdXLsplit = sfParmIn.toString().split(',');

    this.sf.sfSku = fdXLsplit[0];
    this.sf.sfLayer = fdXLsplit[1];
    this.sf.sfFormatKey = fdXLsplit[2]; 

    this.skuFormatArray0.push(
      { id:this.sf.id,
        sfFormatKey: this.sf.sfFormatKey, 
        sfSku: this.sf.sfSku,
        sfLayer: this.sf.sfLayer}
    );
  }   
  addMT (mtParmIn: any){
    // adds one row to skuFormatArray0 from xl snippet
    this.mt = new MaskAndText ; 
    this.mt.id = null;  
    var fdXLsplit = mtParmIn.toString().split(',');
    //var x: string = 'mask: ';
    var mOrT: string = 'm';
    if (fdXLsplit[0]=='Literal'){
      //x=' ';
      mOrT='t';
    };
    var q: string = fdXLsplit[0].replace('""','');
    //this.mt.mtContent = 'content: ' + q;
    this.mt.mtContent =                 q;  
    //this.mt.mtContent = 'content: ' + fdXLsplit[0];
    //this.mt.mtMaskOrText = x + fdXLsplit[1];
    this.mt.mtMaskOrText =  fdXLsplit[1];
    this.maskAndTextArray0.push(
      { id: this.mt.id,
        mtMaskOrText: this.mt.mtMaskOrText,
        mtContent: this.mt.mtContent,
        mtMorT: mOrT }
    );
  }   

  dragEnd2(ccParmIn: ContentChoice) {
    //alert('running dragEnd2');  
    //alert(event); //this is a MouseEvent. 'event' is built in. 
    this.whatCcIamDragging = ccParmIn;  // aha !!!
    // console.log(event); //interesting but not really helpful
  } 

  onDrop10(pgParmIn: ProductGridListItem){
    //alert('running Drop10');
    // first, blank out the help msgs and the help msg arrows
    this.dragHelpMsg = '';
    var e = document.getElementById('dragHelpMsgRightArrow');     
    e.classList.add("hide-sometimes"); 
    this.pg1HelpMsg  = ''     ;
    var f = document.getElementById('dropHelpMsgDownArrow1');     
    f.classList.add("hide-sometimes"); 
    var g = document.getElementById('dropHelpMsgDownArrow2');     
    g.classList.add("hide-sometimes"); 
    this.whatPgIamDropping = pgParmIn 
    this.setPg1fromDropCC();
    // remove this cc from pg0 if he dropped into pg0 earlier.
    var i = 
      this.productGridArray0.findIndex(x => x.pgContentName == pgParmIn.pgContentName);
    if  ( i != -1 && pgParmIn.pgContentType != 'lit') { //pg0 found. remove this cc from pg0
      var magicRemover = // splice magically updates this.productGridArray0 
      this.productGridArray0.splice(i,1);
    }
    this.dfFilter();    
  }

  setPg1fromDropCC(){
      //alert('running setPgfromDropCC');  
      // take attributes from whatIamDragging  
      // and set some values in the product grid list item.
      // which pg Item should I update?  the one in whatPgIamDropping 
      this.whatPgIamDropping.pgContentId    = this.whatCcIamDragging.id;
      this.whatPgIamDropping.pgContentName  = this.whatCcIamDragging.contentName;
      this.whatPgIamDropping.pgContentShow  = this.whatCcIamDragging.contentName;
      this.whatPgIamDropping.pgContentType  = this.whatCcIamDragging.contentType;
      this.whatPgIamDropping.pgMask         = this.whatCcIamDragging.contentMask;  
      // find and update one pg of the pg array.
      var i;  
     for (i = 0; i < this.productGridArray1.length; i++) {
      this.selectedPG = this.productGridArray1[i];      
      if ( 
         this.selectedPG.pgRow == this.whatPgIamDropping.pgRow
         && this.selectedPG.pgRowSlot == this.whatPgIamDropping.pgRowSlot)
           { 
            this.productGridArray1[i].pgContentName = this.whatPgIamDropping.pgContentName;
            this.productGridArray1[i].pgContentShow = this.whatPgIamDropping.pgContentShow;
            this.chgPgItem(this.selectedPG); 
            break; 
           }          
        } 
  }

  onDrop20(){
      //alert('running onDrop20');
      // dropping a cc into the pg grid array 0 (pg-hdr) 
      //alert(this.whatCcIamDragging.contentName); 
      // first, blank out the help msg and the help msg arrow
      this.dragHelpMsg = '';
      var d = document.getElementById('dragHelpMsgRightArrow');     
      d.classList.add("hide-sometimes");       
      var i = 
          this.productGridArray1.findIndex(x => x.pgContentName == this.whatCcIamDragging.contentName  );
      this.setPg0fromDropCC();
      this.dfFilter();
  }

  setPg0fromDropCC(){
      //alert('running setPg0fromDropCC');  
      // take attributes from whatCcIamDragging  
      // and set some values in the product grid 0     
      // insert a row into pg0 for the selected CC 
      // pg0 has one row per CC that is dropped into pg0
      if (this.whatCcIamDragging.contentType != 'lit'){
        var i = 
          this.productGridArray0.findIndex(x => x.pgContentName == this.whatCcIamDragging.contentName );
        if (i != -1) {return} // he already put this cc in pg0. get out. 
      }    
      var newId = this.productGridArray0.length + 11
      //alert(this.whatCcIamDragging.contentName);
      this.productGridArray0.push(
        {  
          id: newId,
          pgRow: 0,
          pgRowSlot: 0,
          pgContentId:   this.whatCcIamDragging.id,
          pgContentName: this.whatCcIamDragging.contentName, 
          pgContentShow: this.whatCcIamDragging.contentName,
          pgContentType: this.whatCcIamDragging.contentType,  
          pgMask:        this.whatCcIamDragging.contentMask
        }
      ); 
      if (newId == 11) {this.pg0Heading = ''};
     // this.pg0Heading = this.pg0Heading + this.whatCcIamDragging.contentName +' ';
  }
  onPg0ContainerRightClick(){
    //alert('on pg container right click');
    this.myMsg = ' search-all was reset. '
    this.productGridArray0 = [] ;
    return false; //nicely disables the browswer context menu.
  }
  /////////////////////////////////////
  onPgClick(pgParmIn: ProductGridListItem  ){
        //alert('running onPgClick');
        // user can set the literal to real text. 
        // like he migt want the literal 'Mfg:'
        // that preceeds the content field MfgDate  
        if (pgParmIn.pgContentType == 'lit') { 
          this.setPgLiteral(pgParmIn);
        }
        if (pgParmIn.pgContentType == 'jwf') { 
           this.setPgMask(pgParmIn);          
        }         
      this.chgPgItem(pgParmIn); 
      this.dfFilter();
  }

  setPgLiteral(pgParmIn){
    this.myMsg = 'prompt for literal';
    var hisInput = pgParmIn.pgMask ;  
     hisInput = prompt('Literal:', hisInput);
     if (hisInput == null || hisInput == "") 
       {} 
     else 
      {        
        pgParmIn.pgMask = hisInput // mask is either mask or literal text
        pgParmIn.pgContentShow = 'Literal:' + hisInput  
       } 
  }

  setPgMask(pgParmIn){ 
      //alert('set pg mask');
        var hisMaskInput = pgParmIn.pgMask;
        hisMaskInput = prompt('Mask:', hisMaskInput);
        hisMaskInput = hisMaskInput.toUpperCase();
        pgParmIn.pgMask = hisMaskInput;      
  }

  onPgRightClick(pgParmIn: ProductGridListItem) {
        //alert('running onPgRightClick');
        // see  html for how this func is called.        
        this.delPgItem(pgParmIn);
        this.dfFilter();     
        return false; //  nicely kills browser default contextmenu! 
  }
  onPg0Click(pg0ParmIn){
    //alert('running onPg0Click');  
    this.myMsg = 'running onPg0Click ' ;  
    // user can set the literal to real text. 
    // like he might want the literal 'Mfg:'
    // that preceeds the content field MfgDate  
    if (pg0ParmIn.pgContentType == 'lit') { 
      this.setPgLiteral(pg0ParmIn);
    }
    if (pg0ParmIn.pgContentType == 'jwf') { 
      this.setPgMask(pg0ParmIn);          
    } 
    this.dfFilter();
  }
  onPg0RightClick(pg0ParmIn){ //reset pg0 to blank
    //alert('running onPg0RightClick');
    this.myMsg = ' remove one array row from pg0. '
    event.stopPropagation(); // blocks the parent container rightclick
    var i = 
      this.productGridArray0.findIndex(x => x.pgContentName == pg0ParmIn.pgContentName &&  x.pgMask == pg0ParmIn.pgMask);
    var magicRemover = // splice magically updates this.productGridArray0 
      this.productGridArray0.splice(i,1);
    this.dfFilter();
    return false; //  nicely kills browser default contextmenu!
   }
  setAllDfOut(){
    //alert('running setAllDfOut');  // set all df to OUT.
    var i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];       
      this.dateCodeFormatArray0[i].dfFilterInOut = 'out';
    } 
  }
  setAllDfIn(){
    //alert('running setAllDfIn');  // set all df to in.
    // could probably do a cool .map thing here, instead of a loop.
    var i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {
      this.selectedDF = this.dateCodeFormatArray0[i];       
      this.dateCodeFormatArray0[i].dfFilterInOut = 'in';
    } 
  }
  countPg1(){    
    // how many pg entries have something real in them (as opposed to ----------)
    var x = this.productGridArray1.filter(rrr => rrr.pgContentName  != '----------');
    var y = x.length;
    return y;
  }
  countPg0(){    
    // how many pg0 entries are there ?
    var x = this.productGridArray0.length 
    return x;
  }
  onDfClick(dfParmIn){
    //alert('running onDfClick');
    this.selectedDF = dfParmIn;
    this.fdSelect1(this.selectedDF);
    this.fdCompose(this.selectedDF);
    this.fdModal1(this.selectedDF);
    //
  }  
  onDfRightClick(dfParmIn){
    //alert('on df  right clicker');     
    this.selectedDF = dfParmIn;
    this.fdSelect1(this.selectedDF);
    //this.fdCompose(this.selectedDF);
    this.fdModal2(this.selectedDF);
    return false; //nicely disables the browswer context menu.
  }
  /////////////////////////////////////////////////////////////////
  accordionToggle(idParmIn,evt){
    //alert('running accordion toggle');
    // call this func with an html id of a parent element, where child elments are class w3-show w3-hide
    // and the event, so tha twe can use evt.target.className
    // look for 'accordionTrigger' in the className, and decide to toggle (show/hide).
    // if you decide to toggle show/hide, then toggle the w3-show w3-hide class of
    // all the child elements that are of class w3-show or w3-hide.
    this.dfHelpMsg = ''; //blank out the intitial df  help message
    if  (evt.target.className.indexOf('accordionTrigger') >0) { 
      //alert('accordionTrigger wuz hit');
      var c = document.getElementById(idParmIn).children;
      for (var i: number = 0; i < c.length; i++) { 
      var d = document.getElementById(c[i].id);
      if (c[i].className.indexOf("w3-show") > 0) 
        { c[i].className = c[i].className.replace("w3-show", " w3-hide");  }
      else {
        if (c[i].className.indexOf("w3-hide") > 0) 
          { c[i].className = c[i].className.replace("w3-hide", " w3-show"); }
        }
      }
    }  
  }
  /////////////////////////////////////////////////////////////////
  dfFilter(){ 
    //alert('running dfFilter');
    // this func is called when user changed something for filtering,
    // either adding to pg0 or pg1 -or- removing from pg0 or pg1. or he typed item search.
    // run dfFilterFun3 to filter pg1
    // run dfFilterBum3 to filter pg0
    // run dfFilterGum3 to filter item search
    this.setAllDfOut();     
    if (this.countPg1() > 0)                        {this.dfFilterFun3()} ; 
    if (this.countPg0() > 0)                        {this.dfFilterBum3()} ;
    if (this.itemToSearchFor.trim().length != 0 )   {this.dfFilterGum3()} ;
    
    // if he removed all filtering then setAllDfIn();
    if (this.countPg0() == 0 
    && this.countPg1() == 0  
    && this.itemToSearchFor.trim().length == 0 ) 
        { this.setAllDfIn() }  
    else 
        { this.setDfFilterInOut()  }
       
    this.getDFList(); //shows only the 'filtered in' formats.
    this.fdFilter();
    
    if (this.firstScreenYN == 'Y')
      {this.firstScreenYN = 'N'}
    else
      {this.myMsg =' showing matching formats.'}
  }
  /////////////////////////////////////////////////////////////////
  setDfFilterInOut(){
    // look at the df entries, and decide to set dfFilter to 'in'
    //alert('running setDfFilterInOut');
    for (var i: number = 0; i < this.dateCodeFormatArray0.length; i++) {           
      this.selectedDF = this.dateCodeFormatArray0[i];
      if  ( this.selectedDF.dfFilterInOut.indexOf('match') >= 0
          ||  this.selectedDF.dfFilterInOut.indexOf('in') >= 0   )
         {this.selectedDF.dfFilterInOut = 'in';} 
       else
         {this.selectedDF.dfFilterInOut = 'out';} 
      this.chgDFItem(this.selectedDF);
    } 
  }

  /////////////////////////////////////////////////////////////////
  dfFilterFun3(){
    //alert('running dfFilterFun3');
    //loop thru df. for each df loop thru pg. 
    //for each pg, look thru fd for a match on formatkey + row + slot + cc    
    var fdMatchAllYN: string = '-' ;
    var i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {           
          this.selectedDF = this.dateCodeFormatArray0[i]; 
          fdMatchAllYN = this.dfFilterFun3b(this.selectedDF);
          if (fdMatchAllYN == 'y')
            {               
             this.selectedDF.dfFilterInOut = 'pg1match';
             this.chgDFItem(this.selectedDF);              
            } 
                
    } // end of df loop  
    // done with df pg fd match, some df are currently set to pg1match.
    // take all those df pg1match's and set to 'pg12match'  //was setting to 'in'
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {           
      this.selectedDF = this.dateCodeFormatArray0[i];
      if (this.selectedDF.dfFilterInOut == 'pg1match')
         {this.selectedDF.dfFilterInOut = 'pg12match';} 
       else
         {this.selectedDF.dfFilterInOut = 'pg1miss';} 
      this.chgDFItem(this.selectedDF);
    }  
  }
  ///////////////////////////////////////////////
  dfFilterFun3b(dfParmIn: DcFormatListItem ){ 
    //loop thru pg
    //alert('running dfFilterFun3b');
    var fdMatchYN: string = '-';
    var fdMatchAllYN: string = '-'; 
    var pgAllEmptyYN: string = 'y' 
    var i;  
     for (i = 0; i < this.productGridArray1.length; i++) {
      this.selectedPG = this.productGridArray1[i]; 
      if (this.selectedPG.pgContentName != '----------')
        { 
         pgAllEmptyYN = 'n' // there is at least one non-blank pg
         fdMatchYN = this.dfFilterFun3c(this.selectedPG, this.selectedDF);  
         if (fdMatchYN != 'y')    // this pg does not have a matching fd
           { fdMatchAllYN = 'n';
              //alert('no matching fd for this pg. jumping out of fun3b');
              return fdMatchAllYN;            
           }  
        }           
     } // end of pg loop 
    if (pgAllEmptyYN == 'n')  //there was at least one non-blank PG
       {fdMatchAllYN = 'y' }  //got all the way thru pg with no mismatch
       //alert('end of fun3b. returning fdmatchAll of ' + fdMatchAllYN);      
    return fdMatchAllYN;
  }  //end dfFilterFun3b
  /////////////////////
  dfFilterFun3c(pgParmIn: ProductGridListItem, dfParmIn: DcFormatListItem){
    //alert('running Fun3c');
    // loop thru fd, look for a match to this pg, this df.  return fdMatchYN    
    var fdMatchYN: string = 'n';
    var maskMatchOkYN = '?'
    var i;  
     for (i = 0; i < this.formatDetailArray0.length; i++) {          
          this.selectedFD = this.formatDetailArray0[i];          
          if (
             this.selectedFD.fdFormatKey == dfParmIn.dfFormatKey
          && this.selectedFD.fdRow == pgParmIn.pgRow
          && this.selectedFD.fdRowSlot == pgParmIn.pgRowSlot
          && this.selectedFD.fdContentName == pgParmIn.pgContentName   
             )
             { 
               maskMatchOkYN = this.dfFilterFun3d(this.selectedFD,pgParmIn); //compare mask
               if (maskMatchOkYN == 'y')
                 {fdMatchYN = 'y';               
                  break; 
                 }
              }
           
      } // end of fd loop 
    return fdMatchYN;
  } // end of dfFilterFun3c
  //////////////////////
  dfFilterFun3d(fdParmIn: FormatDetail, pgParmIn:ProductGridListItem ){
    // Mask Match.  2 flavors: Literal and Content Mask
    // Literal is when contenType = 'lit'
    // Content Mask is when contentType = 'jwf'  
    //alert('running dfFilterFun3d');
    var mm = 'y'     // Mask Match  --- return y if mask match is OK  else return n ;
    if (pgParmIn.pgMask > ' ' 
    && fdParmIn.fdMask > ''
    && pgParmIn.pgContentType == 'lit'
    && fdParmIn.fdContentName == 'Literal')
      {
       //alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
      // if (pgParmIn.pgMask != fdParmIn.fdMask)
      if (fdParmIn.fdMask.indexOf(pgParmIn.pgMask) == -1  )//filter this out
         //alert('setting mm to n'); //his mask input is included in fdMask
         {mm = 'n'}
      }  // end of compare for literal
    
     if (pgParmIn.pgMask > ' ' 
    && fdParmIn.fdMask > ''
    && pgParmIn.pgContentType == 'jwf'
    && fdParmIn.fdContentName != 'Literal')
      {
       //alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
       if (pgParmIn.pgMask != fdParmIn.fdMask)
         { mm = 'n'}
      } // end of compare for content mask
    return mm; // end of dfFilterFun3d
  }
  ////////////////////////////////////////////////////////////////////////
  dfFilterBum3(){
    //alert('running dfFilterBum3');
    //loop thru df. for each df loop thru pg0. 
    //for each pg0, look thru fd for a match on formatkey + row + slot + cc
    var fdMatchAllYN: string = '-' ;
    var i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {           
          this.selectedDF = this.dateCodeFormatArray0[i]; 
          fdMatchAllYN = this.dfFilterBum3b(this.selectedDF);
          if (fdMatchAllYN == 'y')   { 
            if (this.selectedDF.dfFilterInOut != 'pg1miss')  {
              // only set pg0 match when there was no pg1mistmatch earlier.
              // this way, we combine pg0 pg1 filters to like an 'and' condition.
              this.selectedDF.dfFilterInOut = 'pg0match';
              this.chgDFItem(this.selectedDF);  
            }  
          } 
                
    } // end of df loop  
    // done with df pg0 fd match, some df are currently set to pg0Match.
    // take all those df  and set to 'pg01match' 
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {           
      this.selectedDF = this.dateCodeFormatArray0[i];
      if (this.selectedDF.dfFilterInOut == 'pg0match')
         {this.selectedDF.dfFilterInOut = 'pg01match' } // was setting 'in'
       else      
        // a prior filter did not already included this
        {this.selectedDF.dfFilterInOut = 'out' } 
      this.chgDFItem(this.selectedDF);
    }    
  }
  dfFilterBum3b(dfParmIn: DcFormatListItem )  {
    //loop thru pg0
    //alert('running dfFilterBum3b');
    var fdMatchYN: string = '-';
    var fdMatchAllYN: string = '-'; 
    var pg0AllEmptyYN: string = 'y' 
    var i;  
    for (i = 0; i < this.productGridArray0.length; i++) {
      this.selectedPG0 = this.productGridArray0[i]; 
         pg0AllEmptyYN = 'n' // there is at least one non-blank pg0
         fdMatchYN = this.dfFilterBum3c(this.selectedPG0, this.selectedDF);  
         if (fdMatchYN != 'y')    // this pg0 does not have a matching fd
           { fdMatchAllYN = 'n';
              //alert('no matching fd for this pg. jumping out of bum3b');
              return fdMatchAllYN;            
           }       
    } // end of pg0 loop 
    if (pg0AllEmptyYN == 'n')  //there was at least one non-blank PG0
       {fdMatchAllYN = 'y' }  //got all the way thru pg with no mismatch
       //alert('end of fun3b. returning fdmatchAll of ' + fdMatchAllYN);      
    return fdMatchAllYN;
  }
  dfFilterBum3c(pgParmIn: ProductGridListItem, dfParmIn: DcFormatListItem) {
    //alert('running Bum3c');
    // loop thru fd, look for a match to this pg0, this df.  return fdMatchYN    
    var fdMatchYN: string = 'n';
    var maskMatchOkYN = '?' 
     for (var i = 0; i < this.formatDetailArray0.length; i++) {          
          this.selectedFD = this.formatDetailArray0[i];          
          if (
             this.selectedFD.fdFormatKey == dfParmIn.dfFormatKey
          && this.selectedFD.fdContentName == pgParmIn.pgContentName   
             )
             { 
               maskMatchOkYN = this.dfFilterBum3d(this.selectedFD,pgParmIn); //compare mask
               if (maskMatchOkYN == 'y')
                 {fdMatchYN = 'y';               
                  break; 
                 }
              }
           
      } // end of fd loop 
    return fdMatchYN;
  }
  dfFilterBum3d(fdParmIn: FormatDetail, pgParmIn:ProductGridListItem ){
    // Mask Match.  2 flavors: Literal and Content Mask
    // Literal is when contenType = 'lit'
    // Content Mask is when contentType = 'jwf'  
    //alert('running dfFilterBum3d');
    var mm = 'y'     // Mask Match  --- return y if mask match is OK  else return n ;
    if (pgParmIn.pgMask > ' ' 
    && fdParmIn.fdMask > ''
    && pgParmIn.pgContentType == 'lit'
    && fdParmIn.fdContentName == 'Literal')
      {
       //alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
      // if (pgParmIn.pgMask != fdParmIn.fdMask) 
      
       if   (fdParmIn.fdMask.indexOf(pgParmIn.pgMask) != -1  )//filter this in
         {}
       else
         //{alert('setting mm to n');
         {mm = 'n'}
      }  // end of compare for literal
    
     if (pgParmIn.pgMask > ' ' 
     && fdParmIn.fdMask > ''
     && pgParmIn.pgContentType == 'jwf'
     && fdParmIn.fdContentName != 'Literal')
       {   
       //alert( pgParmIn.pgContentName + ' pgMask:' + pgParmIn.pgMask + 'fdMask:' + fdParmIn.fdMask);
         if (pgParmIn.pgMask != fdParmIn.fdMask)
           { mm = 'n'}
        } // end of compare for content mask
    return mm; // end of dfFilterBUm3d
  }
  ////////////////////////////////////////////////////////////////////////
  dfFilterGum3(){
    //alert('running dfFilterGum3');    
    // run Gum3 func when he has entered some value in item search.
    this.searchByItem(this.itemToSearchFor);   // filters sf by item
    // df has been filtered already by fun3 and bum3. 
    // df entries are already 'out' or 'match'.
    // now filter df further, comparing df to the new sf.
    // lets set filter to match or miss, depending on whether df is in the sf list.
    // df has a format key and sf has a format key. match on that.
     
    var i;
    for (i = 0; i < this.dateCodeFormatArray0.length; i++) {                    
          this.selectedDF = this.dateCodeFormatArray0[i];
          //alert(this.selectedDF.dfFilterInOut);
          //if (this.selectedDF.dfFilterInOut.indexOf('match') >= 0 ) { 
          if (this.selectedDF.dfFilterInOut.indexOf('match') >= 0 
          ||  this.countPg1() == 0  &&   this.countPg0() == 0     )       
          {
             // the df matched prior pg0 and pg1.  or, he entered no pg search.
             // compare the current df with the list of sf
             this.filterGum3b(this.selectedDF);  //sets filterInOut to 'sfmatch'
          }                
    } // end of df loop1 
     
    var j; // loop2 
    for (j = 0; j < this.dateCodeFormatArray0.length; j++) {
          this.selectedDF = this.dateCodeFormatArray0[j];
          if (this.selectedDF.dfFilterInOut.indexOf('sfmatch') >= 0 )  
            {}
          else  
            { this.selectedDF.dfFilterInOut = 'Gummiss'   //item nbr duznt match.
              this.chgDFItem(this.selectedDF); 
            }          
    } // end of df loop2   
  }

  filterGum3b(dfParmIn: DcFormatListItem){
    //alert('running filterGum3b');
    //skuFormatArray1 is  already filtered by item (a shrunken list)
    // this func may set a single df to 'sfmatch'.
    for (var i = 0; i < this.skuFormatArray1.length; i++) {
      this.sf = this.skuFormatArray1[i];
      if (dfParmIn.dfFormatKey == this.sf.sfFormatKey){
        dfParmIn.dfFilterInOut = 'sfmatch';
        this.chgDFItem(dfParmIn); 
      }
    }    
  }
  ////////////////////////////////////////////////////////////////////////
  fdSelect1(dfParmIn: DcFormatListItem){
    // shrink the fd list to  include 
    // only the fd's that match the selected df formatkey    
    this.formatDetailArray1 = this.formatDetailArray0.filter(rrr => rrr.fdFormatKey == dfParmIn.dfFormatKey); 
  }
  fdCompose(dfParmIn: DcFormatListItem){
    //alert('running fdCompose');
    // build a nice set-of-lines of format info from the current df and its fd's. 
    // compose up to nine lines (one line per row).  compose into fc.
    // fd array was previously shrunken to only one df 
    this.initFc0(); 
    //this.formatComposeArray1 = this.formatComposeArray0 ;  //duzt work?
    for (var i = 0; i < this.formatDetailArray1.length; i++) {  //fd loop
      // for the current fd, append to one fc 
      this.selectedFD = this.formatDetailArray1[i];
      var k = this.formatComposeArray0.findIndex(x => x.fcRow == this.selectedFD.fdRow);
      this.fc = this.formatComposeArray0[k];   
      this.fdComposeMask(this.selectedFD);   //sets fcPart1  fcPart2  fcPart3
    }
    this.formatComposeArray0 = this.formatComposeArray0.filter(sss => sss.fcPart1>' ');
  }
  /* fdComposeLit(fdParmIn){
    var x: string = '';
    if (fdParmIn.fdContentName == 'Literal') {
      x = fdParmIn.fdMask + ' ' 
    }
    else {
      x = fdParmIn.fdContentName + ' ' 
    }
    return x;
  } */
  fdComposeMask(fdParmIn){
    // sets fcPart1 fcPart2
    //alert(this.selectedFD.fdMask); 
    
    if (fdParmIn.fdContentName == 'Literal') {
      var x: string = fdParmIn.fdMask.replace('""',''); 
      this.fc.fcPart1 = this.fc.fcPart1 + x + ' ';
      this.fc.fcPart2 = this.fc.fcPart2 + x + ' ';
    }
    else {
      this.fc.fcPart1 = this.fc.fcPart1 + fdParmIn.fdContentName + ' ';
      this.fc.fcPart2 = this.fc.fcPart2 + this.fdComposeMaskEx(fdParmIn)   + ' ';
    }
  }
  fdComposeMaskEx(fdParmIn){
    var ex = '';
    if (fdParmIn.fdContentName.toUpperCase().indexOf("SKU") >= 0  ) {
      ex = 'NF1234';
      // need more sku variations
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf("CUST. LOT") >= 0  ) {
      ex = 'ABCDEF';
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf("LOT") >= 0  
        && fdParmIn.fdContentName.toUpperCase().indexOf("CUST. LOT") != 0  ) {
      if (fdParmIn.fdMask.toUpperCase() == 'NNNNAMCX')  { // last 8
        ex = '8001ABCD';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'NNNNAMC')  { // first 7 of last8
        ex = '8001ABC';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'N/A')  { // full 12 ?
        ex = '2018001ABCD';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'NAMC')  { // 4-7 of last 8
        ex = '1ABC';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'NAMCX')  { //4-8 of last 8
        ex = '1ABCD';
      }
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf("DATE") >= 0  ) {
      if (fdParmIn.fdMask.toUpperCase() == 'YYYY.MM.DD')  {
        ex = '2018.07.31';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'YY.MM.DD')  {
        ex = '18.07.31';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'YYYY/MM/DD')  {
        ex = '2018/07/31';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'YYYYMMDD')  {
        ex = '20180731';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'MMDDYY')  {
        ex = '073118';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'MM/DD/YYYY')  {
        ex = '07/31/2018';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'DD/MM/YYYY')  {
        ex = '31/07/2018';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'MM/YY')  {
        ex = '07/18';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'MM/YYYY')  {
        ex = '07/2018';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'DD/MM/YY')  {
        ex = '31/07/18';
      } 
      if (fdParmIn.fdMask.toUpperCase() == 'DD/MM/YYYY')  {
        ex = '31/07/2018';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'DDMMYYYY')  {
        ex = '31072018';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'MMM.YY')  {
        ex = 'JUL18';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'NM YY')  {
        ex = '7 18';
      }
      if (fdParmIn.fdMask.toUpperCase() == 'YY AMM')  {
        ex = '18 Jl';
      }
    }
    if (fdParmIn.fdContentName.toUpperCase().indexOf("QUANTITY") >= 0  ) {
      ex = '24';
      // pick an example that matches mask mmddyy mm.dd.yy etc
    }
 
  return ex;
  }





  fdModal1(dfParmIn: DcFormatListItem){
    // show Modal1 popup dialog.
    // show info for the selected df
    // and  lists fd's for the  selected df 
    //alert('running fdModal1');
    this.myModal1Msg2 = 'Example lot: 2018001ABCD   Example date: 2018/07/31';
    this.myModal1Msg1 = 'Format: ' + this.selectedDF.dfFormatKey + ' ';
    this.myModal1Msg1 = this.myModal1Msg1 + this.selectedDF.dfFormatName;
    var modal1 = document.getElementById('myModal1');  //controls modal open
    var span = document.getElementsByClassName("closerX")[0]; //controls modal close
    modal1.style.display = "block"; //makes modal1 visible
    // When the user clicks on <span> (x), close the modal
    modal1.onclick = function() {
      modal1.style.display = "none"; // makes model1 invisible
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal1) { modal1.style.display = "none" }
    }
  // end of modal1()
  }
  fdModal2(dfParmIn: DcFormatListItem){
    //alert('running fdModal2');
    this.myModal1Msg1 = 'Format: ' + this.selectedDF.dfFormatKey + ' ';
    this.myModal1Msg1 = this.myModal1Msg1 + this.selectedDF.dfFormatName;
    var modal2 = document.getElementById('myModal2');  //controls modal open
    var span = document.getElementsByClassName("closerX")[0]; //controls modal close
    modal2.style.display = "block"; //makes modal2 visible
     // When the user clicks on <span> (x), close the modal
    modal2.onclick = function() {
      modal2.style.display = "none"; // makes model2 invisible
    }
    window.onclick = function(event) {
      if (event.target == modal2) { modal2.style.display = "none" }
    }
  }
  fdFilter(){    
    // shrink the fd list to  include 
    // only fd's that match df that is already filtered to 'in' 
    for (var i = 0; i < this.formatDetailArray0.length; i++) {
      this.formatDetailArray0[i].fdFilterInOut = 'out';      
      for (var j = 0; j < this.dateCodeFormatArray1.length; j++){
        if (this.formatDetailArray0[i].fdFormatKey == this.dateCodeFormatArray1[j].dfFormatKey
        && this.dateCodeFormatArray1[j].dfFilterInOut == 'in') { 
             this.formatDetailArray0[i].fdFilterInOut = 'in';  
             break;
        }
      }
    }
    // done setting all those fd df matches to 'in', now apply the filter:
    this.formatDetailArray1 = 
      this.formatDetailArray0.filter(rrr => rrr.fdFilterInOut == 'in'); 
  }
  ////////////////////////////////////////////////////////////////////////

  initDummyArrays(){
    this.contentChoiceArray1 = [
      { id: 11, contentName: 'LotNbr' , contentType: 'jwf', contentMask:'' },
      { id: 12, contentName: 'ExpDate', contentType: 'jwf', contentMask:'' },
      { id: 13, contentName: 'MfgDate', contentType: 'jwf', contentMask:'' },
      { id: 14, contentName: 'Literal', contentType: 'lit', contentMask:'' }
    ]
    this.dateCodeFormatArray0 = [
      { id: 11, dfFormatKey: '357' , dfFormatName: 'lit,lot,lit,mfg', dfFormatDesc: 'lit,lot,lit,mfg', dfFilterInOut: 'in' } ,
      { id: 12, dfFormatKey: '358' , dfFormatName: 'lit,exp', dfFormatDesc: 'lit,exp', dfFilterInOut: 'in' } ,
      { id: 13, dfFormatKey: '359' , dfFormatName: 'lit,lot', dfFormatDesc: 'lit,lot', dfFilterInOut: 'in' } ,
      { id: 14, dfFormatKey: '360' , dfFormatName: 'lit,exp', dfFormatDesc: 'lit,exp', dfFilterInOut: 'out' } 
    ];
    this.productGridArray1 = [
      { id: 11, pgRow: 1, pgRowSlot: 1, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 12, pgRow: 1, pgRowSlot: 2, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 13, pgRow: 1, pgRowSlot: 3, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 14, pgRow: 1, pgRowSlot: 4, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 15, pgRow: 2, pgRowSlot: 1, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 16, pgRow: 2, pgRowSlot: 2, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 17, pgRow: 2, pgRowSlot: 3, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 18, pgRow: 2, pgRowSlot: 4, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 19, pgRow: 3, pgRowSlot: 1, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 20, pgRow: 3, pgRowSlot: 2, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 21, pgRow: 3, pgRowSlot: 3, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 22, pgRow: 3, pgRowSlot: 4, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 23, pgRow: 4, pgRowSlot: 1, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 24, pgRow: 4, pgRowSlot: 2, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 25, pgRow: 4, pgRowSlot: 3, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'},
      { id: 26, pgRow: 4, pgRowSlot: 4, pgMask: '', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???', pgContentShow: '----------'} 
    ];
    this.productGridArray0 = [];
    this.formatDetailArray0 = [
      { id: 111, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '357' , fdContentName: 'Literal', fdMask: 'lot:'    , fdFilterInOut: 'in' } ,
      { id: 112, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '357' , fdContentName: 'LotNbr' , fdMask: 'NNNNAMCX' , fdFilterInOut: 'in' } ,
      { id: 113, fdRow: 2, fdRowSlot: 1,  fdFormatKey: '357' , fdContentName: 'Literal', fdMask: 'mfg:'    , fdFilterInOut: 'in' } ,
      { id: 114, fdRow: 2, fdRowSlot: 2,  fdFormatKey: '357' , fdContentName: 'MfgDate', fdMask: 'mm/dd/yy'  , fdFilterInOut: 'in' } ,
      { id: 115, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '360' , fdContentName: 'Literal', fdMask: 'exp:'    , fdFilterInOut: 'in' } , 
      { id: 116, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '360' , fdContentName: 'ExpDate', fdMask: 'mm/dd/yy'  , fdFilterInOut: 'in' } ,
      { id: 117, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '358' , fdContentName: 'Literal', fdMask: 'exp:'    , fdFilterInOut: 'in' } , 
      { id: 118, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '358' , fdContentName: 'ExpDate', fdMask: 'mm/dd/yy'  , fdFilterInOut: 'in' } , 
      { id: 119, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '359' , fdContentName: 'Literal', fdMask: 'lot:'    , fdFilterInOut: 'in' } , 
      { id: 120, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '359' , fdContentName: 'LotNbr' , fdMask: 'NAMC'  , fdFilterInOut: 'in' }  
    ];
    this.skuFormatArray0 = [
      { id: 111, sfSku: 'BLA', sfLayer: '1',  sfFormatKey: '357'}
    ]
    this.skuFormatArray1 = this.skuFormatArray0;
    this.maskAndTextArray0 = [
      { id: 111, mtContent: 'Expiration Date', mtMaskOrText: 'mm/dd/yy', mtMorT: 'm'},
      { id: 112, mtContent: 'Literal',         mtMaskOrText: 'exp:'  , mtMorT: 't'}
    ]
    this.formatLiteralArray0 = [
      { id: 111, flContent: 'Literal', flText: 'mfg:'  },
      { id: 112, flContent: 'Literal', flText: 'exp:'  },
      { id: 113, flContent: 'Literal', flText: 'Satinique Volume Shampoo'  }
    ]
    this.formatMaskArray0 = [
      { id: 111, fmContent: 'Mask', fmMask: 'MMDDYY'    },
      { id: 112, fmContent: 'Mask', fmMask: 'YYMMDD'    },
      { id: 113, fmContent: 'Mask', fmMask: 'YYYYMMDD'  }
    ]
    this.initFc0();
  }
//
initFc0(){ //used for housing df & fd values shown in the modal popups 
  this.formatComposeArray0 = [
    {id: 1,  fcRow:1, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 2,  fcRow:2, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 3,  fcRow:3, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 4,  fcRow:4, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 5,  fcRow:5, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 6,  fcRow:6, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 7,  fcRow:7, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 8,  fcRow:8, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''} ,
    {id: 9,  fcRow:9, fcFormatKey:'', fcPart1:'',fcPart2:'' ,fcPart3:''}  
 ]
}

// XL import section:
/////////////////////////////////////////////
 onHtmlInputFileChange(evt: any) {
   //alert('running onHtmlInputFileChange');
    // ties to html <input type="file" (change)="onFileChange($event)"  />  
    // only gets called when the screen 'choose files' field 
    // is changed to a different filename.
    this.myMsg = ' running data import... '  ;
    var target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {throw new Error('Cannot use multiple files')};
    //alert ('fall here when no error');
    document.getElementById('xlArea1').className="hide-sometimes";
    //document.getElementById('xlInputFileHtmlId').className="hide-sometimes";
    var reader: FileReader = new FileReader();  
    //-------------------------------------------------- 
    reader.onload = (e: any) => {
      this.myMsg = 'data imported. ';
      this.contentChoiceArray1  = [];
      this.dateCodeFormatArray0 = [];   
      this.dateCodeFormatArray1 = [];  
      this.formatDetailArray0   = [];
      this.skuFormatArray0      = [];
      this.skuFormatArray1      = [];      
      this.maskAndTextArray0    = [];
      this.formatLiteralArray0  = [];
      this.formatMaskArray0     = [];
      //alert('running reader.onload');
      //this.clearDemoArrays; stupid callback duznt call this function?
      // read workbook .  this is a callback, executed after the file read.      
      var bstr: string = e.target.result;
      var wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      var wsname: string = wb.SheetNames[0]; //first worksheet  is 0 /////
      var ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.setCCfromXL(ws);
      wsname = wb.SheetNames[1];  //second worksheet  is 1 /////
      ws =  wb.Sheets[wsname];
      this.setDFfromXL(ws); 
      this.getDFList(); 
      wsname = wb.SheetNames[2];  //third worksheet  is 2 /////
      ws =  wb.Sheets[wsname];
      this.setFDfromXL(ws);  
      wsname = wb.SheetNames[3];  //fourth worksheet  is 3 /////
      ws =  wb.Sheets[wsname];
      this.setSFfromXL(ws);
      wsname = wb.SheetNames[4];  //fourth worksheet  is 4 /////
      ws =  wb.Sheets[wsname];
      this.setMTfromXL(ws);  
      this.setFLfromXL(); // set fl as a subset of MT ////
      this.setFMfromXL(); // set fm as a subset of MT ////
      this.cdr.markForCheck();
    } //end of reader.onload callback
    //-------------------------------------------------- 
    reader.readAsBinaryString(target.files[0]);
  } // end of onHtmlInputFileChange

  setCCfromXL(ws: XLSX.WorkSheet){      
    this.xlData =  <AOA>(XLSX.utils.sheet_to_json(ws, {range: 1, header: 1}));
    var ccGo: any;
    for (var key in this.xlData) {
      if (this.xlData.hasOwnProperty(key)) {          
        ccGo = this.xlData[key];
        this.addCC(ccGo); //inserts one row into the cc table
      } 
    }
  }
  setDFfromXL(ws: XLSX.WorkSheet){      
    this.xlData =  <AOA>(XLSX.utils.sheet_to_json(ws, {range: 1, header: 1}));
    var dfGo: any;
    for (var i in this.xlData) {
      if (this.xlData.hasOwnProperty(i) 
      &&  this.xlData[i].length>0) {
        dfGo = this.xlData[i];
        this.addDF(dfGo);  //inserts one row into the DF table
      } 
    }
  }
  setFDfromXL(ws: XLSX.WorkSheet){      
  this.xlData =  <AOA>(XLSX.utils.sheet_to_json(ws, {range: 1, header: 1}));
  var fdGo: any;
  for (var i in this.xlData) {
    if (this.xlData.hasOwnProperty(i) 
    &&  this.xlData[i].length>0) {
      fdGo = this.xlData[i];
      this.addFD(fdGo);  //inserts one row into the FD table
    } 
  }
  }
  ////////////////////////////////////
  setSFfromXL(ws: XLSX.WorkSheet){      
    this.xlData =  <AOA>(XLSX.utils.sheet_to_json(ws, {range: 1, header: 1}));
    var sfGo: any;
    for (var i in this.xlData) {
      if (this.xlData.hasOwnProperty(i) 
      &&  this.xlData[i].length>0) {
        sfGo = this.xlData[i];
        this.addSF(sfGo);  //inserts one row into the SF table
      } 
    }
    this.skuFormatArray1 = this.skuFormatArray0 ; 
  }
  setMTfromXL(ws: XLSX.WorkSheet){      
    this.xlData =  <AOA>(XLSX.utils.sheet_to_json(ws, {range: 1, header: 1}));
    var mtGo: any;
    for (var i in this.xlData) {
      if (this.xlData.hasOwnProperty(i) 
      &&  this.xlData[i].length>0) {
        mtGo = this.xlData[i];
        this.addMT(mtGo);  //inserts one row into the SF table
      } 
    }
  }
  setFLfromXL(){
    // set fl by using a subset of mt  (mt is mask+test, fl is just the text )
    for (var i=0; i<this.maskAndTextArray0.length; i++){
      if (this.maskAndTextArray0[i].mtMorT == 't') // text
        {
          // push into fl
          this.formatLiteralArray0.push(
            { id:27,
              flContent: 'Literal',
              flText: this.maskAndTextArray0[i].mtMaskOrText }
          );
          //

        }      
    }
  }
  setFMfromXL(){
    // set fm by using a subset of mt  (mt is mask+test, fl is just the mask )
    for (var i=0; i<this.maskAndTextArray0.length; i++){
      if (this.maskAndTextArray0[i].mtMorT == 'm') // text
        {
          // push into fm
          this.formatMaskArray0.push(
            { id:27,
              fmContent: 'Mask',
              fmMask: this.maskAndTextArray0[i].mtMaskOrText}
          );
          //

        }      
    }
  }
  onItemSearchClick(){ 
    // called when he hits the item search button.
    //this.itemToSearchFor = document.getElementById('iid').value.toUpperCase().trim();
    //alert('running onItemSearchClick');
    this.itemToSearchFor = this.itemToSearchFor.toUpperCase().trim();
    //alert(this.itemToSearchFor);
    this.dfFilter() //apply all filters including the item filter
  }
  searchByItem(itemParmIn: string){ 
    //alert('running searchByItem ' + itemParmIn);
    itemParmIn = itemParmIn.trim();
    //shrink sf list to  show items that match his search input. wildcard.
    this.skuFormatArray1 = 
      this.skuFormatArray0.filter(sss => sss.sfSku.indexOf(itemParmIn) != -1)  ;
  }
   
/////////////////////////////////////////////
} //end Export Class contentChoices