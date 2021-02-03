import React, { useState } from "react";
import { Form } from "react-bootstrap";
import {getUser} from "../src/graphql/queries";
import { createUser, updateUser } from "../src/graphql/mutations";
import {withSSRContext} from "aws-amplify";
import { API } from "@aws-amplify/api";
import { Auth } from  "@aws-amplify/auth";
import Navbar from "../components/Navbar";

export async function getServerSideProps({req, res}) {
    const {Auth, API} = withSSRContext({req});
    try {
        const user = await Auth.currentAuthenticatedUser();
        const response = await API.graphql({
            query: getUser,
            variables: {id: user.attributes.sub},
        });
        if (response.data.getUser) {
            return {
                props: {
                    mode: "EDIT",
                    user: response.data.getUser,
                    error: false,
                },
            };
        } else {
            return {
                props: {
                    mode: "ADD",
                    error: false,
                },
            };
        }
    } catch (err) {
        console.log('error: ', err);
        return {
            props: {
                error: true,
            },
        };
    }
}

const EditUser = ({ error, user, mode } ) => {

    const [firstName, setFirstName] = useState(mode === 'EDIT' ? user.firstName : '');
    const [secondName, setSecondName] = useState(mode === 'EDIT' ? user.lastName : '');
    const [description, setDescription] = useState(mode === 'EDIT' ? user.description : '');

    const submitHandler = async (event) => {
        event.preventDefault();
        // Save Details
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log(currentUser)

        try {
            const result = await API.graphql({
                query: mode === 'EDIT' ? updateUser : createUser,
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
            window.location.href = "/"
        } catch (err) {
            console.log(err);
        }
    };

    if (error) {
        return (
            <div>
                <Navbar />
                <h1>Something went wrong. Please try again later.</h1>
            </div>
        )
    }

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