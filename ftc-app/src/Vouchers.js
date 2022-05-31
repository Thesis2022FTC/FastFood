import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Alert,
  ProgressBar,
  Container,
  Stack,
  Table,
} from "react-bootstrap";
import { getAuth } from "@firebase/auth";
import voucher_codes from "voucher-code-generator"
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import db from "./config";
import { encode, decode } from "js-base64";
import { useSelector, useDispatch } from "react-redux";
import MenuCard from "./MDComponent/MenuCard";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Vouchers = () => {
  const [voucher,setVoucher]=useState([])
  const [price,setPrice]=useState(0)
    useEffect(() => {
    fetchVouchers();
    // console.log("Codes:", voucher)
  }, [voucher]);


  
  const fetchVouchers = async () => {
    // dispatch(clearStore())


    const q = query(collection(db, "vouchers"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vouch = [];
      querySnapshot.forEach((doc) => {
        vouch.push(doc.data());
      });
      setVoucher(vouch)
      console.log("Vouchers:", vouch);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const { companyname, fullname, seat, address1, address2, city, zip, drivethru, parkspace, startTime, endTime, description, uploadFile } = e.target.elements;

    // const base64Image=encode(uploadFile.files[0].name)
    const x= voucher_codes.generate({
        length: 10,
        count: 1,
        prefix:"promo-"
    });
    const vouchers = {
      promoCode:x,
      price:price
    };
    setDoc(doc(db, "vouchers", vouchers.promoCode[0]), vouchers);
    alert("Vouchers generated successfully " + x)
  };

  const PromoTable=()=>{
      return (
          <div>
              <Table striped bordered hover variant="light" responsive="md">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Voucher Code</th>
                        <th>Voucher Price</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {voucher/* .filter(item => item.uid === user.uid) */
                        .map((item, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.promoCode[0]}</td>
                                <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.price)}</td>
                               
                               
                            </tr>
                        )
                    }

                 
                </tbody>
            </Table>
          </div>
      )
  }

  return (  
    <Container className="auth-inner auth-wrapper"
      style={{ marginTop: 30, marginBottom: 30, backgroundColor: "#fff" }}
    >
      <Alert
        variant="dark"
        className="text-center blockquote"
        style={{ marginTop: 30, marginBottom: 30 }}
      >
        Vouchers Discount
      </Alert>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCompanyname">
            <Form.Label>Voucher Promo Price:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add voucher discount price"
              name="price"
              maxLength={3}
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Stack gap={2} className="col-md-5 mx-auto">
                        <Button variant="secondary" type="submit">Generate New Code</Button>
                    </Stack>
      </Form>
      <br></br>
      <PromoTable/>
    </Container>
  );
};

export default Vouchers;
