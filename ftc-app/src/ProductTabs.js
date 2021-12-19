import React, { useState } from "react";
import { Container, Navbar, Tabs, Tab } from 'react-bootstrap'
import Admin from "./Admin"
import AddCategory from "./MDComponent/AddCategory";
import AddMenu from "./AddMenu";

const ProductTabs = () => {
    const [key, setKey] = useState('menu');

    return (
        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            {/* <Tab eventKey="category" title="Add Category">
                <AddCategory />
            </Tab> */}
            <Tab eventKey="menu" title="Add/Edit Menu">
               <AddMenu/>
            </Tab>

        </Tabs>
    );

}

export default ProductTabs;