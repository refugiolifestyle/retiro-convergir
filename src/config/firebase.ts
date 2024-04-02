import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  'PROD': {
    apiKey: "AIzaSyCY4W8kF23z-azgqLhuSC3rt91OkTWITbw",
    authDomain: "retiro-cdd86.firebaseapp.com",
    databaseURL: "https://retiro-cdd86-default-rtdb.firebaseio.com",
    projectId: "retiro-cdd86",
    storageBucket: "retiro-cdd86.appspot.com",
    messagingSenderId: "342629120938",
    appId: "1:342629120938:web:d047730b54f9c0e12749d3"
  },
  'TESTE': {
    apiKey: "AIzaSyCubXIEtjg0zndG5kEHvRFJoOK9S5Cct48",
    authDomain: "retiro-teste.firebaseapp.com",
    databaseURL: "https://retiro-teste-default-rtdb.firebaseio.com",
    projectId: "retiro-teste",
    storageBucket: "retiro-teste.appspot.com",
    messagingSenderId: "693062890363",
    appId: "1:693062890363:web:1f672f47092a049b64c3de"
  },
  'LOCAL': {
    databaseURL: "http://127.0.0.1:4000/database",
    storageBucket: "http://127.0.0.1:4000/storage",
  }
}


export const app = initializeApp(firebaseConfig['PROD']);
export const storage = getStorage(app);
export const database = getDatabase(app);