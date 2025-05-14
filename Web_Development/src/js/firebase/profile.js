// profile.js
import { auth, db } from "./firebaseConfig.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const IMGBB_API_KEY = "7358f23b1f2d81c20df3232eaaee1567";

// DOM refs
const usernameP  = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const profileImg = document.querySelector("#profile-picture");
const fileInput  = document.querySelector("#upload-profile");
const loadingOverlay = document.querySelector(".loading-overlay");
const content = document.querySelector(".content");

// Watch auth
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../../pages/index.html";
    return;
  }

  // Load profile data
  try {
    const userRef  = doc(db, "users", user.uid);
    const snap     = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      usernameP.innerText = "#" + (data.username || "Unnamed");
      emailInput.value    = data.email || "";
      phoneInput.value    = data.phone || "";
      if (data.profilePicture) {
        profileImg.src = data.profilePicture;
      }
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
  } finally {
    // Hide loading overlay and show content
    loadingOverlay.style.display = "none";
    content.classList.add("loaded");
  }

  // Handle new image uploads via ImgBB
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      const formData = new FormData();
      formData.append("key", IMGBB_API_KEY);
      formData.append("image", base64Data);

      try {
        // 1) Upload to ImgBB
        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error.message);

        // 2) Get the hosted URL
        const downloadURL = json.data.url;

        // 3) Save it in Firestore
        await updateDoc(doc(db, "users", user.uid), {
          profilePicture: downloadURL
        });

        // 4) Update the <img> right away
        profileImg.src = downloadURL;

      } catch (uploadErr) {
        console.error("ImgBB upload failed:", uploadErr);
        alert("Image upload failed. Please try again.");
      }
    };
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      alert("Could not read file.");
    };
    reader.readAsDataURL(file);
  });
});

