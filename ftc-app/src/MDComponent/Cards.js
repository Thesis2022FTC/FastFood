import React from 'react';
import { Card, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";

const CardGrid = ({ fastfood }) => {

  return (
    <Row xs={2} md={3} className="g-4">
      {fastfood.map((item, idx) => (
        <Col>
          <Card>
            <Card.Img variant="top" src={item.Logo} style={{ width: 200, height: 200, flex: 1, alignSelf: 'center', padding: 10 }} />
            <Card.Body>
              <Card.Title>{item.CompanyName}</Card.Title>
              <Card.Text className='small'>
                {item.Description}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem className='small'><strong>Location:</strong> {item.Location}</ListGroupItem>
              <ListGroupItem className='small'><strong>Manager:</strong> {item.Manager}</ListGroupItem>
              <ListGroupItem className='small'><strong>Capacity:</strong> {item.Capacity} persons</ListGroupItem>
              <ListGroupItem className='small'><strong>Store Hours:</strong> {item.TimeStart + ' - ' + item.TimeClose} </ListGroupItem>
              <ListGroupItem className='small'><strong>Drive Thru:</strong> {item.Drivethru ? 'Yes' : 'No'} </ListGroupItem>
              <ListGroupItem className='small'><strong>Parking Space:</strong> {item.ParkingSpace ? 'Yes' : 'No'}</ListGroupItem>

            </ListGroup>
            <Card.Body>
              <Card.Link href="#" className="btn btn-success">Go to Menu</Card.Link>
              <Card.Link href="#" className="btn btn-success">Company Profile</Card.Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default CardGrid;