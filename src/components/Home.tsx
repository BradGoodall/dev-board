// React-Bootstrap
// React-Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
// Components
import TopNavbar from "./TopNavbar";

function Home() {
    return (
        <div className="home" style={{ minHeight: "100vh" }}>
            <TopNavbar />
            <Container className="window-box window-box-text">
                <h3>Welcome to <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span></h3>
                <h5>Your Collaborative Project Hub</h5>
                <Button variant="success" href="/login">Get Started</Button>
                <p>This project is in development, for more information visit <a href="https://brad.codes/">Brad.Codes</a></p>
            </Container>
        </div>
    )
}

//
export default Home;