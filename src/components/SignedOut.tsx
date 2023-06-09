import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button";
import TopNavbar from "./TopNavbar";

function SignedOut() {
    return (
        <>
            <TopNavbar />
            <Container style={{ width: '30rem', border: 'solid 0.2rem', borderRadius: '2rem', marginTop: '2rem', padding: '3rem' }}>
                <h3>You have been signed out</h3>
                <Button href="/">Return Home</Button>
            </Container>
        </>
    )
}

export default SignedOut;