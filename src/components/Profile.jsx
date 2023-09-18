import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Form, Row, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import AuthContext from '../context/AuthContext';

import { getPersonalInfobyUser, updatePersonalInfo, updatePassword } from '../api';

const Profile = () => {

    const [userInfo, setUserInfo] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [addressCity, setAddressCity] = useState("");
    const [addressStreet, setAddressStreet] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messagePersonalInfo, setMessagePersonalInfo] = useState('');

    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const userData = await getPersonalInfobyUser();

                if (!userData) {
                    console.log('Error Fetching Userdata', error)
                }
                setUserInfo(userData)
            }

            catch (error) {
                console.log(error)
            }
        }

        fetchUserData();
    }, [])

    //Handle Logout 
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        dispatch({
            type: 'LOGOUT'
        });

        console.log('logout')
        navigate('/');
    }

    //Update Personal Information
    const handleUpdate = async () => {

        const updatedData = {
            ...(firstName ? { first_name: firstName } : {}),
            ...(lastName ? { last_name: lastName } : {}),
            ...(email ? { email: email } : {}),
            ...(phoneNumber ? { phone_number: phoneNumber } : {}),
            ...(addressStreet ? { address_street: addressStreet } : {}),
            ...(addressCity ? { address_city: addressCity } : {}),
            ...(zipCode ? { address_zipcode: zipCode } : {})
        };

        try {
            const result = await updatePersonalInfo(updatedData);

        } catch (error) {
            console.error('Error updating', error.message)
        }

        setMessagePersonalInfo('Personal info updated successfully');
        setFirstName(updatedData.first_name || firstName);
        setLastName(updatedData.last_name || lastName);
        setEmail(updatedData.email || email);
        setPhoneNumber(updatedData.phone_number || phoneNumber);
        setAddressCity(updatedData.address_city || addressCity);
        setAddressStreet(updatedData.address_street || addressStreet);
        setZipCode(updatedData.address_zipcode || zipCode);

    };

    //Update Password
    const handlePasswordUpdate = async () => {

        if (newPassword !== confirmNewPassword) {
            setMessage("New passwords do not match")
            return;
        }
        try {
            const response = await updatePassword(currentPassword, newPassword);

            if (response.success) {
                setMessage("Password updated successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");

            } else {
                setMessage(response.message || "Error updating password.");
            }

        } catch (error) {
            setMessage("Error updating password")
        }
    }

    return (
        <div>
            <div className='d-flex justify-content-end'>
                <Button
                    variant="danger"
                    onClick={handleLogout}
                    className='my-5 mx-5'
                >
                    Logout
                </Button>
            </div>

            <Tabs
                defaultActiveKey="profile"
                id="fill-tab-example"
                className="mb-3"
                fill
            >
                {/* First Tab */}
                <Tab eventKey="profile" title="Profile">
                    {messagePersonalInfo && <p className='text-danger mx-3'> {`**${messagePersonalInfo}`} </p>}
                    <Form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={userInfo.first_name} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={userInfo.last_name} />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={userInfo.email} />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPhone">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={userInfo.phone_number} />
                            </Form.Group>
                        </Row>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>

                </Tab>

                {/* Second Tab */}
                <Tab eventKey="password" title="Update Password">
                    <Form onSubmit={(e) => { e.preventDefault(); handlePasswordUpdate(); }}>

                        {message && <p className='text-danger mx-3'> {`**${message}`} </p>}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>*Current Password</Form.Label>
                                <Form.Control required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current Password" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridNewPassword">
                                <Form.Label>* New Password</Form.Label>
                                <Form.Control required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New Password" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridConfirmNewPassword">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} type="password" placeholder="New Password" />
                            </Form.Group>
                        </Row>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Tab>

                {/* Third Tab */}
                <Tab eventKey="address" title="Shipping Address">
                    <p className='text-danger mx-3'> * We only ship order inside US</p>
                    {messagePersonalInfo && <p className='text-danger mx-3'> {`**${messagePersonalInfo}`} </p>}
                    <Form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} placeholder={userInfo.address_street} />
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder={userInfo.address_city} />
                            </Form.Group>

                            {/* Dummy as DB does not have State Column */}
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>State</Form.Label>
                                <Form.Select defaultValue="Choose...">
                                    <option>Choose...</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorado</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="DC">District Of Columbia</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder={userInfo.address_zipcode} />
                            </Form.Group>
                        </Row>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Tab>
            </Tabs>
        </div>
    )
}

export default Profile