import MainPagePlanes from './Components/PlaneComponenet';
import NavHeader from './Components/NavbarComponenet';
import { PlaneType, TableData } from './Components/PlaneTypeComponent';
import { Reservation } from './Components/ReservationList';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Row, Alert } from 'react-bootstrap';
import { LoginForm } from './Components/AuthComponents';
import './App.css'
import API from './API';
function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');


    //****************************»Login/Logout**************************** */
    useEffect(() => {
        const checkAuth = async () => {
            await API.getUserInfo(); // we have the user info here
            setLoggedIn(true);
        };
        checkAuth();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const user = await API.logIn(credentials);
            setLoggedIn(true);
            setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
        } catch (err) {
            setMessage({ msg: err, type: 'danger' });
        }
    };

    /**
     * This function handles the logout process.
     */
    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
        // clean up everything
        setMessage('');
    };

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={
                        <>
                            <NavHeader handleLogout={handleLogout} loggedIn={loggedIn} />
                            <Container >
                                {message && <Row>
                                    <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                                </Row>}
                                <Outlet />
                            </Container>
                        </>} >
                        <Route index element={<MainPagePlanes loggedIn={loggedIn}
                        />} />

                        <Route path='Plane/Local' element={
                            <PlaneType type={"Local"} loggedIn={loggedIn} />
                        } />
                        <Route path='Plane/Regional' element={
                            <PlaneType type={"Regional"} loggedIn={loggedIn} />
                        } />

                        <Route path='Plane/International' element={
                            <PlaneType type={"International"} loggedIn={loggedIn} />
                        } />
                        <Route path='/login' element={
                            loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
                        } />
                        <Route path='/seat/reservation/list/' element={
                            < Reservation  loggedIn={loggedIn} />
                        } />
                    </Route>




                </Routes>

            </BrowserRouter>
        </>
    )

}

export default App;
