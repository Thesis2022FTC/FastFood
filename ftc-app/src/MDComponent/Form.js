import React, { useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { getAuth } from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import db from '../config';
import { encode, decode } from 'js-base64';

const FormComponent = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();
    const [url, setUrl] = useState('')
    const [srcFile, setSrcFile] = useState()
    let srcUrl = ''
    const metadata = {
        contentType: 'image/jpeg'
    };
    const changeHandler = (event) => {
        setSrcFile(event.target.files[0]);


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { companyname, fullname, seat, address1, address2, city, zip, drivethru, parkspace, startTime, endTime, description, uploadFile } = e.target.elements;

        // const base64Image=encode(uploadFile.files[0].name)
        const company = {
            CompanyName: companyname.value,
            Capacity: seat.value,
            Manager: fullname.value,
            CreatedBy: user.uid,
            Description: description.value,
            DriveThru: drivethru.value == 'on' ? true : false,
            Location: `${address1.value} ${address2.value} ${city.value} ${zip.value}`,
            ParkingSpace: parkspace.value == 'on' ? true : false,
            TimeStart: startTime.value,
            TimeClose: endTime.value,

        }


        const storageRef = ref(storage, user.uid + '/' + srcFile.name/* uploadFile.files[0].name */);

        const uploadTask = uploadBytesResumable(storageRef, srcFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }

            },
            (error) => {
                alert("Please try again!", error)
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // setUrl(downloadURL)
                    console.log('File available at', downloadURL);
                    company['Logo'] = downloadURL
                    setTimeout(() => {
                        setDoc(doc(db, "fastfood", user.uid), company);
                        alert('Record has been saved!')
                    }, 5000);
                });

            }
        );


    }

    return (
        <div className="container auth-inner auth-wrapper" style={{ marginTop: 30 }}>
            <Alert variant="light" className="text-center blockquote">Add New Company Here</Alert>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCompanyname">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Company name" name='companyname' required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridManager">
                        <Form.Label>Manager's Name</Form.Label>
                        <Form.Control type="text" placeholder="Full name" name='fullname' required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridManager">
                        <Form.Label>Seating Capacity</Form.Label>
                        <Form.Control type="number" placeholder="Enter seat capacity" name='seat' defaultValue="0" required />
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Company Short Description</Form.Label>
                    <Form.Control type='text' as="textarea" rows={3} required name="description" />
                </Form.Group>
                <Row className='mb-3'>
                    <Form.Group as={Col} controlId="formGridLocation">
                        <Form.Label>Address</Form.Label>
                        <Form.Control placeholder="1234 Main St" name='address1' required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLocation2">
                        <Form.Label>Address 2</Form.Label>
                        <Form.Control placeholder="Apartment, studio, or floor" name="address2" />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" placeholder="City" name="city" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control type="number" placeholder="zip/postal code" name="zip" />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} className="mb-3" id="formGridDrive">
                        <Form.Label>Do you have Drive Thru?</Form.Label>
                        <Form.Check type="radio" label="Yes" name="drivethru" required />
                        <Form.Check type="radio" label="No" name="drivethru" required />
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" id="formGridPark">
                        <Form.Label>Do you have Parking Space?</Form.Label>
                        <Form.Check type="radio" label="Yes" name="parkspace" required />
                        <Form.Check type="radio" label="No" name="parkspace" required />
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" id="formGridTimeStart">
                        <Form.Label>Store Opening Time</Form.Label>
                        <Form.Select aria-label="Default select example" name="startTime" required>
                            <option>Select opening hour</option>
                            <option value="12:00 am">12:00 am</option>
                            <option value="1:00 am">1:00 am</option>
                            <option value="2:00 am">2:00 am</option>
                            <option value="3:00 am">3:00 am</option>
                            <option value="4:00 am">4:00 am</option>
                            <option value="5:00 am">5:00 am</option>
                            <option value="6:00 am">6:00 am</option>
                            <option value="7:00 am">7:00 am</option>
                            <option value="8:00 am">8:00 am</option>
                            <option value="9:00 am">9:00 am</option>
                            <option value="10:00 am">10:00 am</option>
                            <option value="11:00 am">11:00 am</option>
                            <option value="12:00 pm">12:00 pm</option>
                            <option value="1:00 pm">1:00 pm</option>
                            <option value="2:00 pm">2:00 pm</option>
                            <option value="3:00 pm">3:00 pm</option>
                            <option value="4:00 pm">4:00 pm</option>
                            <option value="5:00 pm">5:00 pm</option>
                            <option value="6:00 pm">6:00 pm</option>
                            <option value="7:00 pm">7:00 pm</option>
                            <option value="8:00 pm">8:00 pm</option>
                            <option value="9:00 pm">9:00 pm</option>
                            <option value="10:00 pm">10:00 pm</option>
                            <option value="11:00 pm">11:00 pm</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" id="formGridTimeClose">
                        <Form.Label>Store Closing time</Form.Label>
                        <Form.Select aria-label="Default select example" name="endTime" required>
                            <option>Select closing hour</option>
                            <option value="12:00 am">12:00 am</option>
                            <option value="1:00 am">1:00 am</option>
                            <option value="2:00 am">2:00 am</option>
                            <option value="3:00 am">3:00 am</option>
                            <option value="4:00 am">4:00 am</option>
                            <option value="5:00 am">5:00 am</option>
                            <option value="6:00 am">6:00 am</option>
                            <option value="7:00 am">7:00 am</option>
                            <option value="8:00 am">8:00 am</option>
                            <option value="9:00 am">9:00 am</option>
                            <option value="10:00 am">10:00 am</option>
                            <option value="11:00 am">11:00 am</option>
                            <option value="12:00 pm">12:00 pm</option>
                            <option value="1:00 pm">1:00 pm</option>
                            <option value="2:00 pm">2:00 pm</option>
                            <option value="3:00 pm">3:00 pm</option>
                            <option value="4:00 pm">4:00 pm</option>
                            <option value="5:00 pm">5:00 pm</option>
                            <option value="6:00 pm">6:00 pm</option>
                            <option value="7:00 pm">7:00 pm</option>
                            <option value="8:00 pm">8:00 pm</option>
                            <option value="9:00 pm">9:00 pm</option>
                            <option value="10:00 pm">10:00 pm</option>
                            <option value="11:00 pm">11:00 pm</option>

                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="position-relative mb-3">
                        <Form.Label>Upload Logo</Form.Label>
                        <Form.Control
                            type="file"
                            required
                            name="uploadFile"
                            onChange={changeHandler}
                            accept="image/*"
                        />
                    </Form.Group>
                </Row>
                <div className="text-center">
                    <Button variant="primary" type="submit" >
                        Save Now
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default FormComponent;