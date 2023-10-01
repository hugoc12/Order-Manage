import { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Table, Dropdown, DropdownButton, Button, Modal, Form, FormGroup, Row, Col, ListGroup } from 'react-bootstrap';
import './pedidos.css';
import db from '../../services/estados-cidades.json';
import { app } from '../../services/firebase/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function Pedidos() {
    const firestoneDB = getFirestore(app);
    const [show, setShow] = useState(false);
    const [validacaoForm, setValidacaoForm] = useState(false);
    const [radioChecked, setRadioChecked] = useState({ pessoaFisica: true, pessoaJuridica: false });
    const [vlTotalItem, setvlTotalItem] = useState('0.00');
    const [listProducts, setListProducts] = useState([]);

    function handleSubmit(event) {
        let form = event.currentTarget;
        //let formData = new FormData(form);
        //let data = Object.fromEntries(formData); DADOS INSERIDOS

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidacaoForm(true);
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function productSelected() {
        let BRReal = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        let productSelect = document.getElementById('productSelect');
        let inputNumberQtde = document.getElementById('qtdeItem');

        if (productSelect.value && inputNumberQtde.value > 0) {
            let qtdeDefinida = inputNumberQtde.value;
            let vlProduto = listProducts[productSelect.value[0]].valor;

            setvlTotalItem(BRReal.format((vlProduto * qtdeDefinida).toFixed(2)))
        }else{
            setvlTotalItem(BRReal.format('0.00'))
        }
    }

    function autoCompleteAddress(estado, cidade) {
        let dataEstado = db.estados.find((obj) => obj.sigla === estado);
        console.log(estado);

        let nodeSelectEstado = document.getElementsByName("estado")[0];
        let nodeSelectCidades = document.getElementsByName("cidade")[0];

        //Selecionando UF buscado pelo CEP
        nodeSelectEstado.childNodes.forEach((node, key) => {
            if (node.hasAttribute("selected")) {
                node.removeAttribute("selected");
            }

            if (node.value === estado) {
                node.setAttribute("selected", "true");
            }
        })

        //Montando a lista de cidades.
        nodeSelectCidades.innerHTML = '';//Limpando lista de cidades.
        dataEstado.cidades.forEach((name, ind) => {
            let nodeOption = document.createElement('option');
            let textNode = document.createTextNode(name);
            nodeOption.appendChild(textNode);
            nodeOption.setAttribute("value", name);
            nodeOption.setAttribute("key", ind);

            if (name === cidade) {
                nodeOption.setAttribute("selected", "true")
            }
            nodeSelectCidades.appendChild(nodeOption);
        })
    }

    function removeProduct(event){
        let listGroupItens = document.getElementById("listGroupItens");
        listGroupItens.removeChild(listGroupItens.childNodes[event.target.id])

        listGroupItens.childNodes.forEach((el, ind)=>{
            el.setAttribute("id", ind);//Item do carrinho
            el.lastChild.setAttribute("id", ind); //Botão de remoção
        })
        //console.log(event.target.id);
    }

    function addProduct(){
        let listGroupItens = document.getElementById('listGroupItens');

        let productSelect = document.getElementById('productSelect');
        let inputNumberQtde = document.getElementById('qtdeItem');

        let itemList = document.createElement('div');
        let itemListChild1 = document.createElement('label');
        let itemListChild2 = document.createElement('button');

        let text1NodeChild1 = document.createTextNode(`${inputNumberQtde.value}x ${listProducts[productSelect.value[0]].name}`);
        let text2NodeChild1 = document.createTextNode(vlTotalItem)
        let spanNode = document.createElement("span");
        spanNode.appendChild(text2NodeChild1);
        itemListChild1.appendChild(text1NodeChild1);
        itemListChild1.appendChild(spanNode);

        let textNodeChild2 = document.createTextNode('X');
        itemListChild2.setAttribute("class", "btn btn-danger");
        itemListChild2.setAttribute("type", "button");
        itemListChild2.setAttribute("id", `${listGroupItens.childElementCount}`);
        itemListChild2.appendChild(textNodeChild2);
        itemListChild2.addEventListener('click', (event)=>removeProduct(event));
        
        itemList.setAttribute("class", "itemListForm list-group-item");
        itemList.setAttribute("id", `${listGroupItens.childElementCount}`);
        itemList.appendChild(itemListChild1)
        itemList.appendChild(itemListChild2)

        listGroupItens.appendChild(itemList)
    }

    async function requireCep(cep) {
        let inputEndereco = document.getElementsByName('endereco')[0];
        let inputBairro = document.getElementsByName('bairro')[0];

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json()

            autoCompleteAddress(data.uf, data.localidade);

            inputEndereco.value = data.logradouro;
            inputBairro.value = data.bairro;

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        //Buscar dados no firestone.
        (async function getProducts() {
            const docsProdutos = await getDocs(collection(firestoneDB, "produtos"));
            const dataDocs = docsProdutos.docs.map((doc) => {
                return Object.assign({ id: doc.id }, doc.data());
            })
            console.log(dataDocs);
            setListProducts(dataDocs);
        })()
    }, [firestoneDB])

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
                            <FormGroup className='mb-3' controlId='formPedidoSobrenome'>
                                <Form.Label>Sobrenome</Form.Label>
                                <Form.Control required pattern='[A-Za-z ç]+' placeholder='Sobrenome' form='formIncluirPedido' name='sobrenome' maxLength={60}></Form.Control>
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
                            <Form.Control required placeholder={`Digite seu ${radioChecked.pessoaFisica ? 'CPF' : 'CNPJ'}...`} minLength={11} maxLength={15} pattern='[0-9]+' form='formIncluirPedido' name='registro' />
                        </Form.Group>


                        <Row className="mb-3">
                            <FormGroup className="mb-3" md={"2"} as={Col} controlId="formPedidoCep">
                                <Form.Label>Cep</Form.Label>
                                <Form.Control required minLength={8} maxLength={8} pattern='[0-9]+' form='formIncluirPedido' name='cep' onBlur={(e) => requireCep(e.currentTarget.value)} />
                            </FormGroup>

                            <FormGroup className="mb-3" md="6" as={Col} controlId='formPedidoEndereco'>
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control required placeholder='Digite seu endereço...' maxLength={60} form='formIncluirPedido' name='endereco' />
                            </FormGroup>

                            <Form.Group className='mb-3' md="4" as={Col}>
                                <Form.Label>Bairro</Form.Label>
                                <Form.Control required placeholder='Bairro' maxLength={60} form='formIncluirPedido' name='bairro'></Form.Control>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <FormGroup className="mb-3" md={"3"} as={Col} controlId='formPedidoEnderecoNumero'>
                                <Form.Label>Numero</Form.Label>
                                <Form.Control required placeholder='nº' minLength={1} maxLength={7} pattern='[0-9]+' form='formIncluirPedido' name='numeroResidencial' />
                            </FormGroup>

                            <FormGroup as={Col} controlId="formPedidoEstado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select required form='formIncluirPedido' name='estado' onChange={(e) => autoCompleteAddress(e.currentTarget.value)}>
                                    <option></option>
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
                                </Form.Select>
                            </FormGroup>

                            <FormGroup className='mb-3' as={Col} controlId="formPedidoCidade">
                                <Form.Label>Cidade</Form.Label>
                                <Form.Select required form='formIncluirPedido' name='cidade'>
                                </Form.Select>
                            </FormGroup>
                        </Row>

                        <Row className="mb-4">
                            <Form.Group md={7} as={Col} controlId='nameItem'>
                                <Form.Label>Produto</Form.Label>
                                <Form.Select required onClick={(e) => productSelected()} form='formIncluirPedido' id='productSelect'>
                                    <option></option>
                                    {listProducts.map((el, ind) => <option key={ind} value={`${ind}-${el.id}`}>{el.name}</option>)}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group md={2} as={Col} controlId='qtdeItem'>
                                <Form.Label>Qtde</Form.Label>
                                <Form.Control required type='number' defaultValue={1} min={1} onKeyDown={(e)=>e.preventDefault()} onChange={(e)=>productSelected()}></Form.Control>
                            </Form.Group>

                            <Form.Group md={2} as={Col} className='vlTotalItem' controlId='vlTotalItem'>
                                <Form.Text>{vlTotalItem}</Form.Text>
                            </Form.Group>

                            <FormGroup md={1} as={Col} className='bttAddItem' onClick={(e)=>addProduct()}>
                                <Button variant='success'>+</Button>
                            </FormGroup>
                        </Row>

                        <ListGroup className='listGroupForm' id='listGroupItens'>
                            {/*<ListGroup.Item className='itemListForm'><label>2x Whei - 900g - MaxTitanium - <span>R$190.00</span></label> <Button variant='danger'>X</Button></ListGroup.Item>*/}
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