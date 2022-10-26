import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../App";
import { useNavigate } from "react-router";

const StudentLoginModal = ({ show, onHide }) => {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUserToken, setUserType } = useContext(AppContext);

  const handleLogin = useCallback(() => {
    const errorsNew = {};
    if (password.length < 6) {
      errorsNew.password = true;
    }

    if (errorsNew.email || errorsNew.password) {
      setErrors(errorsNew);
      return;
    }

    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "login/student", { roll_no: rollNo, password: password })
      .then((res) => {
        setLoading(false);
        if (res.data.access_token) {
          setUserToken(res.data.access_token);
          setUserType("student");
          if (remember) {
            localStorage.setItem("userToken", res.data.access_token);
            localStorage.setItem("userType", "student");
          }
          navigate("/student");
        } else {
          setErrors({ login: true });
        }
      });
  }, [rollNo, password, remember, navigate, setUserToken, setUserType]);

  return (
    <Modal onHide={onHide} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Student Login</Modal.Title>
        <button className="btn-close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicRollNo">
            <Form.Label>Roll Number</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter NITC Roll Number"
              onChange={(e) => setRollNo(e.target.value)}
              value={rollNo}
              isInvalid={errors.roll_no}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              isInvalid={errors.password}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check label="Remember me" checked={remember} onChange={() => setRemember(!remember)} />
          </Form.Group>
          {errors.login && <div class="alert alert-danger">Invalid username or password</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {loading && <Spinner animation="border" />}
        <Button onClick={handleLogin}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentLoginModal;
