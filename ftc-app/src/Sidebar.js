import React, { useState } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import Admin from "./Admin";
import ProductTabs from "./ProductTabs";
import Profile from './profile';
import QrCode from './QrCode';
import SignUpCashier from "./signupCashier";
import GenerateVouchers from "./Vouchers";
import './Sidebar.css';

const Sidebar = ({ usertype }) => {
  const [key, setKey] = useState(usertype === 'Manager' ? 'profile' : 'qrcode');

  const renderTabs = () => {
    const commonTabs = [
      { eventKey: 'qrcode', title: 'Scan Order', component: <QrCode /> }
    ];

    if (usertype === 'Cashier') return commonTabs;

    // Tabs specific for Manager
    return [
      { eventKey: 'profile', title: 'Profile', component: <Profile /> },
      { eventKey: 'admin', title: 'Add/Edit Profile', component: <Admin /> },
      { eventKey: 'vouchers', title: 'Generate Vouchers', component: <GenerateVouchers /> },
      { eventKey: 'cashier', title: 'Register New Cashier', component: <SignUpCashier /> },
      { eventKey: 'product', title: 'Add Product', component: <ProductTabs /> },
      ...commonTabs
    ];
  };

  return (
   <Tabs
  id="sidebar-tabs"
  activeKey={key}
  onSelect={(k) => setKey(k)}
  className="mb-3 custom-tabs"
>

      {renderTabs().map(({ eventKey, title, component }) => (
        <Tab key={eventKey} eventKey={eventKey} title={title}>
          {component}
        </Tab>
      ))}
    </Tabs>
  );
};

export default Sidebar;
