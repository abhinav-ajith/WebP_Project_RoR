import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../App";
import { useNavigate } from "react-router";

const VenueAddModal = () => {
  const [name, setName] = useState("");

  const contextInfo = useContext(AppContext);
  const navigate = useNavigate();

  const handleCreate = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "venue_add",
          {
            venue_name: name,
          },
          { headers: { Authorization: `${contextInfo.userToken}` } }
        )
        .then(() => {
          navigate("/admin");
        });
    },
    [name, contextInfo, navigate]
  );

  return (
    <Modal.Dialog size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">New Venue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Venue Name</Form.Label>
            <Form.Control
              required
              type="name"
              placeholder="Enter venue name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreate}>Make Venue</Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default VenueAddModal;
