import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../App";
import { useNavigate } from "react-router";

const CALoginModal = ({ show, onHide, clubs }) => {
  const [club, setClub] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUserToken, setUserType } = useContext(AppContext);
  const navigate = useNavigate();

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
    axios.post(process.env.REACT_APP_BACKEND_URL + "login/ca", { club_name: club, password: password }).then((res) => {
      setLoading(false);
      if (res.data.access_token) {
        setUserToken(res.data.access_token);
        setUserType("CA");
        if (remember) {
          localStorage.setItem("userToken", res.data.access_token);
          localStorage.setItem("userType", "CA");
        }
        navigate("/clubadmin");
      } else {
        setErrors({ login: true });
      }
    });
  }, [club, password, remember, setUserToken, setUserType, navigate]);

  return (
    <Modal onHide={onHide} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Club Admin Login</Modal.Title>
        <button className="btn-close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicClub">
            <Form.Label>Club Name</Form.Label>
            <Form.Select required onChange={(e) => setClub(e.target.value)} value={club} aria-label="select club">
              <option>Choose Club</option>
              {!clubs && <option value="">No clubs available</option>}
              {clubs && clubs.map((club) => <option value={club.club_name}>{club.club_name}</option>)}
            </Form.Select>
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

export default CALoginModal;
