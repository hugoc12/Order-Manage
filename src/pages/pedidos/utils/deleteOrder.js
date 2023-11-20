import { firestoreDB } from "../../../services/firebase/firebase";
import {doc, deleteDoc} from 'firebase/firestore'

async function deleteOrder(idOrder){
    try{
        let docDeleted = await deleteDoc(doc(firestoreDB, 'pedidos', idOrder));
        console.log(docDeleted);
    }catch(err){
        console.log(err);
    }
}

export default deleteOrder;