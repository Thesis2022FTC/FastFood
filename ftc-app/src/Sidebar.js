import React, { useState } from "react";
import { Container, Navbar, Tabs, Tab } from 'react-bootstrap'
import Admin from "./Admin"
import ProductTabs from "./ProductTabs";
import Profile from './profile'
import QrCode from './QrCode'

const Sidebar = ({ usertype }) => {
  const [key, setKey] = useState(usertype == 'Manager' ? 'profile' : 'qrcode');

  return (

    usertype == 'Cashier' ?
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        {/* <Tab eventKey="profile" title="Profile">
          <Profile />
        </Tab>
        <Tab eventKey="admin" title="Add/Edit Profile">
          <Admin />
        </Tab>
        <Tab eventKey="product" title="Add Product">
          <ProductTabs />
        </Tab> */}
        <Tab eventKey="qrcode" title="Scan Order">
          <QrCode />
        </Tab>
      </Tabs> : <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="profile" title="Profile">
          <Profile />
        </Tab>
        <Tab eventKey="admin" title="Add/Edit Profile">
          <Admin />
        </Tab>
        <Tab eventKey="product" title="Add Product">
          <ProductTabs />
        </Tab>
        <Tab eventKey="qrcode" title="Scan Order">
          <QrCode />
        </Tab>
      </Tabs>
  )



}

export default Sidebar;