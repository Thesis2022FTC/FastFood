import React, { useEffect, useState } from 'react';
import { Alert, Table, Button, Image, Modal,Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import NumericInput from 'react-numeric-input';
import { addQuantity, clearCart, removeItem, subQuantity, updateCart } from '../redux/features/cartSlice';
import QRCode from "react-qr-code";
import moment from 'moment';
import { doc, setDoc, collection, query, where, onSnapshot,addDoc} from "firebase/firestore";
import db from '../config';
import { v4 as uuidv4 } from 'uuid';
import { Link, Redirect,useHistory } from "react-router-dom";

const MyCart = () => {
    const { isLogin, isUserType } = useSelector(state => state.user)
    const { cart } = useSelector(state => state.cart)
    const [orderID, setOrderID] = useState()
    const dispatch = useDispatch()
    const auth = getAuth();
    const user = auth.currentUser;
    const items = useSelector(state => state.cart.cart);
    let total = items.reduce((sum, item) => sum + item.Quantity * item.Price, 0);
    const [newTotal,setNewTotal]=useState(0)
    const [promo,setPromo]=useState(0)
    const [code,setCode]=useState("")
    const qty = items.reduce((sum, item) => sum + item.Quantity, 0);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const history=useHistory()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => {
        setShow2(true);
        handleClose()
    }

    useEffect(()=>{
        setOrderID(uuidv4())
        console.log('ORDERID:',orderID)
    },[cart])

    const ProceedButton=()=>{
        handleClose()
        handleSubmit()
        dispatch(clearCart())
        history.push('/success-page')
    }

    const handleSubmit = async () => {
        
        const myOrder = {
            orderID: orderID,
            totalAmount:total,
            totalQuantity:qty,
            uid: user.uid,
            displayName: user.displayName,
            date:moment().format('LLLL'),
            cart:cart
        }

         addDoc(collection(db, "order"), myOrder);
      
    }

    function handleChange(event) {
        
        if(event.target.value==='Promo'){
            setPromo(80)
            total=total-80
            setNewTotal(total)
        
        }
        console.log(event.target.value, newTotal);
        
      }

    const OrderTable=()=>{
        return (
            <div>
                            <Table striped bordered hover variant="light" responsive="md">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Menu Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  
                </tr>
            </thead>
            <tbody>
                {cart.filter(item => item.uid === user.uid)
                    .map((item, index) =>
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.menuName}</td>
                            <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Price)}</td>
                            <td>
                               {item.Quantity}
                              </td>
                            <td> {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Quantity * item.Price)}</td>
                            
                           
                            {/* <td ><Button variant="success">Edit </Button></td>
                <td ><Button variant="success">Del</Button></td> */}
                        </tr>
                    )
                }

                <tr className=''>
                    <th colSpan={1}>

                    </th>
                    <th colSpan={3}>
                        Total Amount To Pay({qty} items)
                    </th>
                    <td colSpan={2} style={{ fontSize: 18, fontWeight: 'bold' }}>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(total)}</td>
                    
                </tr>
                {
                    promo!==0?
               
                <tr className=''>
                    <th colSpan={1}>

                    </th>
                <th colSpan={3}>
                        Promo Code Dicounts:    
                    </th>
                <td colSpan={2} style={{ fontSize: 18, fontWeight: 'bold', color:'red' }}>-{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(promo)}</td>
                </tr>:
                null
                 }
                   {
                    promo!==0?
               
                <tr className=''>
                    <th colSpan={1}>

                    </th>
                <th colSpan={3}>
                       Discounted Price:       
                    </th>
                <td colSpan={2} style={{ fontSize: 18, fontWeight: 'bold', color:'#000' }}>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(newTotal)}</td>
                </tr>:
                null
                 }
            </tbody>
        </Table>
       
        {
                    promo===0? <input type="text" placeholder='Enter Voucher Code' onChange={handleChange} />:null}
            <label style={{fontSize:10,color:'#555555'}}>Please present your Priviledge card (Senior ID, PWD ID, etc) on the store to avail discounts. </label>
            {/* <label style={{fontSize:10,color:'red'}}>Note: </label> */}
            </div>

        )
    }

    return (
        <Container  style={{ padding: 30, marginTop: 40 }} >
            <Alert variant="warning" className="text-center blockquote">My Cart</Alert>
            <Table striped bordered hover variant="light" responsive="md">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Menu Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th colSpan="3" >Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.filter(item => item.uid === user.uid)
                        .map((item, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td><Image thumbnail src={item.Photo} roundedCircle width={100} /></td>
                                <td>{item.menuName}</td>
                                <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Price)}</td>
                                <td>
                                    <input type='number' value={item.Quantity} disabled style={{
                                        color: '#000', backgroundColor: '#fff', width: 40, textAlign: 'center', fontSize: 16
                                    }} />
                                    {/* <NumericInput min={0} max={100} value={item.Quantity}
                                    style={{
                                        input: {
                                            color: '#000',
                                            width: 50
                                        }
                                    }}
                                        
                                /> */}</td>
                                <td> {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Quantity * item.Price)}</td>
                                <td ><Button style={{ fontSize: 14, fontWeight: 'bold', width: 40, height: 40 }} variant="success" onClick={() => dispatch(subQuantity(item))}>-</Button></td>
                                <td ><Button style={{ fontSize: 14, fontWeight: 'bold', width: 40, height: 40 }} variant="success" onClick={() => dispatch(addQuantity(item))}>+</Button></td>
                                <td ><Button style={{ fontSize: 14, height: 40 }} variant="danger" onClick={() => dispatch(removeItem(item.cartID))}>Remove</Button></td>
                                {/* <td ><Button variant="success">Edit </Button></td>
                    <td ><Button variant="success">Del</Button></td> */}
                            </tr>
                        )
                    }

                    <tr className=''>
                        <th colSpan={5  }>

                        </th>
                        <th colSpan={3}>
                            Total Amount To Pay({qty} items)
                        </th>
                        <td colSpan={2} style={{ fontSize: 24, fontWeight: 'bold' }}>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(total)}</td>
                    </tr>
                </tbody>
            </Table>
            <Button variant='warning' className="btn btn-warning" onClick={handleShow}>Check out</Button>

            {/* MODAL */}



            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Review your orders before you proceed.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   
                
                    <div>
                     
                        <OrderTable/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleShow2}>
                       Proceed
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Save and Present this to the cashier.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <QRCode value={orderID} />
                       
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={ProceedButton}>
                       Submit Order
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>


    )
}

export default MyCart;