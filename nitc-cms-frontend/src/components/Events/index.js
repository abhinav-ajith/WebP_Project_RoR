import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";


/*
  This panel displays all future events
 */

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + "events_future").then((res) => {
      setEvents(res.data.events);
    });
  }, []);

  return (
    <>
      {events.length === 0 && 
      (<div className="d-flex vh-100 flex-column">
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-white">
          <h3 className="text-white">No events at the moment</h3>
        </div>
      </div>
      )}
      
      <div className="mt-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
      {events.length > 0 &&
        events.map((event) => (
          <Card className="mb-2" style={{ width: "800px" }}>
            <Card.Body>
              <Card.Title>{event.event_name}</Card.Title>
              <Card.Subtitle className="mb-4 text-muted">{event.event_club}</Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">{`Date: ${event.date.substring(0, event.date.indexOf("00:00:00"))}`}</Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">{`Slot: ${event.slot}`}</Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">{`Venue: ${event.venue}`}</Card.Subtitle>
              <Card.Subtitle className="mb-4 text-muted">{`Max participation count: ${event.max_limit}`}</Card.Subtitle>
              <Card.Text>{`${event.event_desc}`}</Card.Text>
            </Card.Body>
          </Card>
        ))}
        </div>
    </>
  );
};
export default Events;
