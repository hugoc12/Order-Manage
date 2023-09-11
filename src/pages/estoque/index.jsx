import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Estoque() {
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">---BRAND---</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Pedidos</Nav.Link>
                        <Nav.Link href="/estoque" style={{color:"#fff"}}>Estoque</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <h1>ESTOQUE</h1>
        </div>
    )
}