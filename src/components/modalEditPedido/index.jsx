import React, {useContext} from "react";
import { Modal, Button } from "react-bootstrap";
import FormPedido from "../formPedido";
import { Context } from "../../contexts/pagePedidos";

function ModalEditPedido(props) {
    const context = useContext(Context);

    return (
        <Modal
            show={context.form.showEdit}
            onHide={() => {
                context.form.setShowEdit(false);
                context.setIdPedidoEdit(false);
            }}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormPedido idPedido={context.idPedidoEdit} />
            </Modal.Body>
            <Modal.Footer>
                <article>
                    <p>TOTAL DO PEDIDO:</p>
                    <h2 style={{ fontWeight: "bold" }}>{context.form.vlTotalPedido}</h2>
                </article>
                <Button variant="warning" type="submit" form="formIncluirPedido">
                    SALVAR ALTERAÇÃO
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEditPedido;
