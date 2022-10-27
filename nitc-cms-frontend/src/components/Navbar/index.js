import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import StudentLoginModal from "./Modals/StudentLoginModal";
import CALoginModal from "./Modals/CAModal";
import SALoginModal from "./Modals/SAModal";
import StudentSignUpModal from "./Modals/StudentSignUpModal";
import axios from "axios";
import { NavDropdown } from "react-bootstrap";

/* This element is the navBar and it changes based on user type */

const Navbar = () => {
  const { userToken, setUserToken } = useContext(AppContext);
  const { userType, setUserType } = useContext(AppContext);

  const [showSLoginModal, setShowSLoginModal] = useState(false);
  const [showSSignUpModal, setShowSSignUpModal] = useState(false);
  const [showCALoginModal, setShowCALoginModal] = useState(false);
  const [showSALoginModal, setShowSALoginModal] = useState(false);

  const [clubs, setClubs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "clubs_all", {
        header: { Authorization: `${userToken}` },
      })
      .then((res) => {
        setClubs(res.data.clubs);
      });
  }, [userToken]);

  let navOptions;
  if (!userToken) {
    navOptions = (
      <>
        <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
        <NavDropdown title="Clubs" id="basic-nav-dropdown">
          {clubs?.map((club) => (
            <NavDropdown.Item onClick={() => navigate(`clubs/${club.club_name}`)} key={club.club_name}>
              {club.club_name}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
        <Nav.Link onClick={() => navigate("/events")}>Events</Nav.Link>
        <DropdownButton id="dropdown-basic-button" title="Sign In">
          <Dropdown.Item onClick={() => setShowSLoginModal(true)}>Student</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowCALoginModal(true)}>Club Admin</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowSALoginModal(true)}>System Admin</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => setShowSSignUpModal(true)}>Student Register</Dropdown.Item>
        </DropdownButton>
      </>
    );
  } else {
    if (userType === "SA") {
      //for SA users
      console.log(userToken);
      navOptions = (
        <>
          <Nav.Link onClick={() => navigate("/admin")}>Home</Nav.Link>
          <Nav.Link onClick={() => navigate("/admin/createvenue")}>Add Venues</Nav.Link>
          <Nav.Link onClick={() => navigate("/admin/createclub")}>Add Clubs</Nav.Link>
          <Nav.Link
            className="d-flex align-items-center"
            onClick={() => {
              localStorage.removeItem("userToken");
              localStorage.removeItem("userType");
              setUserToken(null);
              setUserType(null);
              navigate("/");
            }}
          >
            Log Out
          </Nav.Link>
          {/* add other options based on user type */}
        </>
      );
    } else if (userType === "student") {
      //For student users
      console.log(userToken);
      navOptions = (
        <>
          <Nav.Link onClick={() => navigate(`/student`)}>Student Details</Nav.Link>
          <Nav.Link onClick={() => navigate(`/student/events`)}>All Events</Nav.Link>
          <Nav.Link
            className="d-flex align-items-center"
            onClick={() => {
              localStorage.removeItem("userToken");
              localStorage.removeItem("userType");
              setUserToken(null);
              setUserType(null);
              navigate("/");
            }}
          >
            Log Out
          </Nav.Link>
        </>
      );
    } else {
      //for CA users
      console.log(userToken);
      navOptions = (
        <>
          <Nav.Link onClick={() => navigate(`/clubadmin`)}>Club Details</Nav.Link>
          <Nav.Link
            className="d-flex align-items-center"
            onClick={() => {
              localStorage.removeItem("userToken");
              localStorage.removeItem("userType");
              setUserToken(null);
              setUserType(null);
              navigate("/");
            }}
          >
            Log Out
          </Nav.Link>
        </>
      );
    }
  }

  return (
    <>
      <BootstrapNavbar collapseOnSelect expand="sm" bg="dark" variant="dark">
        <Container>
          <BootstrapNavbar.Brand style={{ cursor: "pointer" }}>
            <b>NITC CMS</b>
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
          <BootstrapNavbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" />
            <Nav>{navOptions}</Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      {!userToken && <StudentLoginModal show={showSLoginModal} onHide={() => setShowSLoginModal(false)} />}
      {!userToken && <StudentSignUpModal show={showSSignUpModal} onHide={() => setShowSSignUpModal(false)} />}
      {!userToken && <CALoginModal show={showCALoginModal} onHide={() => setShowCALoginModal(false)} clubs={clubs} />}
      {!userToken && <SALoginModal show={showSALoginModal} onHide={() => setShowSALoginModal(false)} />}
    </>
  );
};

export default Navbar;
