// should show all the common data like info about clubs
// list of all events
//should not need auth.
import background from "./background.jpg";

/* this is the home page */

const HomePage = () => {
  return (
    <>
      <div
        className="vh-100 vw-100 position-absolute top-0 start-0"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          zIndex: "-1",
        }}
      >
        <div className="w-100 h-100" style={{ backgroundColor: "#120f3df5" }} />
      </div>
      <div className="d-flex vh-100 flex-column">
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-white">
          <h1>NITC CLUB MANAGEMENT SYSTEM</h1>
        </div>
      </div>
    </>
  );
};
export default HomePage;
