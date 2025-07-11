import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from '../config';
import { Container, Card, Alert, Row, Col } from "react-bootstrap";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "order"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="text-center mt-5">Loading orders...</div>;

  return (
    <Container className="py-5">
      <h3 className="mb-4 text-center">Order History</h3>

      {orders.length === 0 ? (
        <Alert variant="info">You have no past orders.</Alert>
      ) : (
        orders.map((order, index) => (
          <Card key={index} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Order ID: {order.orderID}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Date: {order.date}
              </Card.Subtitle>
              <p>Status: <strong>{order.status}</strong></p>
              <p>Total Quantity: {order.totalQuantity}</p>
              <p>Total Amount: {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'PHP' }).format(order.totalAmount)}</p>
              <hr />
              <Row>
                {order.cart && order.cart.map((item, idx) => (
                  <Col md={6} key={idx}>
                    <p><strong>{item.menuName}</strong></p>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderHistory;
