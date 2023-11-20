import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Pedidos from './pages/pedidos';
import Estoque from "./pages/estoque"
import PedidoContextProvider from './contexts/pagePedidos';

const browser = createBrowserRouter([ //Criação da estrutura de navegação.
  {
    path:'/',
    element:<PedidoContextProvider><Pedidos/></PedidoContextProvider>
  },
  {
    path:'/estoque',
    element:<Estoque/>
  },
])

export default function App() {
  return (
    <RouterProvider router={browser}/> //Disponibilizando a estrutura de navegação
  )
}