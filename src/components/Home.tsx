// React-Bootstrap
import Button from "react-bootstrap/Button";
// Components
import TopNavbar from "./TopNavbar";

function Home() {
    return (
        <>
            <TopNavbar />
            <div className="window-box">
                <h3>Welcome to <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span></h3>
                <h5>Your Collaborative Project Hub</h5>
                <p>This project is in development, for more information visit <a href="https://brad.codes/">Brad.Codes</a></p>
                <Button variant="success" href="/login">Get Started</Button>
            </div>
        </>
    )
}

//
export default Home;