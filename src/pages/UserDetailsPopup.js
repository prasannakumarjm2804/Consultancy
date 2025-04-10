import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UserDetailsPopup = ({ showModal, setShow }) => {


  const handleClose = () => setShow(false);


  return (
    <>

     <Modal show={showModal} onHide={handleClose} centered>

        <Modal.Header closeButton>
          <Modal.Title>Please fill the details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          

            <Form.Group controlId="mobileNumber" className="mt-3">
              <Form.Label>Mobile Number*</Form.Label>
              <div className="d-flex">
                <span className="border p-2 bg-light">IN</span>
                <Form.Control
                  type="text"
                  placeholder="e.g. 81XXXXXXXX"
                  className="ms-2"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your Email" />
            </Form.Group>

            <Form.Group controlId="state" className="mt-3">
              <Form.Label>State*</Form.Label>
              <Form.Select>
                <option>Tamil Nadu</option>
                <option>Karnataka</option>
                <option>Maharashtra</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" disabled>
            Verify via OTP
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserDetailsPopup;
