import { db } from "../../firebase/firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

let products = [];

const fetchProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.image
      };
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Initialize products
fetchProducts().catch(error => {
  console.error("Failed to initialize products:", error);
});

export default fetchProducts;
