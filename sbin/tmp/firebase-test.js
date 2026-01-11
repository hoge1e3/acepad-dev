#!run
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js';

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
//  import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js'

// Add Firebase products that you want to use
import { getAuth, GoogleAuthProvider,signInWithPopup  } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';
import { getFirestore, setDoc, doc, Bytes  } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js';
export async function main(){
  const firebaseConfig = this.resolve("/firebase.json").obj();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log("logged in:", user.uid, user.email);

  const hash="test";
  const data=new Uint8Array([1,5,10]);
  // 例: sha256 の blob を保存する
  await setDoc(
    doc(db, "git_objects", hash),   // ← これが doc id
    {
      type: "blob",
      size: data.length,
      data: Bytes.fromUint8Array(data),                   // Uint8Array でも可
    }
  );
  return "done";
}