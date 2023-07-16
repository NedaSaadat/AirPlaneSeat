import { Row, Col, Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Seat } from '../Model';
import { useLocation } from 'react-router-dom';
import '../APP.css'
import API from '../API';




function PlaneType(props) {
    const [availableSeat, setAvailableseat] = useState([]);
    const [OccupiedSeat, setOccupiedseat] = useState([]);
    const [RequestedSeat, setRequestedSeat] = useState([]);
    const [allSeat, setAllseat] = useState([]);

    //********************************************************************************** */

    const getAllseat = async () => {
        const seat = await API.getAllseat(props.type);
        setAllseat(seat);
    }
    const AllAvailableStatus = async () => {
        const seat = await API.AllseatStatus(props.type, "Available");
        setAvailableseat(seat);
    }
    const AllOccupiedseat = async () => {
        const seat = await API.AllseatStatus(props.type, "Occupied");
        setOccupiedseat(seat);
    }
    const AllRequestedseat = async () => {
        const seat = await API.AllseatStatus(props.type, "Requested");
        setRequestedSeat(seat);
    }

    useEffect(() => {
        AllAvailableStatus(props.type, "Available");
        AllRequestedseat(props.type, "Requested");
        AllOccupiedseat(props.type, "Occupied");
        getAllseat(props.type);
    }, []);

    //***********************************Reservation ********************************* */
    const ChangeSeatStatus = (seatId) => {
        // temporary update
        setAllseat(oldseat => {
            return oldseat.map((seat) => {
                if (seat.seatId === seatId) {
                    // return the "updated" seat
                    const Updatedseat = new Seat(seat.seatId, seat.planeType, seat.row, seat.column, seat.reservationId, seat.status == "Requested");
                    Updatedseat.requested = true;
                    return Updatedseat;
                }
                else
                    return seat;
            });
        });
        API.seatStatusUpdate(seatId)
            .then(() => {
                AllAvailableStatus(props.type, "Available");
                AllRequestedseat(props.type, "Requested");
                AllOccupiedseat(props.type, "Occupied");
                getAllseat()
            })
            .catch(err => console.log(err));
    }


    const MakeStatusAvailable = (seatId) => {
        // temporary update
        setAllseat(oldseat => {
            return oldseat.map((seat) => {
                if (seat.seatId === seatId) {
                    // return the "updated" seat
                    const Updatedstatus = new Seat(seat.seatId, seat.planeType, seat.row, seat.column, seat.reservationId, seat.status == "Requested");
                    Updatedstatus.requested = true;
                    return Updatedstatus;
                }
                else
                    return seat;
            });
        });
        API.setStatusAvailable(seatId)
            .then(() => {
                AllAvailableStatus(props.type, "Available");
                AllRequestedseat(props.type, "Requested");
                AllOccupiedseat(props.type, "Occupied");
                getAllseat()
            })
            .catch(err => console.log(err));
    }



    return (
        <>
            <div className="container">
                <div className='Box'> {
                    props.loggedIn ?
                        <Link to={'/seat/reservation/list'}><button className="button2 button3" disabled={!props.loggedIn}><span> See your seats reservation and manage them </span> </button>   </Link>
                        : <p className='paragraph'> If you need to book a seat please do the login </p>
                }
                </div>
                <div className="row">
                    <div className="col">
                        <Row className='Box'>
                            <ol className="list-group list-group-numbered">
                                <li className="list-group-item" > <i className="bi bi-airplane-fill"></i> Plane Type : {props.type}</li>
                                <li className="list-group-item"><i className="bi bi-database-fill"></i> Total number of seats for this palne are : {allSeat.length}</li>
                                <li className="list-group-item"> <i className="bi bi-emoji-frown-fill"></i> Number Of Occupied seat on this planes  are : {OccupiedSeat.length}</li>
                                <li className="list-group-item"> <i className="bi bi-emoji-smile-upside-down"></i> Number Of Rquested seat on this planes are : {RequestedSeat.length} </li>
                                <li className="list-group-item"> <i className="bi bi-emoji-smile"></i> Number Of Available seat on this planes are : {availableSeat.length} </li>
                            </ol>

                        </Row>
                    </div>

                    <div className="col">
                        <Row>
                            <Col lg={10} className="mx-auto">
                                <SeatTable type={props.type} seat={allSeat} loggedIn={props.loggedIn}
                                    ChangeSeatStatus={ChangeSeatStatus}
                                    MakeStatusAvailable={MakeStatusAvailable} getAllseat={getAllseat} />
                            </Col>
                        </Row>
                    </div>
                </div>

            </div>

        </>
    );

}

function SeatTable(props) {
    const [showbutton, setShowbutton] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState({});
    const [allSelectedSeats, setallSelectedSeats] = useState([]);
    const [labels, setLabel] = useState([]);
    const [Message, SetMessage] = useState(false);


    let rows = [];
    let columns = [];
    switch (props.type) {
        case "Local":
            rows = [...Array(15).keys()];
            columns = [...Array(4).keys()]
            break;
        case "Regional":
            rows = [...Array(20).keys()];
            columns = [...Array(5).keys()]
            break;
        case "International":
            rows = [...Array(25).keys()];
            columns = [...Array(6).keys()]
            break;

    }
    // Confirm reservation bottun
    const handleConfirmSeats = async () => {
        const user = await API.getUserInfo();
        const type = props.type;
        const userId = user.id;
        try {

            for (let i = 0; i < allSelectedSeats.length; i++) {
                const seatId = allSelectedSeats[i];
                const seatLabel = labels[i];
                await API.setStatusOccupied(seatId);
                // Call the API to add the reservation
                await API.addReservation(type, userId, seatId, seatLabel);
            }
            SetMessage(true)
            props.getAllseat();
        }
        catch (error) {
        }
    };
    // check if user have already reserved plane on this plane Type
    const checkUserReservation = async () => {
        const user = await API.getUserInfo();
        const userID = user.id;
        const Usersreservation = await API.UserReservations(userID);
        try {
            for (const reservation of Usersreservation) {
                if (props.type === reservation.planeType) {
                    // is true, button will be disable to do confrimation
                    setShowbutton(false);
                    SetMessage(true)

                    break;
                    // if true, user will get notice that you have already reserved plane on this type
                }
            }
        }
        catch (error) {
            // Handle any errors that occur during the API calls or processing
            console.error(error);
        }
    }

    useEffect(() => {
        checkUserReservation()
    }, []);

    return (
        <>
            {showbutton ? <div className='ConfirmBut'><button className="button2 button3" onClick={handleConfirmSeats} disabled={Message} > Confirm Reqiested seats </button></div> : <p></p>}
            { Message && props.loggedIn ?  <p className='paragraph'> You booked from this type of plane. if you need you can modify your seats</p> : <p></p>}
            <Table className='table'>
                <tbody>
                    {rows.map((row) =>

                        <tr key={row}>
                            {

                                columns.map((column) => {
                                    const seat = props.seat.find(
                                        (s) => s.row === row + 1 && s.column === column + 1
                                    );
                                    const label = `${row + 1}${String.fromCharCode(65 + column)}`;
                                    return (

                                        <TableData key={column} setShowbutton={setShowbutton} loggedIn={props.loggedIn}
                                            seat={seat} label={label}
                                            ChangeSeatStatus={props.ChangeSeatStatus}
                                            setSelectedSeats={setSelectedSeats}
                                            setallSelectedSeats={setallSelectedSeats}
                                            allSelectedSeats={allSelectedSeats} selectedSeats={selectedSeats} MakeStatusAvailable={props.MakeStatusAvailable}
                                            setLabel={setLabel} labels={labels} getAllseat={props.getAllseat}
                                        />

                                    );
                                }
                                )
                            }
                        </tr>)
                    }
                </tbody>
            </Table>

        </>
    );
}
function TableData(props) {

    if (!props.seat)
        return;

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        props.setSelectedSeats(props.seat.seatId);
        if (isChecked) {
            props.ChangeSeatStatus(props.seat.seatId);
            props.setShowbutton(true); // Set setShowbutton to true when checkbox is checked
            props.setSelectedSeats(props.seat.seatId)
            props.setallSelectedSeats([...props.allSelectedSeats, props.seat.seatId])

            props.setLabel([...props.labels, props.label]);
            props.getAllseat();
        } else {
            props.setShowbutton(false); // Set setShowbutton to false when checkbox is unchecked
            props.MakeStatusAvailable(props.seat.seatId);
            props.setLabel(props.label);
        }
    };

    if (props.seat.status === "Occupied") {
        return <td key={props.seat.seatId}>
            <Form.Check type="checkbox" label={props.label + ' ' + props.seat.status} disabled={true} /><i className="bi bi-emoji-frown-fill"></i>
        </td>
    } else {
        return (
            <td key={props.seat.seatId}>
                <Form.Check type="checkbox" label={props.label + ' ' + props.seat.status} disabled={props.seat && props.seat.status === "Occupied" || !props.loggedIn}
                    onChange={handleCheckboxChange}
                /> <i className="bi bi-emoji-smile"></i>
            </td>
        );
    }

}



export { PlaneType, TableData };