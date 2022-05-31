import React, { useState } from 'react';
import { Card, Row, Col, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from '../redux/features/cartSlice';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import db from '../config';

const MenuCard = ({ menu }) => {
  const { isLogin, isUserType } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const auth = getAuth();
  const user = auth.currentUser;
  const [disable, setDisable] = useState(false)

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

  return (
    <Row xs={4} md={6} className="g-4">
      {menu.filter((item)=>isUserType.UserType === 'Manager' ?item.uid===user.uid:item.uid!==user.uid)
      .map((item, idx) => (
        <Col>
          <Card>
            <Card.Img variant="top" src={item.Logo} style={{ width: 100, height: 100, alignSelf: 'center', padding: 10 }} />
            <Card.Body>
              <ListGroup className="list-group-flush" color='#23456f'>
                <ListGroupItem className='small'><strong></strong> {item.MenuName}</ListGroupItem>
                <ListGroupItem className='small'><strong>Starts at:</strong>  &#8369;{item.Price}</ListGroupItem>
              </ListGroup>
            </Card.Body>
            {isUserType.UserType == 'Customer' ?
              <Card.Body>

                <Button variant='warning' onClick={() => addMenuToCart(item)} className="btn btn-warning">Add to Cart</Button>
              </Card.Body> :
              <Card.Body>
                {/* <Card.Link href="#" className="btn btn-warning" >Edit</Card.Link> */}
                <Card.Link className="btn btn-danger" onClick={() => { deleteMenu(item.menuID) }}> Delete</Card.Link>
              </Card.Body>
            }
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default MenuCard;