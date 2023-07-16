
const { reconstructFieldPath } = require('express-validator/src/field-selection');
const { Seat   , Reservation } = require('./Model');
const sqlite = require('sqlite3');

const db = new sqlite.Database('Airplane.db', (err) => {
    if (err) throw err;
  });

  //***********************All seat ******************** */

  exports.Allseat = (planeType) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM seat WHERE planeType = ?';
      db.all(sql, [planeType], (err, rows) => {
        if (err) {
          reject(err);
        }
        const seats = rows.map((s) => new Seat(s.seatId, s.planeType, s.row, s.column ,s.status));
        resolve(seats);
      });
    });
  }
  exports.AllseatStatus = (planeType , status) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM seat WHERE planeType==?  AND status==?  ";
      db.all(sql, [planeType, status], (err, rows) => {
        if (err) {
          reject(err);
        }
        const seats = rows.map((s) => new Seat(s.seatId, s.planeType, s.row, s.column ,s.status));
        resolve(seats);
      });
    });
  }

//*******************************Reservation ************************************** */
exports.seatStatusUpdate = (seatId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE seat SET status = ? WHERE seatId = ?  ";
    db.run(sql, ["Requested", seatId], function(err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};
exports.setStatusAvailable = (seatId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE seat SET status = ? WHERE seatId = ? ";
    db.run(sql, ["Available", seatId], function(err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};
exports.setStatusOccupied = (seatId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE seat SET status = ? WHERE seatId = ?  ";
    db.run(sql, ["Occupied", seatId], function(err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

exports.addSeatReservation = (planeType, userId, seatId, label) => {
  return new Promise ((resolve, reject) => {
    const sql = 'INSERT INTO reservation(planeType, userId, seatId, label) VALUES (?, ?, ?, ?) ';
    db.run(sql, [planeType, userId, seatId, label], function(err) {
      if(err) reject(err);
      else resolve(this.lastID);
    });
  });
};
 // Delete a reservation 
 exports.deleteReservation = (userId, seatId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM reservation WHERE userId=? and seatId=?';
    db.run(sql, [userId, seatId], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1)
        resolve({ error: 'No seat deleted.' });
      else
        resolve(null);
    });
  });
}
// Get User Reservations 
exports.UserReservations = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM reservation WHERE userId = ?';
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      }
      const reservations = rows.map((s) => new Reservation(s.reservationId, s.planeType, s.userId, s.seatId ,s.label));
      resolve(reservations);
    });
  });
}


