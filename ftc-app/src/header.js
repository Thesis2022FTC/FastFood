import React, { useEffect, useRef,useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { clearUsers, getUser, isUserLogin,isUser } from './redux/features/userSlice'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap'
import Avatar from 'react-avatar';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from './config'

const Header = () => {
    const history=useHistory()
    const { isLogin,users} = useSelector(state => state.user)
    const [profile, setProfile] = useState([])
    const dispatch = useDispatch()
    const auth = getAuth();
    const user=auth.currentUser;

    useEffect(() => {
        let isSubscribed = true
        if (isSubscribed) {
            // dispatch(getUser(user))
            fetchUserProfile();
        }
        return () => isSubscribed = false

    }, [user.uid])


    const logout = (e) => {
        e.preventDefault()
        alert("Sign out now?")
        dispatch(clearUsers())
        signOut(auth)
        
    }

    const fetchUserProfile= async () => {
        const q = query(collection(db, "userProfile"),where("uid","==",user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userProfile = [];
            querySnapshot.forEach((doc) => {
                setProfile(doc.data())
                dispatch(isUser(doc.data()))
        });
            });
            

    }

    if (!isLogin) {
        return <Redirect to={'/sign-in'} />
    }

    const NavBarLogin = () => {
        if (!isLogin) {
            return (
               null
            )
        }
        else {
            // dispatch(getUser(user))
            return (
                <Nav>
                    <Nav.Link eventKey={2} href="#">
                        My Cart <Badge bg="secondary">0</Badge>
                        <span className="visually-hidden">unread messages</span>
                    </Nav.Link>

                    <NavDropdown title={<Avatar name={user.displayName} size="30" round={true} />} id="avatar-dropdown" style={{ marginRight: 20 }}>

                        <NavDropdown.Item href="/profile"><Avatar round={true} name={user.displayName} size="20" style={{ marginRight: 5 }} />{user.displayName}</NavDropdown.Item>
                        <NavDropdown.Item  style={{ fontSize: 10 }}>{user.email}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        {profile.UserType==='Manager'?<NavDropdown.Item onClick={()=>history.push('/admin')}>
                            Admin Panel</NavDropdown.Item>:null}
                        <NavDropdown.Item href={"/sign-in"} onClick={logout}>Sign out</NavDropdown.Item>
                    </NavDropdown>

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

