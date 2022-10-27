import { useContext, useEffect, useState, useCallback } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AppContext } from "../../App";
import { useParams } from "react-router-dom";
import axios from "axios";

/*
  This panel allows a event to be edited. 
  A list of all registered students is also displayed here.
*/

const ClubEventPanel = () => {
  const [eventName, setEventName] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventSlot, setEventSlot] = useState("");
  const [eventLimit, setEventLimit] = useState(0);
  const [eventDescription, setEventDescription] = useState("");

  const [venueOptions, setVenueOptions] = useState([]);
  const { userToken } = useContext(AppContext);
  const { eventId } = useParams();

  const [registrations, setRegistrations] = useState([]);

  const handleUpdate = useCallback(() => {
    axios.post(
      process.env.REACT_APP_BACKEND_URL + "event_edit",
      {
        event_id: eventId,
        event_name: eventName,
        event_desc: eventDescription,
        event_venue: eventVenue,
        max_limit: eventLimit,
        slot: eventSlot,
        date: eventDate,
      },
      { headers: { Authorization: `${userToken}` } }
    );
  }, [eventName, eventVenue, eventDate, eventSlot, eventLimit, eventDescription, eventId, userToken]);

  useEffect(() => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "event_view",
        { event_id: eventId },
        { headers: { Authorization: `${userToken}` } }
      )
      .then(({ data: { event } }) => {
        setEventName(event.event_name);
        setEventVenue(event.venue);
        setEventSlot(event.slot);
        setEventLimit(event.max_limit);
        setEventDescription(event.event_desc);
        setEventDate(new Date(event.date).toISOString().substring(0, 10));
      });

    axios
      .get(process.env.REACT_APP_BACKEND_URL + "venues_all", { headers: { Authorization: `${userToken}` } })
      .then((res) => {
        setVenueOptions(res.data.venues.map(({ venue_name }) => venue_name));
      });

    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "registered_students",
        { event_id: eventId },
        { headers: { Authorization: `${userToken}` } }
      )
      .then((res) => {
        setRegistrations(res.data.participants);
        console.log(res.data);
      });
  }, [eventId, userToken]);
  return (
    <div className="collapse-cards p-4 text-black">
      <div>
        <Card body>
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
                    value={eventLimit}
                    onChange={(e) => setEventLimit(e.target.value)}
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
                  <Form.Select value={eventSlot} onChange={(e) => setEventSlot(e.target.value)}>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Button className="float-end" onClick={handleUpdate}>
            Update
          </Button>
        </Card>
        <br />
        <br />
        <h3 className="text-white">Total number of regs : {registrations.length}</h3>
      </div>
      <div>
        <h3 className="text-white">Registrations</h3>
        <div className="overflow-auto" style={{ height: "calc(100vh - 200px)" }}>
          {registrations.map(({ name, roll_no, email }) => {
            return (
              <Card className="w-100 mb-2 text-black" body>
                <Card.Title>{name}</Card.Title>
                <div className="row">
                  <Card.Subtitle className="text-secondary float-start m-0">{roll_no}</Card.Subtitle>
                  <Card.Subtitle className="text-secondary float-start m-0">{email}</Card.Subtitle>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ClubEventPanel;
