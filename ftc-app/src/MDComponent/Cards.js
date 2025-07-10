import React from 'react';
import { Card, Row, Col, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getUid } from '../redux/features/fastfood';
import { useHistory } from "react-router-dom";

const CardGrid = ({ fastfood }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const addToCart = (uid) => {
    dispatch(getUid(uid));
    history.push('/add-to-cart');
  };

  return (
    <Row xs={1} sm={2} md={3} className="g-4">
      {fastfood.map((item, idx) => (
        <Col key={idx}>
          <Card
            style={{
              backgroundColor: '#F9E79F',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              <Card.Img
                variant="top"
                src={item.Logo}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'contain'
                }}
              />
            </div>

            <Card.Body>
              <Card.Title
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                {item.CompanyName}
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}
                title={item.Description}
              >
                {item.Description}
              </Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
              <ListGroupItem style={{ backgroundColor: '#F9E79F' }} className='small'><strong>Location:</strong> {item.Location}</ListGroupItem>
              <ListGroupItem style={{ backgroundColor: '#F9E79F' }} className='small'><strong>Capacity:</strong> {item.Capacity} persons</ListGroupItem>
              <ListGroupItem style={{ backgroundColor: '#F9E79F' }} className='small'><strong>Store Hours:</strong> {item.TimeStart} - {item.TimeClose}</ListGroupItem>
              <ListGroupItem style={{ backgroundColor: '#F9E79F' }} className='small'><strong>Drive Thru:</strong> {item.Drivethru ? 'Yes' : 'No'}</ListGroupItem>
              <ListGroupItem style={{ backgroundColor: '#F9E79F' }} className='small'><strong>Parking Space:</strong> {item.ParkingSpace ? 'Yes' : 'No'}</ListGroupItem>
            </ListGroup>

            <Card.Body className="text-center">
             <Button
                  variant="warning"
                  onClick={() => addToCart(item.uid)}
                  className="btn btn-warning order-btn"
                  style={{
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    padding: '8px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    background: '#f4d03f',
                    color: '#2c3e50',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f39c12';
                    e.target.style.color = '#fff';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f4d03f';
                    e.target.style.color = '#2c3e50';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  🛍 Order Now
                </Button>

            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardGrid;
