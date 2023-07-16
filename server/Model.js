'use strict';

function Seat (seatId, planeType, row , column, status ) {
    this.seatId = seatId ;
    this.planeType = planeType ;
    this.row = row ;
    this.column =column ;
    this.status= status ;

}


 function Reservation (reservationId, planeType , userId , seatId, label){
    this.reservationId = reservationId ;
    this.planeType = planeType ;
    this.userId = userId ; 
    this.seatId= seatId ; 
    this.label= label ; 

 }


module.exports= { Seat , Reservation  };