
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
import '../App.css'

function NavHeader(props) {
  return (
    <div className='Navbar'>
      <Navbar >
        <Container fluid>
          <Link to='/' className='navbar-brand'> <i className="bi bi-airplane-engines"><p className='wellcome'>  Wellcome to Neda Airline </p> </i></Link>
          {props.loggedIn ?
            <LogoutButton logout={props.handleLogout} /> :
            <Link to='/login' className='btn btn-outline-light  button2 button3 '>Login</Link>
          }
        </Container>

      </Navbar>
    </div>
  );
}

export default NavHeader;