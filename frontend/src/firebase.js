import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI7iq2c_6f4nWzdqdT44qyEp9PdCzwgKU",
  authDomain: "ai-career-recommendation-9c5e2.firebaseapp.com",
  projectId: "ai-career-recommendation-9c5e2",
  storageBucket: "ai-career-recommendation-9c5e2.firebasestorage.app",
  messagingSenderId: "720119768106",
  appId: "1:720119768106:web:04b8f447cdcc736bdd0f53",
  measurementId: "G-CP5BQ50W0T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;