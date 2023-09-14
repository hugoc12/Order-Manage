import { useState } from 'react';
import { Container, Nav, Navbar, Table, Dropdown, DropdownButton, Button, Modal, Form, FormGroup, Row, Col } from 'react-bootstrap';
import './pedidos.css';

export default function Pedidos() {
    const [show, setShow] = useState(false);
    const [validacao, setValidacao] = useState(false)

    function handleSubmit(event) {
        let form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidacao(true);
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">---BRAND---</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/" style={{ color: '#fff' }}>Pedidos</Nav.Link>
                        <Nav.Link href="/estoque">Estoque</Nav.Link>
                    </Nav>
                    <Button variant="success" onClick={handleShow}>INCLUIR PEDIDO</Button>
                </Container>
            </Navbar>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validacao} onSubmit={(event) => handleSubmit(event)}>
                        <Form.Group className="mb-3" controlId="formPedidoNome">
                            <Form.Label>Nome Completo</Form.Label>
                            <Form.Control required placeholder="Nome completo..." />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPedidoEmail">
                            <Form.Label>Endereço de Email</Form.Label>
                            <Form.Control required type="email" placeholder="Enter email" />
                            <Form.Control.Feedback type='valid'>
                                Email valido!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type='invalid'>
                                Email inválido!
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPedidoContato">
                            <Form.Label>Telefone/Celular</Form.Label>
                            <Form.Control required placeholder="(00)9000-0000" />
                        </Form.Group>

                        <FormGroup className='mb-3' controlId='formPedidoEndereco'>
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control required placeholder='Digite seu endereço...' />
                        </FormGroup>

                        <Form.Group className="mb-3" controlId="formPedidoRegistro">
                            <Form.Label>CPF/CNPJ</Form.Label>
                            <Form.Control required placeholder="CPF/CNPJ" />
                        </Form.Group>

                        <Row className="mb-3">
                            <FormGroup as={Col} controlId="formPedidoCidade">
                                <Form.Label>Cidade</Form.Label>
                                <Form.Control required />
                            </FormGroup>

                            <FormGroup as={Col} controlId="formPedidoEstado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select required>
                                    <option>Choose...</option>
                                    <option>...</option>
                                </Form.Select>
                            </FormGroup>

                            <FormGroup as={Col} controlId="formPedidoCep">
                                <Form.Label>Cep</Form.Label>
                                <Form.Control type='number' required onKeyDown={(e)=>{
                                    if(e.code !== 'Backspace'){
                                        if(e.currentTarget.value.length === 8 || e.code === 'Period'){
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }
                                    }
                                }}/>
                            </FormGroup>
                        </Row>

                        <Form.Text className="text-muted">
                            Jamais compartilharemos seus dados com terceiros.
                        </Form.Text>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
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