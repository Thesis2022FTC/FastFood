import React from 'react';
import { Card, Row, Col, ListGroup, ListGroupItem, Container } from "react-bootstrap";

const ProfileCard = ({ fastfood }) => {
  return (
    <div style={{
      background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
      minHeight: '100vh',
      padding: '30px 0'
    }}>
      <Container>
        <Row xs={1} md={1} className="g-4">
          {fastfood.map((item, idx) => (
            <Col key={idx}>
              <Card style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}>
                <Card.Header
                  as="h5"
                  style={{
                    backgroundColor: '#e6a535ff',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'uppercase', 
                    padding: '15px 20px'
                  }}
                >
                  {item.CompanyName}
                </Card.Header>

                <div style={{ textAlign: 'center', paddingTop: 20 }}>
                  <Card.Img
                    variant="top"
                    src={item.Logo}
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: 'contain',
                      marginBottom: 10
                    }}
                  />
                </div>

                <Card.Body style={{ padding: '20px 25px' }}>
                  <Card.Title style={{ fontWeight: '600', fontSize: '18px', marginBottom: '10px' }}>About Us</Card.Title>
                  <Card.Text className="text-muted" style={{ fontSize: '14px', textAlign: 'left' }}>
                    {item.Description}
                  </Card.Text>
                </Card.Body>

                <ListGroup className="list-group-flush">
                  <ListGroupItem className='bg-light text-start small'><strong>📍 Location:</strong> {item.Location}</ListGroupItem>
                  <ListGroupItem className='bg-light text-start small'><strong>👤 Manager:</strong> {item.Manager}</ListGroupItem>
                  <ListGroupItem className='bg-light text-start small'><strong>👥 Capacity:</strong> {item.Capacity} persons</ListGroupItem>
                  <ListGroupItem className='bg-light text-start small'><strong>🕒 Store Hours:</strong> {item.TimeStart} - {item.TimeClose}</ListGroupItem>
                  <ListGroupItem className='bg-light text-start small'><strong>🚗 Drive Thru:</strong> {item.Drivethru ? 'Yes' : 'No'}</ListGroupItem>
                  <ListGroupItem className='bg-light text-start small'><strong>🅿️ Parking Space:</strong> {item.ParkingSpace ? 'Yes' : 'No'}</ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProfileCard;
