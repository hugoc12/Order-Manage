import React, {useContext} from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormPedido from '../formPedido';
import { Context } from '../../contexts/pagePedidos';

function ModalPedido(props) {
    const context = useContext(Context);

    return (
        <Modal show={context.form.show} onHide={() => context.form.setShow(false)} size='lg'>
            <Modal.Header closeButton><Modal.Title>Modal heading</Modal.Title></Modal.Header>
            <Modal.Body>
                <FormPedido />
            </Modal.Body>
            <Modal.Footer >
                <article>
                    <p>TOTAL DO PEDIDO:</p><h2 style={{ fontWeight: 'bold' }}>{context.form.vlTotalPedido}</h2>
                </article>
                <Button variant="primary" type='submit' form='formIncluirPedido'>
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalPedido;