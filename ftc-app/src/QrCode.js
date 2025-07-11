import QrReader from 'react-qr-reader';
import React, { useState } from "react";
import { Container, Row, Col, Card, Alert, Badge } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDocs, query, collection, where, onSnapshot } from "firebase/firestore";
import db from './config';

const QrCodeReader = () => {
    const [cart, setCart] = useState([]);
    const [data, setData] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;

const handleProceedPayment = async () => {
  try {
    const q = query(collection(db, "order"), where("orderID", "==", data));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("Order not found.");
      return;
    }

    const updatedCart = [...cart];

    snapshot.forEach(async (docSnapshot, index) => {
      const docRef = doc(db, "order", docSnapshot.id);

      // Update Firestore
      await updateDoc(docRef, { status: "paid" });

      // Update local state manually
      updatedCart[index] = {
        ...updatedCart[index],
        status: "paid"
      };

      // Re-set state to trigger UI re-render
      setCart(updatedCart);
    });

    alert("Payment status updated to 'paid'. ✅");

  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update payment status.");
  }
};


    const handleScan = (data) => {
        if (data) {
            setData(data);
            alert('Scanned Successfully!');
            fetchCart(data);
        }
    };

    const fetchCart = async (orderID) => {
        const q = query(collection(db, "order"), where("orderID", "==", orderID));
        onSnapshot(q, (querySnapshot) => {
            const fetchedCart = [];
            querySnapshot.forEach((doc) => fetchedCart.push(doc.data()));
            setCart(fetchedCart);
            console.log("Cart:", fetchedCart);
        });
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} className="d-flex justify-content-center mb-4">
                    <Card className="shadow p-4 text-center" style={{ width: '100%', maxWidth: '400px' }}>
                        <Card.Title className="mb-4 text-primary">Scan QR Code</Card.Title>
                        <QrReader
                            delay={500}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%' }}
                        />
                    </Card>
                </Col>

                {cart.length !== 0 && (
                    <Col md={6}>
                        <Card className="shadow p-4 text-start">
                            <Card.Title className="mb-3 text-success">Order Details</Card.Title>
                            <p><Badge bg="secondary" className="me-1">Order ID:</Badge> {data}</p>
                            <p><Badge bg="secondary" className="me-1">Date:</Badge> {cart[0].date}</p>
                            <p><Badge bg="secondary" className="me-1">Customer:</Badge> {cart[0].displayName}</p>

                            <hr />

                            <h6 className="text-muted">Items</h6>
                            {cart[0].cart.map((item, i) => (
                                <Alert key={i} variant="light" className="border">
                                    <strong>{item.menuName}</strong>
                                </Alert>
                            ))}

                            <hr />

                            <p><Badge bg="secondary">Quantity:</Badge> {cart[0].totalQuantity}</p>
                            <p><Badge bg="secondary">Total:</Badge> {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'PHP' }).format(cart[0].totalAmount)}</p>
                        <p>
                        <Badge bg={cart[0].status === "paid" ? "success" : "warning"} className="me-2">
                            Status:
                        </Badge>
                        {cart[0].status}
                        </p>
                        </Card>
                        <div className="mt-4">
                         <button className="btn btn-primary" onClick={handleProceedPayment}>Proceed to Payment</button>
                        </div>
                       

                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default QrCodeReader;
