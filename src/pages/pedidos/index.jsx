import { useContext, useEffect, useState } from 'react';
import { Container, Nav, Navbar, Table, Dropdown, DropdownButton, Button, Spinner } from 'react-bootstrap';
import { getDocs, collection } from 'firebase/firestore';
import { firestoreDB } from '../../services/firebase/firebase';
import './pedidos.css';
import { Context } from '../../contexts/pagePedidos';
import ModalPedido from '../../components/modalPedido';
import ModalEditPedido from '../../components/modalEditPedido';

//utils
import deleteOrder from './utils/deleteOrder';

export default function Pedidos() {
    const context = useContext(Context);
    const [loadPedidos, setLoadPedidos] = useState(true);

    async function getPedidos(){
        try {
            await getDocs(collection(firestoreDB, "pedidos")).then((e) => {
                context.setPedidos(e.docs.map((el) => {
                    return Object.assign({ id: el.id }, el.data());
                }).reverse())
                setLoadPedidos(false);
                console.log('PEDIDOS LISTADOS!')
            });
        } catch (err) {
            setLoadPedidos(true)
        }
    }

    useEffect(() => {
        if (context.pedidos.length === 0) {
            getPedidos();
        }
    }, [context.pedidos]);

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">---BRAND---</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/" style={{ color: '#fff' }}>Pedidos</Nav.Link>
                        <Nav.Link href="/estoque">Estoque</Nav.Link>
                    </Nav>
                    <Button variant="success" onClick={() => 
                        {context.setIdPedidoEdit(null);
                        context.form.setShow(true);}}>INCLUIR PEDIDO</Button>
                </Container>
            </Navbar>

            <ModalPedido />
            <ModalEditPedido/>

            {loadPedidos ?
                <Container md={'xl'} style={{ height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner animation="grow" variant="dark" />
                </Container>
                :
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>NÚMERO</th>
                            <th>CLIENTE</th>
                            <th>ENDEREÇO</th>
                            <th>STATUS</th>
                            <th>RASTREIO</th>
                            <th>DATA</th>
                        </tr>
                    </thead>

                    <tbody>
                        {context.pedidos.map((el, ind) => {
                            return (
                                <tr className='trPedido' id={el.id} key={el.id}>
                                    <td>{el.id}</td>
                                    <td>{el.nome} {el.sobrenome}</td>
                                    <td>{el.endereco.logradouro} - {el.endereco.numero} - {el.endereco.cidade} - {el.endereco.estado} - {el.endereco.cep}</td>
                                    <td>{el.shipping.status}</td>
                                    <td>{el.shipping.rastreio}</td>
                                    <td>{el.shipping.data}</td>
                                    <td>
                                        <DropdownButton align="end" id="dropdown-menu-align-end" title=''>
                                            <Dropdown.Item eventKey="1" onClick={(event)=>{
                                                setLoadPedidos(true);
                                                deleteOrder(el.id); 
                                                getPedidos()}}>Exclui</Dropdown.Item>
                                            <Dropdown.Item eventKey="2" onClick={(event)=>{
                                                context.setIdPedidoEdit(el.id);
                                                context.form.setShowEdit(true);
                                            }}>Editar</Dropdown.Item>
                                        </DropdownButton>
                                    </td>
                                </tr>)
                        })}
                    </tbody>
                </Table>
            }
        </div>
    )
}