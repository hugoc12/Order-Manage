import { useState } from 'react';
import { Container, Nav, Navbar, Table, Dropdown, DropdownButton, Button, Modal, Form, FormGroup, Row, Col, ListGroup, FormLabel } from 'react-bootstrap';
import './pedidos.css';

export default function Pedidos() {
    const listProduct = [ //Isso virá do firebase
        {
            id: 0,
            name: 'Suplemento Mineral - BioVitalithy',
            price: 68.00
        },
        {
            id: 1,
            name: 'Whei - 900g - MaxTitanium',
            price: 126.90
        },
        {
            id: 2,
            name: 'Creatina - 300g - Probiotica',
            price: 69.90
        },
        {
            id: 3,
            name: 'Polivitaminico Mastigavel - Growth Supplements',
            price: 23.40
        }
    ]
    const [show, setShow] = useState(false);
    const [validacaoForm, setValidacaoForm] = useState(false);
    const [radioChecked, setRadioChecked] = useState({ pessoaFisica: true, pessoaJuridica: false });
    const [vlTotalItem, setvlTotalItem] = useState('28.00');
    /*const [shoppingList, setShoppingList] = useState([])*/

    function handleSubmit(event) {
        let form = event.currentTarget;
        //let formData = new FormData(form);
        //let data = Object.fromEntries(formData); DADOS INSERIDOS
        /*let childsFormsValidation = {
            nomeCompleto: {
                value: 'Hugo de Oliveira Pinho',
                validade: true
            },
            email: {
                value: 'hugo_c12@outlook.com',
                validation: true
            },
            contato: {
                value: '(11)9'
            }

        }*/

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidacaoForm(true);
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function productSelected(event) {
        let qtdeDefinida = document.getElementById('qtdeItem').value;
        let vlProduto = listProduct[event.currentTarget.value].price

        setvlTotalItem(Number(qtdeDefinida) * Number(vlProduto));

    }

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
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton><Modal.Title>Modal heading</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validacaoForm} onSubmit={(event) => handleSubmit(event)} id='formIncluirPedido' name='formIncluirPedido'>
                        <Form.Group className="mb-3" controlId='formPedidoTipoPessoa' style={{ textAlign: 'center', fontSize: '20px' }}>
                            <Form.Check
                                defaultChecked
                                inline
                                label="Pessoa Física"
                                name="tipoPessoa"
                                type='radio'
                                id={`pessoaFísica`}
                                onClick={(e) => setRadioChecked({ pessoaFisica: true, pessoaJuridica: false })}
                            />
                            <Form.Check
                                inline
                                label="Pessoa Jurídica"
                                name="tipoPessoa"
                                type='radio'
                                id={`pessoaJurídica`}
                                onClick={(e) => setRadioChecked({ pessoaFisica: false, pessoaJuridica: true })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPedidoNome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control required pattern='[A-Za-z ç]+' placeholder="Nome" form='formIncluirPedido' name='primeiroNome' maxLength={60} />
                        </Form.Group>
                        {radioChecked.pessoaFisica ?
                            <FormGroup className='mb-3' controlId='formPedidoUltimoNome'>
                                <Form.Label>Último Nome</Form.Label>
                                <Form.Control required pattern='[A-Za-z ç]+' placeholder='Último Nome' form='formIncluirPedido' name='ultimoNome' maxLength={60}></Form.Control>
                            </FormGroup>
                            : <></>}

                        <Form.Group className="mb-3" controlId="formPedidoEmail">
                            <Form.Label>Endereço de Email</Form.Label>
                            <Form.Control required type="email" placeholder="Enter email" form='formIncluirPedido' name='email' />
                            <Form.Control.Feedback type='invalid'>
                                Email inválido!
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="mb-2">
                            <Form.Group md="6" as={Col} controlId="formPedidoTelefone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control required type='tel' minLength={10} maxLength={10} pattern='[0-9]+' form='formIncluirPedido' name='telefone' />
                                <Form.Control.Feedback type="invalid">Número de telefone inválido</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group md="6" as={Col} controlId="formPedidoCelular">
                                <Form.Label>Celular</Form.Label>
                                <Form.Control required type='tel' minLength={11} maxLength={11} pattern='[0-9]+' form='formIncluirPedido' name='celular' />
                                <Form.Control.Feedback type="invalid">Número de celular inválido</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formPedidoRegistro">
                            <Form.Label>{radioChecked.pessoaFisica ? 'CPF' : 'CNPJ'}</Form.Label>
                            <Form.Control required placeholder={`Digite seu ${radioChecked.pessoaFisica ? 'CPF' : 'CNPJ'}...`} maxLength={15} pattern='[0-9]+' form='formIncluirPedido' name='registro' />
                        </Form.Group>

                        <Row className="mb-3">
                            <FormGroup md={"9"} as={Col} controlId='formPedidoEndereco'>
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control required placeholder='Digite seu endereço...' maxLength={60} form='formIncluirPedido' name='endereco' />
                            </FormGroup>

                            <FormGroup md={"3"} as={Col} controlId='formPedidoEnderecoNumero'>
                                <Form.Label>Numero</Form.Label>
                                <Form.Control required placeholder='nº' minLength={1} maxLength={7} pattern='[0-9]+' form='formIncluirPedido' name='numeroResidencial' />
                            </FormGroup>
                        </Row>

                        <Row className="mb-3">
                            <FormGroup as={Col} controlId="formPedidoEstado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select required form='formIncluirPedido' name='estado'>
                                    <option>Choose...</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                    <option value="EX">Estrangeiro</option>
                                </Form.Select>
                            </FormGroup>

                            <FormGroup as={Col} controlId="formPedidoCidade">
                                <Form.Label>Cidade</Form.Label>
                                <Form.Control required form='formIncluirPedido' name='cidade' pattern='[a-zA-z ç]+' maxLength={48}/>
                            </FormGroup>

                            <FormGroup as={Col} controlId="formPedidoCep">
                                <Form.Label>Cep</Form.Label>
                                <Form.Control required minLength={8} maxLength={8} pattern='[0-9]+' form='formIncluirPedido' name='cep' />
                            </FormGroup>
                        </Row>

                        <Row className='mb-4'>
                            <Form.Group md={7} as={Col} controlId='nameItem'>
                                <Form.Label>Produto</Form.Label>
                                <Form.Select onChange={(e) => productSelected(e)} form='formIncluirPedido'>
                                    <option value={false}>Selecione...</option>
                                    <option value={'0'}>Suplemento Mineral - BioVitalithy</option>
                                    <option value={'1'}>Whei - 900g - MaxTitanium</option>
                                    <option value={'2'}>Creatina - 300g - Probiotica</option>
                                    <option value={'3'}>Polivitaminico Mastigavel - Growth Supplements</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group md={2} as={Col} controlId='qtdeItem'>
                                <Form.Label>Qtde</Form.Label>
                                <Form.Control required type='number' defaultValue={1} min={1}></Form.Control>
                            </Form.Group>

                            <Form.Group md={2} as={Col} className='vlTotalItem'>
                                <Form.Label>R$</Form.Label>
                                <span style={{ fontWeight: 'bold', fontSize: 18, display: 'block', width: '100%' }}>{vlTotalItem}</span>
                            </Form.Group>

                            <FormGroup md={1} as={Col}>
                                <Button variant='success' className='bttAddItem'>+</Button>
                            </FormGroup>
                        </Row>

                        <ListGroup className='listGroupForm'>
                            <ListGroup.Item className='itemListForm'><label>5x Biovitalith - <span>R$550.00</span></label><Button variant='danger'>X</Button></ListGroup.Item>
                            <ListGroup.Item className='itemListForm'><label>2x Whei - 900g - MaxTitanium - <span>R$190.00</span></label> <Button variant='danger'>X</Button></ListGroup.Item>
                            <ListGroup.Item className='itemListForm'><label>2x Creatina - 300g - Probiotica - <span>R$200,00</span></label> <Button variant='danger'>X</Button></ListGroup.Item>
                        </ListGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer >
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type='submit' form='formIncluirPedido'>
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