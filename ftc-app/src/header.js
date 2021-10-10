import React, { useEffect } from "react"
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { clearUsers, isUserLogin } from './redux/features/userSlice'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'

const Header = () => {
    const { isLogin } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const auth = getAuth();
    const user = auth.currentUser;

    const logout = (e) => {
        e.preventDefault()
        dispatch(clearUsers())
        signOut(auth)
       
    }

    if(!isLogin){
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
                    <Nav.Link href={"/sign-up"} onClick={logout} >
                        Sign out</Nav.Link>

                </Nav>
            )
        }
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#">FTC Queuing System</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                        <NavDropdown title="FastFood" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#">Not yet</NavDropdown.Item>
                            <NavDropdown.Item href="#">Connected to</NavDropdown.Item>
                            <NavDropdown.Item href="#">Firebase</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">My Cart</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#">About</Nav.Link>
                        <Nav.Link href="#">Contact Us</Nav.Link>
                    </Nav>
                    <NavBarLogin />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Header;