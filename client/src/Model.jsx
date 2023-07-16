'use strict';

function Seat(seatId, planeType ,row, column, status, reservationId ) {
    this.seatId = seatId;
    this.planeType= planeType; 
    this.row = row;
    this.column = column;
    this.status = status;
    switch (column) {
        case 1:
            this.label = row + 'A';
            break;
        case 2:
            this.label = row + 'B';
            break;
        case 3:
            this.label = row + 'C';
            break;
        case 4:
            this.label = row + 'D';
            break;
        case 5:
            this.label = row + 'E';
            break;
        case 6:
            this.label = row + 'F';
            break;

    }

}

function Reservation (reservationId, planeType , userId , seatId, label){
    this.reservationId = reservationId ;
    this.planeType = planeType ;
    this.userId = userId ; 
    this.seatId= seatId ; 
    this.label= label ; 

 }



export { Seat , Reservation};