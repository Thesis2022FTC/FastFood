import React, { useState,useEffect } from 'react';
import { Card, Row, Col, ListGroup, ListGroupItem, Button,Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from '../redux/features/cartSlice';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, deleteDoc, doc,addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import db from '../config';
import moment from 'moment';
import QRCode from "react-qr-code";
import { Link, Redirect,useHistory } from "react-router-dom";
const MenuCard = ({ menu }) => {
  const { isLogin, isUserType } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const auth = getAuth();
  const user = auth.currentUser;
  const [disable, setDisable] = useState(false)
  const history=useHistory()
const [showBuyNowQR, setShowBuyNowQR] = useState(false);
const [buyNowItem, setBuyNowItem] = useState(null);
const [buyNowOrderId, setBuyNowOrderId] = useState('');
const [categories, setCategories] = useState([]);
const [activeCategory, setActiveCategory] = useState("All");
const [showAddToCartModal, setShowAddToCartModal] = useState(false);
const [mainMenuItem, setMainMenuItem] = useState(null);
const [drinkOptions, setDrinkOptions] = useState([]);
const [selectedDrinkForCart, setSelectedDrinkForCart] = useState(null);
const [selectedSize, setSelectedSize] = useState('Small'); // default
const getPriceWithSize = (basePrice, size) => {
  const price = Number(basePrice); // ensure it's a number

  switch (size) {
    case 'Medium':
      return price + 10;
    case 'Large':
      return price + 20;
    default:
      return price;
  }
};
useEffect(() => {
  if (!menu || menu.length === 0) return;

  const vendorUid = menu[0].uid; // get the UID from menu data

  const docRef = doc(db, "category", vendorUid);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setCategories(["All", ...(data.menu || [])]);
    }
  });

  return () => unsubscribe();
}, [menu]);

const handleConfirmAddToCart = () => {
  if (!mainMenuItem) return;

  dispatch(addCart({
    cartID: mainMenuItem.menuID,
    menuName: mainMenuItem.MenuName,
    Price: mainMenuItem.Price,
    Quantity: 1,
    uid: user.uid,
    Photo: mainMenuItem.Logo
  }));

   if (selectedDrinkForCart) {
    const finalDrinkPrice = getPriceWithSize(selectedDrinkForCart.Price, selectedSize);

    dispatch(addCart({
      cartID: selectedDrinkForCart.menuID + '-' + selectedSize.toLowerCase(), // unique ID with size
      menuName: `${selectedDrinkForCart.MenuName} (${selectedSize})`,
      Price: finalDrinkPrice,
      Quantity: 1,
      uid: user.uid,
      Photo: selectedDrinkForCart.Logo
    }));
  }

  setShowAddToCartModal(false);
  setSelectedDrinkForCart(null);
};


const handleAddToCartClick = (item) => {
  setMainMenuItem(item);
  const vendorUid = item.uid;

  const drinkQuery = query(
    collection(db, "menu"),
    where("uid", "==", vendorUid),
    where("Category", "==", "Drinks")
  );

  onSnapshot(drinkQuery, (snapshot) => {
    const drinksList = snapshot.docs.map(doc => doc.data());
    setDrinkOptions(drinksList);
    setShowAddToCartModal(true);
  });
};

const handleBuyNowClick = (item) => {
  const newOrderId = uuidv4();
  setBuyNowOrderId(newOrderId);
  setBuyNowItem(item);
  setShowBuyNowQR(true);
};



  const deleteMenu = async (item) => {
    await deleteDoc(doc(db, "menu", item))
    //   alert('Deleted')
    
   alert('Successfully Deleted!')
  }

  const addMenuToCart = (item) => {
    dispatch(addCart({
      cartID: item.menuID,
      menuName: item.MenuName,
      Price: item.Price,
      Quantity: 1,
      uid: user.uid,
      Photo: item.Logo
    }))

  }


  const handleBuyNowSubmit = async () => {
  const order = {
    orderID: buyNowOrderId,
    totalAmount: buyNowItem.Price,
    totalQuantity: 1,
    uid: user.uid,
    displayName: user.displayName,
    date: moment().format('LLLL'),
    cart: [{
      cartID: buyNowItem.menuID,
      menuName: buyNowItem.MenuName,
      Price: buyNowItem.Price,
      Quantity: 1,
      uid: user.uid,
      Photo: buyNowItem.Logo
    }]
  };

  await addDoc(collection(db, "order"), order);
  setShowBuyNowQR(false);
  history.push('/success-page');
};


 

  return (
    <>
                <div style={{
              display: "flex",
              overflowX: "auto",
              padding: "10px",
              marginBottom: "20px",
              gap: "10px"
            }}>
              {categories.map((cat, index) => (
                <Button
                  key={index}
                  onClick={() => setActiveCategory(cat)}
                  variant={activeCategory === cat ? "warning" : "outline-secondary"}
                  style={{
                    whiteSpace: "nowrap",
                    borderRadius: "25px",
                    padding: "5px 16px",
                    fontWeight: "bold"
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>

   <Row xs={1} sm={2} md={3} lg={4} className="g-4 p-3">
     {menu
        .filter((item) => {
          // Category filter
          if (activeCategory !== "All" && item.Category !== activeCategory) return false;

          // Filter by who can see it
          if (isUserType.UserType === 'Manager' && item.uid !== auth.currentUser?.uid) return false;
          if (isUserType.UserType !== 'Manager' && item.uid === auth.currentUser?.uid) return false;

          return true;
        })
        .map((item, idx) => (
          <Col key={idx}>
           <Card style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fefefe',
                height: '100%', // Ensures full height in column
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Card.Img
                  variant="top"
                  src={item.Logo}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                    borderRadius: '12px'
                  }}
                />
              </div>

              <Card.Body className="text-center pt-0">
                                <h6
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.MenuName}
                >
                  {item.MenuName}
                </h6>
                <p style={{ marginBottom: 0, fontSize: 14 }}>
                  <strong>Starts at:</strong> ₱{item.Price}
                </p>
              </Card.Body>

            <Card.Body className="text-center pt-0 pb-3">
  {isUserType.UserType === 'Customer' ? (
              <>
                <Button
                  onClick={() => handleAddToCartClick(item)}
                  style={{
                    background: 'linear-gradient(to right, #f4d03f, #f5b041)',
                    border: 'none',
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    padding: '6px 16px',
                    fontSize: '14px',
                    borderRadius: '25px',
                    width: '70%',
                    transition: 'all 0.3s ease',
                    marginBottom: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #f1c40f, #f39c12)';
                    e.target.style.color = '#fff';
                    e.target.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #f4d03f, #f5b041)';
                    e.target.style.color = '#2c3e50';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  🛒 Add to Cart
                </Button>

                <Button
                  onClick={() => handleBuyNowClick(item)} // Replace with your logic
                  style={{
                    background: 'linear-gradient(to right, #2ecc71, #27ae60)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '6px 16px',
                    fontSize: '14px',
                    borderRadius: '25px',
                    width: '70%',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #27ae60, #1abc9c)';
                    e.target.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  🛍 Buy Now
                </Button>
              </>
            ) : (
              <Button
                variant="danger"
                onClick={() => deleteMenu(item.menuID)}
                style={{
                  padding: '6px 16px',
                  fontSize: '14px',
                  borderRadius: '25px',
                  fontWeight: 'bold'
                }}
              >
                🗑 Delete
              </Button>
            )}
          </Card.Body>


            </Card>
          </Col>
        ))}
    </Row>
<Modal show={showBuyNowQR} onHide={() => setShowBuyNowQR(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Buy Now: Scan & Confirm</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {buyNowItem && (
      <div style={{ textAlign: 'center' }}>
        <p><strong>{buyNowItem.MenuName}</strong></p>
        <p>Price: ₱{buyNowItem.Price}</p>
        <QRCode value={buyNowOrderId} />
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowBuyNowQR(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleBuyNowSubmit}>
      Submit Order
    </Button>
  </Modal.Footer>
</Modal>
<Modal show={showAddToCartModal} onHide={() => setShowAddToCartModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Select a Drink</Modal.Title>
  </Modal.Header>
 <Modal.Body>
  {drinkOptions.length === 0 ? (
    <p>No drinks available.</p>
  ) : (
    <>
      <ListGroup>
        {drinkOptions.map((drink) => (
          <ListGroup.Item
            key={drink.menuID}
            active={selectedDrinkForCart?.menuID === drink.menuID}
            action
            onClick={() => setSelectedDrinkForCart(drink)}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img src={drink.Logo} alt={drink.MenuName} style={{ width: 40, height: 40, marginRight: 10 }} />
            <div>
              <div>{drink.MenuName}</div>
              <small>
                Base Price: ₱{drink.Price}
              </small>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {selectedDrinkForCart && (
        <div style={{ marginTop: 15 }}>
          <strong>Select Size:</strong>
          <div style={{ display: 'flex', gap: '10px', marginTop: 10 }}>
            {['Small', 'Medium', 'Large'].map(size => (
              <Button
                key={size}
                variant={selectedSize === size ? "warning" : "outline-secondary"}
                onClick={() => setSelectedSize(size)}
              >
                {size} (+₱{size === 'Small' ? 0 : size === 'Medium' ? 10 : 20})
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddToCartModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirmAddToCart}>Proceed</Button>
  </Modal.Footer>
</Modal>


    </>
  );
};

export default MenuCard;