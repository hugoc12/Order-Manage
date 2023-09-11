import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Pedidos from './pages/pedidos';
import Estoque from "./pages/estoque"

const browser = createBrowserRouter([ //Criação da estrutura de navegação.
  {
    path:'/',
    element:<Pedidos/>
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