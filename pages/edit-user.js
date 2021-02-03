import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { createUser, updateUser } from "../src/graphql/mutations";
import { API } from "@aws-amplify/api";
import { Auth } from  "@aws-amplify/auth";
import Navbar from "../components/Navbar";

const EditUser = () => {
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [description, setDescription] = useState('');

    const submitHandler = async (event) => {
        event.preventDefault();
        // Save Details
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log(currentUser)

        try {
            const result = await API.graphql({
                query: createUser,
                variables: {
                    input: {
                        id: currentUser.attributes.sub,
                        firstName: firstName,
                        lastName: secondName,
                        description: description
                    }
                }
            })
            console.log(result)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center w-100 h-100">
            <Navbar />
            <h1 className="align-self-center">Edit User Details</h1>
            <Form className="w-50 align-self-center">
                <Form.Group className="mt-2" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        placeholder="Enter Your First Name"
                        onChange={(event) => {
                            setFirstName(event.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group className="mt-2" controlId="secondName">
                    <Form.Label>Second Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={secondName}
                        placeholder="Enter Your Second Name"
                        onChange={(event) => {
                            setSecondName(event.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group className="mt-2" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={description}
                        rows={5}
                        placeholder="Enter Your Description"
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                    />
                </Form.Group>
                <button
                    type="submit"
                    onClick={submitHandler}
                    className="btn btn-primary"
                >
                    Submit
                </button>
            </Form>
        </div>
    );
};
export default EditUser;