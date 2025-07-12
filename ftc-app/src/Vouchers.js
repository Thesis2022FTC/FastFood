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
  addDoc, Timestamp, orderBy
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
const [vouchersRaw, setVouchersRaw] = useState([]);
  const [voucherList, setVoucherList] = useState([]);
  const fetchVouchers = () => {
  const q = query(
    collection(db, "vouchers"),
    orderBy("expiration", "desc")
  );


  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const vouch = [];
    const now = new Date();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const expiration = data.expiration?.toDate(); // convert Firestore Timestamp to JS Date
      const isExpired = expiration && expiration < now;

      vouch.push({
        ...data,
        status: isExpired ? "expired" : "active"
      });
    });

    setVoucher(vouch);
    console.log("Vouchers:", vouch);
  });

  return unsubscribe;
};

 useEffect(() => {
    const q = query(collection(db, 'vouchers'), orderBy('expiration', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const v = [];
      querySnapshot.forEach((doc) => v.push(doc.data()));
      setVouchersRaw(v);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateVoucherStatuses = () => {
      const now = new Date();
      const updated = vouchersRaw.map((item) => {
        const expirationDate = item.expiration?.toDate?.() || new Date(item.expiration);
        const isExpired = expirationDate < now;
        return {
          ...item,
          status: isExpired ? 'expired' : 'active',
        };
      });
      setVoucherList(updated);
    };

    updateVoucherStatuses();
    const interval = setInterval(updateVoucherStatuses, 5000); // update every 5s

    return () => clearInterval(interval);
  }, [vouchersRaw]);


useEffect(() => {
  const unsubscribe = fetchVouchers();
  return () => unsubscribe(); // clean up on unmount
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // const { companyname, fullname, seat, address1, address2, city, zip, drivethru, parkspace, startTime, endTime, description, uploadFile } = e.target.elements;

    // const base64Image=encode(uploadFile.files[0].name)
    const expirationDate = new Date();
    //expirationDate.setDate(expirationDate.getDate() + 7); // add 7 days
    expirationDate.setSeconds(expirationDate.getSeconds() + 30); // add 30 seconds for testing
    const x= voucher_codes.generate({
        length: 10,
        count: 1,
        prefix:"promo-"
    });
    const vouchers = {
      promoCode:x,
      price:price,
      expiration: Timestamp.fromDate(expirationDate), // Firestore-friendly format
      status:"active"
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
                        <th>Expiration</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {voucher/* .filter(item => item.uid === user.uid) */
                        .map((item, index) =>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.promoCode[0]}</td>
                                <td>{new Intl.NumberFormat('tl-PH', { style: 'currency', currency: 'Php' }).format(item.price)}</td>
                                <td>
                                    {item.expiration?.toDate?.().toLocaleDateString('en-PH', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </td>
                               <td>{item.status}</td>
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
       <Alert  className="text-center blockquote" style={{ marginTop: 30,  marginBottom:30,backgroundColor:"#e6a535ff",   color: 'white',
                         fontWeight: 'bold',
                         textTransform: 'uppercase',padding: '15px 20px', margin:'5px'}}>
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
