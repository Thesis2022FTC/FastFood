import React from "react"
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { clearUsers, isUserLogin } from './redux/features/userSlice'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'

const Header = ({ link, link2 }) => {
    const { isLogin } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const logout = () => {
        dispatch(clearUsers())
        return <Redirect to={'/sign-in'} />
    }

    const NavBarLogin = () => {
        if (!isLogin) {
            return (
                <Nav>
                    <Nav.Link href="/sign-up">Sign up</Nav.Link>
                   
                </Nav>
            )
        }
        else {
            return (
                <Nav>
                    <Nav.Link eventKey={2} href="#">
                        My Cart
                    </Nav.Link>
                    <Nav.Link eventKey={2} href="/sign-in">
                        Sign out</Nav.Link>
                </Nav>
            )
        }
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">FTC Queuing System</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                        <NavDropdown title="FastFood" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Not yet</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Connected to</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Firebase</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">My Cart</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#pricing">About</Nav.Link>
                        <Nav.Link href="#pricing">Contact Us</Nav.Link>
                    </Nav>
                    <NavBarLogin />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Header;