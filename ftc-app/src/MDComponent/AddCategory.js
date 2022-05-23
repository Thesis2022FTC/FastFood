import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert, ProgressBar, Container, Stack, Table } from "react-bootstrap";
import { getAuth } from "@firebase/auth";
import { doc, setDoc, collection, query, where, onSnapshot,addDoc} from "firebase/firestore";
import db from '../config';
import { encode, decode } from 'js-base64';
import { useSelector, useDispatch } from "react-redux";


const AddCategory = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [catName, setCategory] = useState([])
    const [categoryName, setCategoryName] = useState()
    const [visible, setVisible] = useState(false)


    useEffect(() => {
        fetchCategory();

    }, []);

    const fetchCategory = async () => {
        // dispatch(clearStore())
        const q = query(collection(db, "category"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const category = [];
            querySnapshot.forEach((doc) => {
                category.push(doc.data());

            });
            setCategory(category)
            console.log('Catgeory:',catName)
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const { companyname, fullname, seat, address1, address2, city, zip, drivethru, parkspace, startTime, endTime, description, uploadFile } = e.target.elements;

        // const base64Image=encode(uploadFile.files[0].name)
        const productcategory = {
            CategoryName: categoryName,
            uid: user.uid
        }
         addDoc(collection(db, "category"), productcategory);
        fetchCategory();
       
    }

    return (
        <Container  style={{ marginTop: 30, marginBottom: 30 }}>
            <Alert variant="dark" className="text-center blockquote" style={{ marginTop: 30, marginBottom: 30 }}>Add/Update Food Category</Alert>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCompanyname">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control type="text" placeholder="Example: Burger, Fries, Chicken..." name='categoryName' required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </Form.Group>
                </Row>


                <div className="text-center" style={{ marginBottom: 30 }}>
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <Button variant="secondary" type="submit">Save it now!</Button>

                    </Stack>
                </div>
            </Form>

            <Table striped bordered hover variant="light" responsive="md">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Category Name</th>
                        {/* <th colSpan="3" >Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {catName.filter(item=>item.uid===user.uid)
                        .map((item, index) =>
                            <tr>
                                <td>{index+1}</td>
                                <td>{item.CategoryName}</td>
                                 {/* <td ><Button variant="success">Add Meal</Button></td> */}
                                {/* <td ><Button variant="success">Edit </Button></td>
                                <td ><Button variant="success">Del</Button></td> */}
                            </tr>
                        )
                    }


                </tbody>
            </Table>
        </Container>
    )
}

export default AddCategory;

