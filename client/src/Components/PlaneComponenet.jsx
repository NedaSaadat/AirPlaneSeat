import { Row, Col, Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';



function MainPagePlanes(props) {
    return (
        <div>
            <div className='mainpage'>
                <h3 className='paragraph'> Dear passenger, if you plan to book a flight, you must do the login to our website </h3>
                <h4 className='paragraph'> List of available plans for today </h4>
                <div className="btn-group">
                    <Link to={'Plane/Local'}> <button className="button"><span>Local </span>  </button> </Link>
                    <Link to={'Plane/Regional'}><button className="button"><span>Regional</span> </button>  </Link>
                    <Link to={'Plane/International'}><button className="button"><span> International</span> </button>  </Link>

                </div>

            </div>
        </div >





    );

}

export default MainPagePlanes;