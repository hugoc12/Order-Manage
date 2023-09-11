import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import './pedidos.css';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';

export default function Pedidos() {
    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">---BRAND---</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/" style={{ color: '#fff' }}>Pedidos</Nav.Link>
                        <Nav.Link href="/estoque">Estoque</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>NÚMERO</th>
                        <th>CLIENTE</th>
                        <th>ENDEREÇO</th>
                        <th>STATUS</th>
                        <th>RASTREIO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Hugo Oliveira Pinho</td>
                        <td>Rua Ludgero José dos Santos - 85 - São Paulo SP - 05860090</td>
                        <td>ENVIADO</td>
                        <td>GR8000400</td>
                        <td>
                            <Dropdown className="d-inline mx-2" autoClose="inside">
                                <Dropdown.Toggle id="dropdown-autoclose-inside">
                                    OPTIONS
                                </Dropdown.Toggle>

                                <DropdownMenu>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </DropdownMenu>

                            </Dropdown>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}