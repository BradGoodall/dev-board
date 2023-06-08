import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaHashtag } from 'react-icons/fa'

interface Props {
    title: string;
}

function TopNavbar(props: Props) {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">
                        <FaHashtag id="nav-icon" />
                        {props.title}
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default TopNavbar;