import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from '../API';
import { useNavigate } from 'react-router-dom';



function Reservation(props) {
    const navigate = useNavigate();
    const [reservation, Setreservation] = useState([]);


    const getallReservation = async () => {
        const user = await API.getUserInfo();
        const userId = user.id;
        const reservation = await API.UserReservations(userId);
        Setreservation(reservation);

    }

    useEffect(() => {
        getallReservation()
    }, []);

    const deleteReservation = async (seatId) => {
        const user = await API.getUserInfo();
        const userId = user.id;
        await API.deleteReservation(userId, seatId);
        await API.setStatusAvailable(seatId)



        try {
            getallReservation()
            navigate(-1)
        }
        catch (error) {
        }

    }
    return (
        <>
            <Row>
                {props.loggedIn ?
                    <h4 className='paragraph'> You have {reservation.length} reservation </h4> : <h3 className='paragraph'> You are not logged in</h3>
                }
            </Row>
            {props.loggedIn ?
                <Row>
                    <Col lg={10} className="mx-auto">
                        < ReservationTable reservation={reservation} deleteReservation={deleteReservation} />
                    </Col>
                </Row> : <p></p> }

        </>
    );
}

function ReservationTable(props) {


    return (
        <>
            <Table striped>
                <thead>
                    <tr>
                        <th>Reservation Id</th>
                        <th>Plane Type</th>
                        <th>Your User number </th>
                        <th>Seat ID</th>
                        <th>Label</th>
                        <th>delete this reservation</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.reservation.map((reserved) => < ReservationRow key={reserved.reservationId}
                            reservation={reserved} deleteReservation={props.deleteReservation} />)
                    }

                </tbody>
            </Table>
        </>
    );
}
function ReservationRow(props) {
    return (
        <>
            <tr><TableData reservation={props.reservation} deleteReservation={props.deleteReservation} /></tr>
        </>
    );
}


function TableData(props) {

    return (
        <>
            <td>{props.reservation.reservationId} </td>
            <td>{props.reservation.planeType} </td>
            <td> {props.reservation.userId}</td>
            <td> {props.reservation.seatId} </td>
            <td> {props.reservation.label} </td>
            <td> <button className="button2 button3" onClick={() => props.deleteReservation(props.reservation.seatId)}> delete this seat </button></td>


        </>
    );
}

export { Reservation, ReservationTable, ReservationRow }