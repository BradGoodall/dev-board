// React-Bootstrap
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button";
// Components
import TopNavbar from "./TopNavbar";

function Home() {
    return (
        <>
            <TopNavbar />
            <Container className="windowBox" fluid="lg">
                <h3>Welcome to <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>devBoard</span></h3>
                <p>Your Collaborative Project Hub</p>
                <p>This project is in development, for more information visit <a href="https://brad.codes/">Brad.Codes</a></p>
                <Button href="/login">Get Started</Button>
            </Container>
        </>
    )
}

export default Home;