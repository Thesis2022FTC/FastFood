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
    <Row xs={1} sm={2} md={3} className="g-4 p-3">
      {fastfood.map((item, idx) => (
        <Col key={idx}>
          <Card
            style={{
              backgroundColor: '#f8f9fa',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '16px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
              border: 'none',
              transition: 'transform 0.2s ease'
            }}
            className="hover-shadow"
          >
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
              <Card.Img
                variant="top"
                src={item.Logo}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
              />
            </div>

            <Card.Body>
              <Card.Title
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#2c3e50'
                }}
              >
                {item.CompanyName}
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={item.Description}
              >
                {item.Description}
              </Card.Text>
            </Card.Body>

        <ListGroup className="list-group-flush">
  <ListGroupItem className="small bg-light text-start">
    <strong>📍 Location:</strong> {item.Location}
  </ListGroupItem>
  <ListGroupItem className="small bg-light text-start">
    <strong>👥 Capacity:</strong> {item.Capacity} persons
  </ListGroupItem>
  <ListGroupItem className="small bg-light text-start">
    <strong>⏰ Store Hours:</strong> {item.TimeStart} - {item.TimeClose}
  </ListGroupItem>
  <ListGroupItem className="small bg-light text-start">
    <strong>🚗 Drive Thru:</strong> {item.Drivethru ? 'Yes' : 'No'}
  </ListGroupItem>
  <ListGroupItem className="small bg-light text-start">
    <strong>🅿️ Parking Space:</strong> {item.ParkingSpace ? 'Yes' : 'No'}
  </ListGroupItem>
</ListGroup>


            <Card.Body className="text-center">
              <Button
                variant="primary"
                onClick={() => addToCart(item.uid)}
                style={{
                  borderRadius: '30px',
                  fontWeight: '600',
                  padding: '10px 24px',
                  background: 'linear-gradient(to right, #4facfe, #00f2fe)',
                  border: 'none',
                  color: '#fff',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #00c6ff, #0072ff)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #4facfe, #00f2fe)';
                  e.target.style.transform = 'scale(1)';
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
