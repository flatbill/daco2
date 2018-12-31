import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService1 implements InMemoryDbService {
  createDb() { 
    //alert('running createDb');   
    var ccList1 = [
      { id: 11, contentName: 'LotNbr' , contentType: 'jwf' },
      { id: 12, contentName: 'ExpDate', contentType: 'jwf' },
      { id: 13, contentName: 'MfgDate', contentType: 'jwf' },
      { id: 14, contentName: 'Literal', contentType: 'lit' }
    ];

    // var blankArray = [];
    // var ccList2 = this.buildCCarray2(blankArray);
    // ccList1 = ccList2;  //overlay List1 with new data

    /////////////////////////////////////////////////////
    var pgList1 = [
      { id: 11, pgRow: 1, pgRowSlot: 1, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 12, pgRow: 1, pgRowSlot: 2, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 13, pgRow: 1, pgRowSlot: 3, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 14, pgRow: 1, pgRowSlot: 4, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 15, pgRow: 2, pgRowSlot: 1, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 16, pgRow: 2, pgRowSlot: 2, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 17, pgRow: 2, pgRowSlot: 3, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 18, pgRow: 2, pgRowSlot: 4, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 19, pgRow: 3, pgRowSlot: 1, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 20, pgRow: 3, pgRowSlot: 2, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 21, pgRow: 3, pgRowSlot: 3, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'},
      { id: 22, pgRow: 3, pgRowSlot: 4, pgMask: 'maskX', pgContentId:  0 , pgContentName: '----------' , pgContentType: '???'} 

    ];

    let dfList0 = [
      { id: 11, dfFormatKey: '357' , dfFormatName: 'lit,lot,lit,mfg', dfFormatDesc: 'lit,lot,lit,mfg', dfFilterInOut: 'in' } ,
      { id: 12, dfFormatKey: '358' , dfFormatName: 'lit,exp', dfFormatDesc: 'lit,exp', dfFilterInOut: 'in' } ,
      { id: 13, dfFormatKey: '359' , dfFormatName: 'lit,lot', dfFormatDesc: 'lit,lot', dfFilterInOut: 'in' } ,
      { id: 14, dfFormatKey: '360' , dfFormatName: 'lit,exp', dfFormatDesc: 'lit,exp', dfFilterInOut: 'out' } 
    ];
    let dfList1 = dfList0;
 
    let fdList1 = [
    { id: 111, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '357' , fdContentName: 'Literal', fdMask: 'lot:'    , fdFilterInOut: 'in' } ,
    { id: 112, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '357' , fdContentName: 'LotNbr' , fdMask: 'lotnnnn' , fdFilterInOut: 'in' } ,
    { id: 113, fdRow: 1, fdRowSlot: 3,  fdFormatKey: '357' , fdContentName: 'Literal', fdMask: 'mfg:'       , fdFilterInOut: 'in' } ,
    { id: 114, fdRow: 1, fdRowSlot: 4,  fdFormatKey: '357' , fdContentName: 'MfgDate', fdMask: 'mmddyy'  , fdFilterInOut: 'in' } ,
    { id: 115, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '360' , fdContentName: 'Literal', fdMask: 'exp:'       , fdFilterInOut: 'in' } , 
    { id: 116, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '360' , fdContentName: 'ExpDate', fdMask: 'mmddyy'  , fdFilterInOut: 'in' } ,
    { id: 117, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '358' , fdContentName: 'Literal', fdMask: 'exp:'       , fdFilterInOut: 'in' } , 
    { id: 118, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '358' , fdContentName: 'ExpDate', fdMask: 'mmddyy'  , fdFilterInOut: 'in' } , 
    { id: 119, fdRow: 1, fdRowSlot: 1,  fdFormatKey: '359' , fdContentName: 'Literal', fdMask: 'lot:'  ,      fdFilterInOut: 'in' } , 
    { id: 120, fdRow: 1, fdRowSlot: 2,  fdFormatKey: '359' , fdContentName: 'LotNbr' , fdMask: 'mmddyy'  , fdFilterInOut: 'in' }  
  ];
  
  let ccList2 = [
    { id: 11, contentName: 'Loonoo', contentType: 'lit' } ];

  //alert('all done with createDb in InMemoryDbService');
  return {ccList1,ccList2,pgList1,dfList0,dfList1,fdList1}; //cc component is looking for ccList1  
}

  // buildCCarray2(arrParmIn){     
  //   var arrOut= arrParmIn;
  //   arrOut.push({id:16, contentName:'LotNbr'}); 
  //   arrOut.push({id:17, contentName:'MfgDate'}); 
  //   return arrOut;
  //   //let newArr = wfListParm.map(() => {
  //   //  return 'cat'; //map is powerful, use it someday
  //   //});
  // }
}
