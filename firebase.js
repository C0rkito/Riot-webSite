
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword}
from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

import {doc,getDoc,setDoc,arrayUnion,updateDoc, getFirestore,arrayRemove} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";



export default function makeFirebaseService() {

  const firebaseConfig = {
    apiKey: "AIzaSyD_SHXyYinfBAF31653aSZtGan7URNrpTQ",
    authDomain: "music-app-343f0.firebaseapp.com",
    projectId: "music-app-343f0",
    storageBucket: "music-app-343f0.firebasestorage.app",
    messagingSenderId: "149307461855",
    appId: "1:149307461855:web:c345432795d639c613996a"
  };


  const app = initializeApp(firebaseConfig);


  const auth = getAuth(app);
  const db = getFirestore(app); 

  let service = {
    createAccount,
    signInUser,

    getFavorites,
    addFavorites,
    removeFavorites
  };


  async function signInUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Erreur lors de la connexion de l'utilisateur:", error);
    }
  }


  async function createAccount(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    }
  }


  async function getFavorites(userId) {
    try {

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);   


      if (userSnap.exists()) {

        const favoris = userSnap.data().favoris;
        return favoris;
      } else {
        return null;
      }

    } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
    }
  }



  async function addFavorites(userId,valeur){
    const userRef = doc(db, "users", userId);  
    const userSnap = await getDoc(userRef); 


    if(!userSnap.exists()){
      await setDoc(userRef, { ["favoris"]: [] });
    }


    let data = {
        id: valeur.id,
        title: valeur.title,
        type: valeur.type,
        cover_image: valeur.cover_image,
        
    };

    if (data.type === 'release') {
        data.year = valeur.year ||  null;
        data.country = valeur.country;
        data.master_id = valeur.master_id;
    }

    if (data.type === 'master') {
        data.master_id = valeur.master_id;
        data.community = {
            have: valeur.community.have,
            want: valeur.community.want
        };
    }

    await updateDoc(userRef, {favoris: arrayUnion(data)});

  }

  async function removeFavorites(userId, valeur) {
      try {
          const userRef = doc(db, "users", userId);
          if (valeur && valeur.id) {
              const userSnap = await getDoc(userRef);
              const favoris = userSnap.data()?.favoris || [];
              const updatedFavoris = favoris.filter(fav => fav.id !== valeur.id);
              await updateDoc(userRef, { favoris: updatedFavoris });
          } else {
              console.error("valeur n'a pas de champ id");
          }
      } catch (error) {
          console.error("Erreur lors de la suppression du favori :", error);
      }
  }

  return service;

}
