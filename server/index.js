'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { json } = require('body-parser');
const { request } = require('http');
const { check, validationResult } = require('express-validator');
const dao = require('./dao-seat');
const userDao = require('./dao-users');



// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');


// init express
const app = express();
const port = 3001;

// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

//*****************************Login / Logout************************************* */
// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password);
  if (!user)
    return cb(null, false, 'Incorrect username or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// POST /api/sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});
// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});
//***********************Get All seat ******************************** */

app.get('/api/plane/:planeType', async (req, res) => {
  try {
    const seats = await dao.Allseat(req.params.planeType);
    res.json(seats);
  } catch {
    res.status(500).end();
  }
});

app.get('/api/plane/:planeType/:status', async (req, res) => {
  try {
    const seats = await dao.AllseatStatus(req.params.planeType, req.params.status);
    res.json(seats);
  } catch {
    res.status(500).end();
  }
});
//***********************Reservation **************************** */
// change status of a seat to Requested
app.post('/api/plane/:id', isLoggedIn, [
  check('id').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const seatId = req.params.id;
  try {
    const num = await dao.seatStatusUpdate(seatId);
    if (num === 1)
      res.status(204).end();
    else
      throw new Error(`Error in casting a status for answer #${seatId}`);
  } catch (e) {
    res.status(503).json({ error: e.message });
  }
});

// change status of a seat to Available - get SeatId from request
app.post('/api/availableplane/:id', isLoggedIn, [
  check('id').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const seatId = req.params.id;
  try {
    const num = await dao.setStatusAvailable(seatId);
    if (num === 1)
      res.status(204).end();
    else
      throw new Error(`Error in casting a status for answer #${seatId}`);
  } catch (e) {
    res.status(503).json({ error: e.message });
  }
});

// set status Occupied
app.post('/api/Occupiedplane/:id', isLoggedIn, [
  check('id').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const seatId = req.params.id;
  try {
    const num = await dao.setStatusOccupied(seatId);
    if (num === 1)
      res.status(204).end();
    else
      throw new Error(`Error in casting a status for answer #${seatId}`);
  } catch (e) {
    res.status(503).json({ error: e.message });
  }
});



// Add a reservation
app.post('/api/reservations', isLoggedIn,  
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { planeType, userId, seatId, label } = req.body;
  try {
    await dao.addSeatReservation(planeType, userId, seatId, label);
    res.status(201).json({ message: 'Reservation added successfully' });
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    res.status(500).json({ error: 'Failed to add reservation' });
  }
});

// Delete a reservation 
app.delete('/api/reservations/delete', isLoggedIn,
[ check('id').isInt() ],
  async (req, res) => {
    const { userId , seatId } = req.body;
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      const result = await dao.deleteReservation(userId , seatId);
      if (result == null)
        return res.status(200).json({}); 
      else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of seat ${req.params.id}: ${err} ` });
    }
  }
);

// Get user reservation 
app.get('/api/planes/reservation/:id', isLoggedIn, async (req, res) => {
  try {
    const reservations = await dao.UserReservations(req.params.id);
    res.json(reservations);
  } catch {
    res.status(500).end();
  }
});




















// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});