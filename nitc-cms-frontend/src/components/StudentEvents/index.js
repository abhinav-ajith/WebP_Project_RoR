import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../App";
import axios from "axios";
import Modal from 'react-bootstrap/Modal'

/* This panel displays all events a student has registered for, and lists future events he could register for */

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [regEvents, setRegEvents] = useState([]);
  const { userToken } = useContext(AppContext);

  const [unregEvents, setUnRegEvents] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState("");

  //get the events the student is registered to
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "events_student", {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        setRegEvents(res.data.events);

        // let temp = [];
        // regEvents.forEach((event) => temp.push(event.event_id));
        // setRegNum(temp);
      });
  }, [isRegistering, userToken]);

  //get other events
  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + "events_future").then((res) => {
      setEvents(res.data.events);
    });
  }, []);

  //compute unreg
  useEffect(() => {
    let temp = [];
    regEvents.forEach((event) => temp.push(event.event_id));

    let temp_events = [];
    events.forEach((event) => {
      if (!temp.includes(event.event_id)) {
        temp_events.push(event);
      }
    });

    setUnRegEvents(temp_events);
  }, [events, regEvents]);

  //Register --works
  function handleRegister(event, index) {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "event_register",
        {
          event_id: event.event_id,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => {
        if(res.data.msg === "Registered")
          setIsRegistering(!isRegistering);
        else
          throw res.data.msg;
      })
      .catch((msg) => {
          setRegError(msg);
      });
  }

  const errorHandled = () => setRegError("");

  return (
    <>
      {regEvents.length === 0 && unregEvents.length === 0 && (
        <div className="d-flex vh-100 flex-column">
          <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-white">
            <h3 className="text-white">No events at the moment</h3>
          </div>
        </div>
      )}
      <h4 className="text-white mt-5 mb-2 mx-5">Registered Events</h4>
      <div className="mt-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
        {regEvents.length === 0 && <h5 className="text-white">No registered events at the moment</h5>}
        {regEvents.length > 0 &&
          regEvents.map((event) => (
            <Card className="mb-2" style={{ width: "800px" }}>
              <Card.Body>
                <Card.Title>{event.event_name}</Card.Title>
                <Card.Subtitle className="mb-4 text-muted">{event.event_club}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{`Date: ${event.date}`}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{`Slot: ${event.slot}`}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{`Venue: ${event.venue}`}</Card.Subtitle>
                <Card.Subtitle className="mb-4 text-muted">{`Max participation count: ${event.max_limit}`}</Card.Subtitle>
                <Card.Text>{`${event.event_desc}`}</Card.Text>
              </Card.Body>
            </Card>
          ))}
      </div>
      <h4 className="text-white mt-5 mb-2 mx-5">Other Events</h4>
      <div className="mt-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
        {unregEvents.length === 0 && <h5 className="text-white">No other events at the moment</h5>}
        {unregEvents.length > 0 &&
          unregEvents.map((event, index) => (
            <Card className="mb-2" style={{ width: "800px" }}>
              <Card.Body>
                <Card.Title>{event.event_name}</Card.Title>
                <Card.Subtitle className="mb-4 text-muted">{event.event_club}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{`Date: ${event.date.substring(0, event.date.indexOf("00:00:00"))}`}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{`Slot: ${event.slot}`}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{`Venue: ${event.venue}`}</Card.Subtitle>
                <Card.Subtitle className="mb-4 text-muted">{`Max participation count: ${event.max_limit}`}</Card.Subtitle>
                <Card.Text>{`${event.event_desc}`}</Card.Text>
                <Button variant="primary" onClick={() => handleRegister(event, index)}>
                  Register
                </Button>
              </Card.Body>
            </Card>
          ))}
        <Modal show ={regError !== ""} onHide={errorHandled} size="sm" aria-labelledby="contained-modal-title-vcenter">
          <Modal.Body>
            <h5>{regError}</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={errorHandled}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
export default StudentEvents;
