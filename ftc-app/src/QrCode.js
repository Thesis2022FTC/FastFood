import QrReader from 'react-qr-reader'
import React, { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from './config';

const QrCodeReader = () => {
    const [cart, setCart] = useState([])
    const auth = getAuth();
    const user = auth.currentUser;
    const [data, setData] = useState()
    const handleScan = data => {
        if (data) {
            setData(data)
            alert('Scanned Successfully!', data)
            fetchCart(data)
        }
    }

    const fetchCart = async (data) => {
        // dispatch(clearStore())
        const q = query(collection(db, "order"), where("orderID", "==", data));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cart = [];
            querySnapshot.forEach((doc) => {
                cart.push(doc.data());
                // dispatch(getStore(doc.data()))
            });
            setCart(cart)
            console.log(JSON.stringify(cart))

        });

    }

    const handleError = err => {
        console.error(err)
    }
    return (
        <Container style={{ padding: 30 }}>
            <Row>
                <Col>
                    <div className='auth-wrapper '>
                        <QrReader
                            delay={500}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '50%' }}
                        />

                    </div>
                </Col>
                {
                    cart.length!=0?
                    <Col>
                        <div className='auth-wrapper auth-inner' style={{ padding: 20 }}>
                            <Alert variant='info'>OrderID: {data}</Alert>
                            <Alert variant='info'>Date: {cart[0].date}</Alert>
                            <Alert variant='info'>Customer: {cart[0].displayName}</Alert>
                            {cart[0].cart.map((item, i) => (
                                <Alert variant='info'>Item {i + 1} : {item.menuName + '\n'}</Alert>
                            ))}

                            <Alert variant='info'>Quantity: {cart[0].totalQuantity}</Alert>
                            <Alert variant='info'>Total Amount:{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(cart[0].totalAmount)}</Alert>

                        </div>
                    </Col>:null
                }
            </Row>
        </Container>
    )

}

export default QrCodeReader;