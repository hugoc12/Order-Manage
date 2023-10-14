import React, {createContext, useState} from 'react';
import PropTypes from 'prop-types';

export const Context = createContext(null);

function PedidoContextProvider({ children }) {
    //States from form...
    const [show, setShow] = useState(false);
    const [validacaoForm, setValidacaoForm] = useState(false);
    const [radioChecked, setRadioChecked] = useState("pessoa física");
    const [listProducts, setListProducts] = useState([]);
    const [vlTotalItem, setvlTotalItem] = useState('R$ 0,00');
    const [vlTotalPedido, setVlTotalPedido] = useState('R$ 0,00');
    const [cart, setCart] = useState([]);
    const [dataForm, setDataForm] = useState(null);

    let BRReal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <Context.Provider value={{
            titulo:'Hugo',
            currency:BRReal,
            form:{
                show,
                setShow,

                validacaoForm,
                setValidacaoForm,

                radioChecked,
                setRadioChecked,

                listProducts,
                setListProducts,

                vlTotalItem,
                setvlTotalItem,

                vlTotalPedido,
                setVlTotalPedido,

                cart,
                setCart,

                dataForm,
                setDataForm
            }
        }}>
            {children}
        </Context.Provider>
    );
}

PedidoContextProvider.propTypes = {
    children:PropTypes.node.isRequired
}


export default PedidoContextProvider;