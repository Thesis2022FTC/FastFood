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
      if (snapshot.empty) return alert("Order not found.");

      const updatedCart = [...cart];
      snapshot.forEach(async (docSnapshot, index) => {
        const docRef = doc(db, "order", docSnapshot.id);
        await updateDoc(docRef, { status: "paid" });

        updatedCart[index] = { ...updatedCart[index], status: "paid" };
        setCart(updatedCart);
      });

      alert("✅ Payment status updated to 'paid'");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("❌ Failed to update payment status.");
    }
  };

  const handleScan = (data) => {
    if (data) {
      setData(data);
      alert('✅ Scanned Successfully!');
      fetchCart(data);
    }
  };

  const fetchCart = async (orderID) => {
    const q = query(collection(db, "order"), where("orderID", "==", orderID));
    onSnapshot(q, (querySnapshot) => {
      const fetchedCart = [];
      querySnapshot.forEach((doc) => fetchedCart.push(doc.data()));
      setCart(fetchedCart);
    });
  };

  const handleError = (err) => console.error(err);

  return (
    <Container fluid className="py-5" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Row className="justify-content-center align-items-start">
        <Col md={5} className="mb-4">
          <Card
            className="shadow-lg border-0"
            style={{
              borderRadius: "20px",
              background: "linear-gradient(to bottom, #e6a535ff, #ebedee)"
            }}
          >
            <Card.Body className="text-center p-4">
              <Card.Title className="mb-4 fs-4 text-dark fw-bold">📷 Scan QR Code</Card.Title>
              <div
                style={{
                  border: "4px dashed #ddd",
                  borderRadius: "16px",
                  padding: "12px",
                  background: "#fff",
                }}
              >
                <QrReader
                  delay={500}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "100%" }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {cart.length > 0 && (
          <Col md={6}>
            <Card
              className="shadow-lg border-0"
              style={{
                borderRadius: "20px",
                background: "#ffffff"
              }}
            >
              <Card.Body className="p-4 text-start">
                <Card.Title className="text-success fw-bold mb-3">🧾 Order Summary</Card.Title>
                <p><Badge bg="secondary">Order ID</Badge> <span className="ms-2">{data}</span></p>
                <p><Badge bg="secondary">Date</Badge> <span className="ms-2">{cart[0].date}</span></p>
                <p><Badge bg="secondary">Customer</Badge> <span className="ms-2">{cart[0].displayName}</span></p>

                <hr />

                <h6 className="text-muted mb-2">🛒 Items</h6>
                {cart[0].cart.map((item, i) => (
                  <Alert key={i} variant="light" className="border rounded-pill px-3 py-2">
                    <strong>{item.menuName}</strong>
                  </Alert>
                ))}

                <hr />

                <p><Badge bg="secondary">Quantity</Badge> <span className="ms-2">{cart[0].totalQuantity}</span></p>
                <p><Badge bg="secondary">Total</Badge> <span className="ms-2">
                  {new Intl.NumberFormat('tl-PH', {
                    style: 'currency',
                    currency: 'PHP'
                  }).format(cart[0].totalAmount)}
                </span></p>

                <p>
                  <Badge bg={cart[0].status === "paid" ? "success" : "warning"}>
                    {cart[0].status === "paid" ? "✅ Paid" : "⏳ Unpaid"}
                  </Badge>
                </p>

                {cart[0].status !== "paid" && (
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                      onClick={handleProceedPayment}
                    >
                      💳 Confirm Payment
                    </button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default QrCodeReader;
