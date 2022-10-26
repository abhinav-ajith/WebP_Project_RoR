import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../App";
import axios from "axios";

/* This panel displays all details relevant to a student user */

const StudentDetails = () => {
  const [student, setStudent] = useState({});
  const { userToken } = useContext(AppContext);

  useEffect(() => {
    console.log(`StudDetails ${userToken}`);

    axios
      .get(process.env.REACT_APP_BACKEND_URL + "student_details", {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        setStudent(res.data.msg);
        console.log(res.data);
      });
  }, [userToken]);

  return (
    <>
      <div className="mt-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <Card style={{ width: "500px" }}>
          <Card.Body>
            <Card.Title>{student.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Roll Number</Card.Subtitle>
            <Card.Text>{student.roll_number}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">Email Address</Card.Subtitle>
            <Card.Text>{student.email}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
export default StudentDetails;
