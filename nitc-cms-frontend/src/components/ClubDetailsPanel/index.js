import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

/*
This panel displays club description and lists both events and members of the club.
*/

const ClubDetailsPanel = () => {
  const { clubname } = useParams();
  const [clubInfo, setClubInfo] = useState(null);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + `clubs/${clubname}`).then((res) => {
      setClubInfo(res.data.info);
    });
  }, [clubname]);

  return (
    <>
      <div className="p-4 text-white" style={{ height: "100vh" }}>
        <div className="d-flex mb-5 flex-column align-items-center justify-content-center flex-grow-1">
          <h1>
            <b>{clubInfo?.club_name}</b>
          </h1>
          {clubInfo?.club_desc !== "" && (
            <p className="form-control bg-transparent text-white" style={{ width: "800px" }}>
              {clubInfo?.club_desc}
            </p>
          )}
        </div>
        <br />
        <br />
        <div className="collapse-cards" style={{ height: "80vh", display: "flex" }}>
          <div>
            <h3>Members</h3>
            <div className="overflow-auto" style={{ height: "500px", width: "700px" }}>
              {clubInfo?.members.length === 0 && <h4 className="mt-5 text-white">No members have been added</h4>}
              {clubInfo?.members.map(({ name, position }) => (
                <Card className="w-100 mb-2 text-black">
                  <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="float-start">{position}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3>Events</h3>
            <div className="overflow-auto" style={{ height: "500px", width: "700px" }}>
              {clubInfo?.events.length === 0 && <h4 className="mt-5 text-white">No events have been added</h4>}
              {clubInfo?.events.map(({ event_name, date, slot, event_id }) => (
                <Card className="w-100 mb-2 text-black">
                  <Card.Body>
                    <Card.Title>{event_name}</Card.Title>
                    <Card.Text className="float-start m-0">
                      {date.substring(0, 10)}
                      <br />
                      {slot}
                    </Card.Text>
                    {/* <input
                        type="image"
                        src={expandIcon}
                        className="float-end"
                        style={{ height: "20px" }}
                        onClick={() => navigate(`${event_id}`)}
                      /> */}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ClubDetailsPanel;
