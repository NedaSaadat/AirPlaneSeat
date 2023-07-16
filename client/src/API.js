import { Reservation } from "./Model";
import { Seat } from "./Model";
const server_URL = 'http://localhost:3001';

//**************************Login/Logout ************************* */

const logIn = async (credentials) => {
  const response = await fetch(server_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};
const getUserInfo = async () => {
  const response = await fetch(server_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async () => {
  const response = await fetch(server_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}
//*********************Get All seat *********************************** */
// Get all seat
const getAllseat = async (planeType) => {
  const response = await fetch(server_URL + `/api/plane/${planeType}`);
  const seatJson = await response.json();
  if (response.ok) {
    return seatJson.map(seat => new Seat(seat.seatId, seat.planeType, seat.row, seat.column, seat.status));
  }
  else
    throw seatJson;
}
// Get all (Available/Occupied/Requested) seat for a specific plane 
const AllseatStatus = async (planeType, status) => {
  const response = await fetch(server_URL + `/api/plane/${planeType}/${status}`);
  const seatJson = await response.json();
  if (response.ok) {
    return seatJson.map(seat => new Seat(seat.seatId, seat.planeType, seat.row, seat.column, seat.status));
  }
  else
    throw seatJson;
}

//*********************Reservation API******************************* */
// set status  to Requested
const seatStatusUpdate = async (seatId) => {
  const response = await fetch(`${server_URL}/api/plane/${seatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seatId }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
  // TODO: add improved error handling
}

// Set status to Available 
const setStatusAvailable = async (seatId) => {
  const response = await fetch(`${server_URL}/api/availableplane/${seatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seatId }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
  // TODO: add improved error handling
}
// Set status to Occupied 
const setStatusOccupied = async (seatId) => {
  const response = await fetch(`${server_URL}/api/Occupiedplane/${seatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seatId }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
  // TODO: add improved error handling
}

// Add new reservation 
const addReservation = async (planeType, userId, seatId, label) => {
  const response = await fetch(`${server_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planeType, userId, seatId, label }) ,
    credentials: 'include'
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage);
  } else {
    return null;
  }
};


// delete a reservation 
const deleteReservation = async (userId, seatId) => {
  const response = await fetch(`${server_URL}/api/reservations/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, seatId }),
    credentials: 'include'
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage);
  } else {
    return null;
  }
};

// Get user Reservations
const UserReservations = async (id) => {
  const response = await fetch(server_URL + `/api/planes/reservation/${id}`, {
    credentials: 'include'
  });
  const reservationJson = await response.json();
  
  if (response.ok) {
    return reservationJson.map(r => new Reservation(r.reservationId, r.planeType, r.userId, r.seatId, r.label));
  } else {
    throw reservationJson;
  }
};




const API = {
  logIn, getUserInfo, logOut, seatStatusUpdate,
  getAllseat, AllseatStatus, addReservation, setStatusAvailable,
  setStatusOccupied, deleteReservation , UserReservations
};
export default API;