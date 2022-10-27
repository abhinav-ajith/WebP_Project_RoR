import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../App";

const NewMemberModal = ({ show, onHide }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [rollError, setRollError] = useState(false);
  const { userToken } = useContext(AppContext);

  const onHideSub = useCallback(() => {
    setRollNumber("");
    setRollError(false);
    setPosition("");
    setLoading(false);
    onHide();
  }, [setRollNumber, setRollError, setPosition, setLoading, onHide]);

  const handleAddition = useCallback(
    (e) => {
      e.preventDefault();
      //const roll = rollNumber.toLowerCase();

      setLoading(true);
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "club_member_add",
          { roll_no: rollNumber, position },
          { headers: { Authorization: `${userToken}` } }
        )
        .then((res) => {
          setLoading(false);
          if (res.data.msg === "Member added.") {
            onHideSub();
          } else {
            // eslint-disable-next-line
            throw "dead";
          }
        })
        .catch(() => {
          setRollError(true);
          setLoading(false);
        });
    },
    [rollNumber, position, onHideSub, userToken]
  );

  return (
    <Modal onHide={onHideSub} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">New Member</Modal.Title>
        <button className="btn-close" onClick={onHideSub} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Roll Number</Form.Label>
            <Form.Control
              required
              placeholder="Enter roll number"
              onChange={(e) => {
                setRollError(false);
                setRollNumber(e.target.value);
              }}
              value={rollNumber}
              isInvalid={rollError}
            />
          </Form.Group>
          {rollError && <div class="alert alert-danger">Invalid user</div>}
          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              required
              placeholder="Enter position"
              onChange={(e) => setPosition(e.target.value)}
              value={position}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {loading && <Spinner animation="border" />}
        <Button onClick={handleAddition}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewMemberModal;
