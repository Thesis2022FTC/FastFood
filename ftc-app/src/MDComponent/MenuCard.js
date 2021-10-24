import React from 'react';
import { Card, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
const MenuCard = ({ menu }) => {
    const { isLogin, isUserType } = useSelector(state => state.user)
  return (
    <Row xs={4} md={6} className="g-4">
      {menu.map((item, idx) => (
        <Col>
          <Card>
            <Card.Img variant="top" src={item.Logo} style={{ width: 200, height: 200, flex: 1, alignSelf: 'center', padding: 10 }} />
            <Card.Body>
              <ListGroup className="list-group-flush" color='#23456f'>
              <ListGroupItem className='small'><strong></strong> {item.MenuName}</ListGroupItem>
              <ListGroupItem className='small'><strong>Starts at:</strong>  &#8369;{item.Price}</ListGroupItem>
              </ListGroup>
            </Card.Body>
            {isUserType.UserType == 'Customer' ?
            <Card.Body>
            
              <Card.Link href="#" className="btn btn-warning">Add to Cart</Card.Link>
            </Card.Body>:
            <Card.Body>
            <Card.Link  href="#"  className="btn btn-warning">Edit</Card.Link>
            <Card.Link href="#" className="btn btn-danger">Delete</Card.Link>
          </Card.Body>
            }
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default MenuCard;