import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../App";
import { useNavigate } from "react-router";

const SALoginModal = ({ show, onHide }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUserToken, setUserType } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = useCallback(() => {
    const errorsNew = {};

    if (password.length < 4) {
      errorsNew.password = true;
    }

    if (errorsNew.email || errorsNew.password) {
      setErrors(errorsNew);
      return;
    }

    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "login/sa", { username: username, password: password })
      .then((res) => {
        setLoading(false);
        if (res.data.access_token) {
          setUserToken(res.data.access_token);
          setUserType("SA");
          if (remember) {
            localStorage.setItem("userToken", res.data.access_token);
            localStorage.setItem("userType", "SA");
          }
          navigate("/admin");
        } else {
          setErrors({ login: true });
        }
      });
  }, [username, password, remember, navigate, setUserToken, setUserType]);

  return (
    <Modal onHide={onHide} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">System Admin Login</Modal.Title>
        <button className="btn-close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              isInvalid={errors.username}
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

export default SALoginModal;
