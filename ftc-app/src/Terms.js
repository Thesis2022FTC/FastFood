import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <Container style={{ padding: '2rem', backgroundColor: '#fffbe6', borderRadius: '8px', marginTop: '2rem', textAlign:'left'}}>
      <h2 className="mb-4">Terms and Conditions</h2>
      
      <p><strong>Effective Date:</strong> July 11, 2025</p>

      <p>
        Welcome to our FastFood Ordering Platform. By accessing or using our app, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
      </p>

      <h5>1. Account Registration</h5>
      <p>
        You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </p>

      <h5>2. Ordering and Payments</h5>
      <p>
        All orders placed through our platform are subject to acceptance and availability. Prices and menu items may vary depending on the vendor. Payment is required at the time of order placement via the available payment methods.
      </p>

      <h5>3. Cancellations and Refunds</h5>
      <p>
        Once an order is confirmed, it cannot be canceled through the app. Refunds for incorrect or unsatisfactory orders are subject to vendor policies and must be handled directly with the store.
      </p>

      <h5>4. User Conduct</h5>
      <p>
        You agree not to misuse the platform for fraudulent purposes, submit false information, or attempt unauthorized access to our systems. Misuse of the platform may result in account termination.
      </p>

      <h5>5. Legal Compliance</h5>
      <p>
        All users must comply with applicable local food safety regulations and digital commerce laws. We are not liable for the quality, safety, or legality of the food or services offered by vendors.
      </p>

      <h5>6. Privacy</h5>
      <p>
        We collect basic information to facilitate your orders and improve your experience. Please refer to our <em>Privacy Policy</em> for details on how we handle your data.
      </p>

      <h5>7. Changes to Terms</h5>
      <p>
        We reserve the right to update these Terms and Conditions at any time. Continued use of the platform following any changes constitutes your acceptance of those changes.
      </p>

      <h5>8. Contact</h5>
      <p>
        For questions or concerns regarding these terms, please contact our support team at <a href="mailto:support@fastfoodapp.com">support@fastfoodapp.com</a>.
      </p>

     
    </Container>
  );
};

export default Terms;
