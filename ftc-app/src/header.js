import React, { useEffect, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { clearUsers, getUser, isUserLogin, isUser } from './redux/features/userSlice'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Navbar, Container, Nav, NavDropdown, Badge, Button } from 'react-bootstrap'
import Avatar from 'react-avatar';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from './config'
import { MdHomeFilled, MdOutlineArrowBackIos ,MdOutlineShoppingCart} from "react-icons/md";

const Header = () => {
    const history = useHistory()
    const { isLogin, users } = useSelector(state => state.user)
    const { cart } = useSelector(state => state.cart)
    const [profile, setProfile] = useState([])
    const dispatch = useDispatch()
    const auth = getAuth();
    const user = auth.currentUser;
    const [qty, setQty] = useState(0)

    
    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }


    }, [user])

    useEffect(() => {
        setQty(cart.length)
    }, [cart])


    const logout = (e) => {
        e.preventDefault()
        alert("Sign out now?")
        dispatch(clearUsers())
        signOut(auth)
    }

    const fetchUserProfile = async () => {
        const q = query(collection(db, "userProfile"), where("uid", "==", user.uid));
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
                <Nav >
                   
                    <Nav.Link eventKey={2} onClick={() => history.goBack()}>
                        <p><MdOutlineArrowBackIos color="#fff" /></p>
                    </Nav.Link>

                    {profile.UserType === 'Customer' ?

                        <Nav.Link eventKey={2} onClick={() => history.push('/my-cart')}>
                           <MdOutlineShoppingCart color="white"/>  <Badge bg="black">{qty}</Badge>
                            <span className="visually-hidden">cart</span>
                        </Nav.Link> : null}

                    <NavDropdown
                    title={<Avatar name={user.displayName} size="30" round={true} />}
                    id="avatar-dropdown"
                    style={{ marginRight: 60 }}
                  >
                    {/* Display Name */}
                    <NavDropdown.Item
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 12,
                        width: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <Avatar
                        round={true}
                        name={user.displayName}
                        size="20"
                        style={{ marginRight: 8 }}
                      />
                      {user.displayName}
                    </NavDropdown.Item>

                    {/* Email */}
                    <NavDropdown.Item
                      style={{
                        fontSize: 10,
                        paddingLeft: 16,
                        paddingRight: 16,
                        width: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={user.email} // Shows full email on hover
                    >
                      {user.email}
                    </NavDropdown.Item>

               
                    {/* User Type */}
                    <NavDropdown.Item
                      style={{
                        fontSize: 10,
                        paddingLeft: 16,
                        paddingRight: 16,
                        width: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {profile.UserType}
                    </NavDropdown.Item>
                    {profile.UserType === "Customer" && (
                      <NavDropdown.Item
                        style={{
                          fontSize: 10,
                          paddingLeft: 16,
                          paddingRight: 16,
                          width: 200,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        href="/order-history" // optional: link to your order history route
                      >
                        Order History
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Divider />

                    <NavDropdown.Item href="/sign-in" onClick={logout}>
                      Sign out
                    </NavDropdown.Item>
                  </NavDropdown>


                                  </Nav>
                              )
                          }
                      }

    return (

        <Navbar collapseOnSelect expand="lg" /* bg="light" variant="light"  */style={{backgroundColor:'#F39C12'/* backgroundImage: `url(${background})`, resizeMode:'contains' */}} >
            <Container>
                <Navbar.Brand><img src="https://firebasestorage.googleapis.com/v0/b/fastfood-queue.appspot.com/o/logo.png?alt=media&token=f11496b7-01cd-477c-ac9c-23f7c5f9aa10" width={50}  alt="Logo" className="d-inline-block align-top"/>
                
                </Navbar.Brand>
                <p><b>The Best Fastfood Ordering App</b></p>
                
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <NavBarLogin />
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )
}
export default Header;

//<MdHomeFilled /><Button variant="light" style={{backgroundColor:'#F39C12'}} onClick={() => history.push('/dashboard')}>Home</Button>