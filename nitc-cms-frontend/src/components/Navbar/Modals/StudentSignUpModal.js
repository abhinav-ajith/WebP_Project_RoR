import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../App";
import { useNavigate } from "react-router";

const StudentSignUpModal = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setc_password] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUserToken, setUserType } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSignUp = useCallback(() => {
    const errorsNew = {};
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.toLowerCase())) {
      errorsNew.email = true;
    }
    if (password.length < 6) {
      errorsNew.password = true;
    }

    if (errorsNew.email || errorsNew.password) {
      setErrors(errorsNew);
      return;
    }

    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "register", {
        name: name,
        roll_no: rollNo,
        email: email,
        password: password,
        confirm_password: c_password,
      })
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
  }, [email, password, c_password, name, rollNo, remember, navigate, setUserToken, setUserType]);

  return (
    <Modal onHide={onHide} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Student Sign Up</Modal.Title>
        <button className="btn-close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              isInvalid={errors.name}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicRollNo">
            <Form.Label>Roll Number</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter NITC Roll Number"
              onChange={(e) => setRollNo(e.target.value)}
              value={rollNo}
              isInvalid={errors.rollNo}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              isInvalid={errors.email}
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

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setc_password(e.target.value)}
              value={c_password}
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
        <Button onClick={handleSignUp}>Sign Up</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentSignUpModal;
