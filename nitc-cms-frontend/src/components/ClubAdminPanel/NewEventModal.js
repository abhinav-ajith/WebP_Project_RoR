import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { AppContext } from "../../App";

const NewEventModal = ({ show, onHide }) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [slot, setSlot] = useState("Morning");
  const [eventDate, setEventDate] = useState("");
  const [maxLimit, setMaxLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [venueOptions, setVenueOptions] = useState([]);
  const { userToken } = useContext(AppContext);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "venues_all", { headers: { Authorization: `${userToken}` } })
      .then((res) => {
        setVenueOptions(res.data.venues.map(({ venue_name }) => venue_name));
        setEventVenue(res.data.venues[0]?.venue_name);
      });
  }, [userToken]);

  const onHideSub = useCallback(() => {
    setEventName("");
    setEventDescription("");
    setLoading(false);
    onHide();
    setError(null);
  }, [setEventName, setEventDescription, setLoading, onHide, setError]);

  const handleCreation = useCallback(() => {
    setLoading(true);
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "event_add",
        {
          event_name: eventName,
          event_desc: eventDescription,
          event_venue: eventVenue,
          max_limit: maxLimit,
          slot,
          date: eventDate,
        },
        { headers: { Authorization: `${userToken}` } }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.event_id) {
          onHideSub();
        } else {
          throw res.data.msg;
        }
      })
      .catch((msg) => {
        setError(typeof msg === "string" ? msg : "Failed");
        setLoading(false);
      });
  }, [eventName, eventDescription, eventVenue, maxLimit, eventDate, slot, userToken, onHideSub]);

  return (
    <Modal onHide={onHideSub} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">New Event</Modal.Title>
        <button className="btn-close" onClick={onHideSub} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Enter event title</Form.Label>
            <Form.Control
              as="input"
              placeholder="Event name goes here"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Enter event description</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Event description goes here"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </Form.Group>
          <Row className="g-2 mb-3">
            <Col md>
              <Form.Group className="mb-3">
                <Form.Label>Pick Event Venue</Form.Label>
                <Form.Select value={eventVenue} onChange={(e) => setEventVenue(e.target.value)}>
                  {venueOptions.map((op) => (
                    <option>{op}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group>
                <Form.Label>Enter Max Regs</Form.Label>
                <Form.Control
                  as="input"
                  type="number"
                  placeholder="Enter max limit"
                  value={maxLimit}
                  onChange={(e) => setMaxLimit(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md>
              <Form.Group>
                <Form.Label>Enter event date</Form.Label>
                <Form.Control type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md>
              <Form.Group>
                <Form.Label>Pick Slot</Form.Label>
                <Form.Select value={slot} onChange={(e) => setSlot(e.target.value)}>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        {error && <div class="alert alert-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        {loading && <Spinner animation="border" />}
        <Button onClick={handleCreation}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEventModal;
