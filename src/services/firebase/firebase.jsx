import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyDaqfsWVkonW6Z7EnAAVV0IVf__rkTG8t0",
    authDomain: "stock-manage-a017a.firebaseapp.com",
    projectId: "stock-manage-a017a",
    storageBucket: "stock-manage-a017a.appspot.com",
    messagingSenderId: "507013012603",
    appId: "1:507013012603:web:048989bd0dfabffcd816de"
};

export const app = initializeApp(firebaseConfig);