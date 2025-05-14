import { db } from "../../firebase/firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

let issues;
try {
  const snapshot = await getDocs(collection(db, 'items'));
  products = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id, // Use document ID as product ID, assuming it matches the static array
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image
    };
  });
} catch (error) {
  console.error("Error fetching products:", error);
  issues = []; // Fallback to empty array on error
}

export default issues;
