import React, { useContext, useEffect } from 'react';
import { Form, FormGroup, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { getDocs, collection, setDoc, doc } from 'firebase/firestore'
import db from '../../services/estados-cidades.json';
import { Context } from '../../contexts/pagePedidos';
import { firestoreDB } from '../../services/firebase/firebase';

function FormPedido() {
    const context = useContext(Context);

    useEffect(() => {
        //Atualizando valor total do pedido.
        //console.log('effect form')
        let vlTotalPedido = 0;
        context.form.cart.forEach((el) => {
            vlTotalPedido += el.total;
        })
        context.form.setVlTotalPedido(context.currency.format(vlTotalPedido));

        //Listando produtos para e seleção disponíveis no firebase.
        if (context.form.listProducts.length === 0) {
            console.log('PRODUTOS LISTADOS!');
            (async function getProducts() {
                try {
                    let docsProdutos = await getDocs(collection(firestoreDB, "produtos"));
                    let dataDocs = docsProdutos.docs.map((doc) => {
                        return Object.assign({ id: doc.id }, doc.data());
                    })
                    context.form.setListProducts(dataDocs);
                    console.log('produtos listados!')
                } catch (err) {
                    console.log(err)
                }
            })()
        }

    }, [context.form.cart, context])

    function productSelected() {
        let productSelect = document.getElementById('productSelect');
        let inputNumberQtde = document.getElementById('qtdeItem');

        if (productSelect.value && inputNumberQtde.value > 0) {
            let qtdeDefinida = inputNumberQtde.value;
            let vlProduto = context.form.listProducts[productSelect.value[0]].valor;

            context.form.setvlTotalItem(context.currency.format((vlProduto * qtdeDefinida).toFixed(2)))
        } else {
            context.form.setvlTotalItem(context.currency.format('0.00'))
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        let form = event.currentTarget;

        context.form.setValidacaoForm(true);

        async function setDocumentPedido(data) {
            try {
                await setDoc(doc(firestoreDB, "pedidos", `${context.pedidos.length + 1}`), data);
                console.log(`DOCUMENT ADDED`);

                form.submit();
            } catch (err) {
                console.log(err);
            }
        }

        if (form.checkValidity() && context.form.cart.length >= 1) {
            let formData = new FormData(form);
            let data = Object.fromEntries(formData);
            let date = new Date();
            context.form.setDataForm(data);

            let vlTotalPedido = 0;
            context.form.cart.forEach((el) => {
                vlTotalPedido += el.total;
            })

            let dataDef = {
                tipoCliente: data.tipoPessoa,
                nome: data.primeiroNome,
                sobrenome: data.tipoPessoa === 'pessoa física' ? data.sobrenome : '',
                email: data.email,
                telefone: data.telefone,
                celular: data.celular,
                cpf: data.tipoPessoa === 'pessoa física' ? data.registro : '',
                cnpj: data.tipoPessoa === 'pessoa jurídica' ? data.registro : '',
                endereco: {
                    cep: data.cep,
                    logradouro: data.endereco,
                    numero: data.numeroResidencial,
                    bairro: data.bairro,
                    cidade: data.cidade,
                    estado: data.estado,
                },
                cart: context.form.cart,
                valorTotal: vlTotalPedido,
                shipping: {
                    status: 'ENVIADO',
                    data: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
                    rastreio: 'AB2002789789'
                }
            }

            setDocumentPedido(dataDef);
        }

    }

    function addProduct() {
        if (document.getElementById('productSelect').value !== '') {
            let productSelected = document.getElementById('productSelect').value;
            let inputNumberQtde = document.getElementById('qtdeItem').value;
            let product = context.form.listProducts[productSelected[0]];
            let listCart = [...context.form.cart];

            listCart.push({
                id: product.id,
                name: product.name,
                qtde: Number(inputNumberQtde),
                total: inputNumberQtde * product.valor
            })

            document.getElementById('productSelect').value = '';
            document.getElementById('qtdeItem').value = 1;

            context.form.setCart(listCart);
            context.form.setvlTotalItem('R$ 0,00');
        }
    }

    function removeProduct(ind) {
        let listCart = [...context.form.cart];
        listCart.splice(ind, 1);
        context.form.setCart(listCart);
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

    return (
        <Form noValidate validated={context.form.validacaoForm} onSubmit={(event) => handleSubmit(event)} id='formIncluirPedido' name='formIncluirPedido'>
            <Form.Group className="mb-3" controlId='formPedidoTipoPessoa' style={{ textAlign: 'center', fontSize: '20px' }}>
                <Form.Check
                    defaultChecked
                    inline
                    label="Pessoa Física"
                    name="tipoPessoa"
                    type='radio'
                    id={`pessoaFísica`}
                    value='pessoa física'
                    onClick={(e) => context.form.setRadioChecked("pessoa física")}
                />
                <Form.Check
                    inline
                    label="Pessoa Jurídica"
                    name="tipoPessoa"
                    type='radio'
                    id={`pessoaJurídica`}
                    value='pessoa jurídica'
                    onClick={(e) => context.form.setRadioChecked("pessoa jurídica")}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPedidoNome">
                <Form.Label>Nome</Form.Label>
                {context.form.radioChecked === "pessoa física" ?
                    <Form.Control
                        required
                        pattern='[A-Za-zç]+'
                        placeholder="Nome"
                        form='formIncluirPedido'
                        name='primeiroNome'
                        maxLength={60}
                        onKeyDown={(e) => {
                            if (e.code === 'Space') {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }} />
                    :
                    <Form.Control
                        required
                        pattern='[A-Za-z çáéíóúâêîôûãõ]+'
                        placeholder="Razão Social"
                        form='formIncluirPedido'
                        name='primeiroNome'
                        maxLength={60} />
                }
            </Form.Group>
            {context.form.radioChecked === "pessoa física" ?
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
                <Form.Label>{context.form.radioChecked === "pessoa física" ? 'CPF' : 'CNPJ'}</Form.Label>
                {
                    context.form.radioChecked === "pessoa física" ?
                        <Form.Control
                            required
                            placeholder={"Digite seu CPF..."}
                            minLength={11}
                            maxLength={11}
                            pattern='[0-9]+'
                            form='formIncluirPedido'
                            name='registro' /> :

                        <Form.Control
                            required
                            placeholder={"Digite seu CNPJ..."}
                            minLength={15}
                            maxLength={15}
                            pattern='[0-9]+'
                            form='formIncluirPedido'
                            name='registro' />
                }
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
                    <Form.Select onClick={(e) => productSelected()} form='formIncluirPedido' id='productSelect'>
                        <option></option>
                        {context.form.listProducts.map((el, ind) => <option key={ind} value={`${ind}-${el.id}`}>{el.name}</option>)}
                    </Form.Select>
                </Form.Group>

                <Form.Group md={2} as={Col} controlId='qtdeItem'>
                    <Form.Label>Qtde</Form.Label>
                    <Form.Control type='number' defaultValue={1} min={1} onKeyDown={(e) => e.preventDefault()} onChange={(e) => productSelected()}></Form.Control>
                </Form.Group>

                <Form.Group md={2} as={Col} className='vlTotalItem' controlId='vlTotalItem'>
                    <Form.Text>{context.form.vlTotalItem}</Form.Text>
                </Form.Group>

                <FormGroup md={1} as={Col} className='bttAddItem' onClick={(e) => addProduct()}>
                    <Button variant='success'>+</Button>
                </FormGroup>
            </Row>

            <ListGroup className='listGroupForm' id='listGroupItens'>
                {context.form.cart.map((el, ind) => {
                    return <ListGroup.Item key={ind} id={el.id} className='itemListForm'>
                        <label>{el.qtde}x {el.name} - <span>{context.currency.format(el.total)}</span></label>
                        <Button variant='danger' onClick={(e) => removeProduct(ind)}>X</Button>
                    </ListGroup.Item>
                })}
                {/*<ListGroup.Item className='itemListForm'><label>2x Whei - 900g - MaxTitanium - <span>R$190.00</span></label> <Button variant='danger'>X</Button></ListGroup.Item>*/}
            </ListGroup>
        </Form>
    );
}

export default FormPedido;