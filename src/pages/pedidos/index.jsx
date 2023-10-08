import { useContext } from 'react';
import { Container, Nav, Navbar, Table, Dropdown, DropdownButton, Button} from 'react-bootstrap';
import './pedidos.css';
import { Context } from '../../contexts/pagePedidos';
import ModalPedido from '../../components/modalPedido';

export default function Pedidos() {
    const context = useContext(Context);

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">---BRAND---</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/" style={{ color: '#fff' }}>Pedidos</Nav.Link>
                        <Nav.Link href="/estoque">Estoque</Nav.Link>
                    </Nav>
                    <Button variant="success" onClick={()=>context.form.setShow(true)}>INCLUIR PEDIDO</Button>
                </Container>
            </Navbar>

            <ModalPedido/>
            
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
                    <tr className='trPedido' id='1'>
                        <td>1</td>
                        <td>Hugo Oliveira Pinho</td>
                        <td>Rua Ludgero José dos Santos - 85 - São Paulo SP - 05860090</td>
                        <td>ENVIADO</td>
                        <td>GR8000400</td>
                        <td>
                            <DropdownButton align="end" id="dropdown-menu-align-end" title=''>
                                <Dropdown.Item eventKey="1">Exclui</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Editar</Dropdown.Item>
                            </DropdownButton>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}