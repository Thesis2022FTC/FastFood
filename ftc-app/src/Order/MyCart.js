import React, { useEffect, useState, useMemo } from 'react';
import { Alert, Table, Button, Image, Modal, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { addQuantity, clearCart, removeItem, subQuantity } from '../redux/features/cartSlice';
import QRCode from "react-qr-code";
import moment from 'moment';
import { collection, query, where, addDoc, getDocs,updateDoc } from "firebase/firestore";
import db from '../config';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";

const OrderTable = ({
  cart,
  user,
  total,
  qty,
  promo,
  newTotal,
  code,
  setCode,
  validatePromoCode
}) => {
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
          {cart.filter(item => item.uid === user.uid).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.menuName}</td>
              <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Price)}</td>
              <td>{item.Quantity}</td>
              <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Quantity * item.Price)}</td>
            </tr>
          ))}

          <tr>
            <th colSpan={1}></th>
            <th colSpan={3}>Total Amount To Pay ({qty} items)</th>
            <td style={{ fontSize: 18, fontWeight: 'bold' }}>
              {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(total)}
            </td>
          </tr>

          {promo !== 0 && (
            <>
              <tr>
                <th colSpan={1}></th>
                <th colSpan={3}>Promo Code Discounts:</th>
                <td style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
                  -{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(promo)}
                </td>
              </tr>
              <tr>
                <th colSpan={1}></th>
                <th colSpan={3}>Discounted Price:</th>
                <td style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(newTotal)}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Enter Voucher Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ flex: 1, padding: '8px', fontSize: 16, borderRadius: 4 }}
        />
        <Button onClick={validatePromoCode}>Apply Promo</Button>
      </div>
    </div>
  );
};

const MyCart = () => {
  const { cart } = useSelector(state => state.cart);
  const auth = getAuth();
  const user = auth.currentUser;
  const items = useSelector(state => state.cart.cart);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.Quantity * item.Price, 0), [items]);
  const qty = useMemo(() => items.reduce((sum, item) => sum + item.Quantity, 0), [items]);

  const dispatch = useDispatch();
  const history = useHistory();

  const [orderID, setOrderID] = useState('');
  const [promo, setPromo] = useState(0);
  const [newTotal, setNewTotal] = useState(0);
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    setOrderID(uuidv4());
  }, [cart]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);

  const handleShow2 = () => {
    setShow2(true);
    handleClose();
  };

  const handleSubmit = async () => {
    const myOrder = {
      orderID,
      totalAmount: total,
      totalQuantity: qty,
      uid: user.uid,
      displayName: user.displayName,
      date: moment().format('LLLL'),
      cart
    };

    await addDoc(collection(db, "order"), myOrder);
  };

  const ProceedButton = () => {
    handleSubmit();
    dispatch(clearCart());
    history.push('/success-page');
  };

  const validatePromoCode = async () => {
  const inputCode = code.trim();
  if (!inputCode) return;

  const q = query(
    collection(db, "vouchers"),
    where("promoCode", "array-contains", inputCode),
    where("status", "==", "active") // 🔍 Only unused vouchers
  );

  try {
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("❌ Invalid, expired, or already used voucher code.");
      return;
    }

    const docRef = snapshot.docs[0].ref;
    const voucher = snapshot.docs[0].data();
    const expiration = voucher.expiration?.toDate?.();
    const now = new Date();

    if (expiration && expiration < now) {
      alert("⚠️ Voucher code is expired.");
      return;
    }

    // ✅ Apply discount
    const discount = voucher.price || 0;
    setPromo(discount);
    setNewTotal(total - discount);
    alert(`🎉 Promo code applied! You saved ₱${discount}`);

        await updateDoc(docRef, {
        status: "expired",
        usedBy: user.uid,
        usedAt: new Date(),
        });

  } catch (err) {
    console.error("Error validating code:", err);
    // alert("Something went wrong while checking the promo.");
  }
};


  return (
    <Container style={{ padding: 30, marginTop: 40 }}>
      <Alert variant="warning" className="text-center blockquote">
        <b>{user.displayName.toUpperCase()}'s Cart</b>
      </Alert>

      <Table striped bordered hover variant="light" responsive="md">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Menu Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th colSpan="3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.filter(item => item.uid === user.uid).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td><Image thumbnail src={item.Photo} roundedCircle width={100} /></td>
              <td>{item.menuName}</td>
              <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Price)}</td>
              <td>
                <input
                  type='number'
                  value={item.Quantity}
                  disabled
                  style={{ color: '#000', backgroundColor: '#fff', width: 40, textAlign: 'center', fontSize: 16 }}
                />
              </td>
              <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.Quantity * item.Price)}</td>
              <td>
                <Button variant="success" onClick={() => item.Quantity > 1 && dispatch(subQuantity(item))}>-</Button>
              </td>
              <td>
                <Button variant="success" onClick={() => dispatch(addQuantity(item))}>+</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => dispatch(removeItem(item.cartID))}>Remove</Button>
              </td>
            </tr>
          ))}

          <tr>
            <th colSpan={5}></th>
            <th colSpan={3}>Total Amount To Pay ({qty} items)</th>
            <td colSpan={2} style={{ fontSize: 24, fontWeight: 'bold' }}>
              {new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(total)}
            </td>
          </tr>
        </tbody>
      </Table>

      <Button
        onClick={handleShow}
        style={{
          background: 'linear-gradient(135deg, #f4d03f, #f5b041)',
          color: '#2c3e50',
          fontWeight: 'bold',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '30px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        Check Out
      </Button>

      {/* Review Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Review your orders before you proceed.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderTable
            cart={cart}
            user={user}
            total={total}
            qty={qty}
            promo={promo}
            newTotal={newTotal}
            code={code}
            setCode={setCode}
            validatePromoCode={validatePromoCode}
          />
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

      {/* QR Modal */}
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
  );
};

export default MyCart;
