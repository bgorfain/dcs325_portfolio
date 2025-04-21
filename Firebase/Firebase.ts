// Import the required Firebase modules for app initialization and Firestore access.
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

// The firebaseConfig object contains the credentials for the Firebase project.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize the Firebase app with the provided configuration.
const app = initializeApp(firebaseConfig)
// Get an instance of the Firestore database from the initialized app.
export const db = getFirestore(app)

// This function fetches all courses from the Firestore 'Courses' collection and downloads them as a JSON file.
export async function downloadCoursesAsJson() {
  // Get a reference to the 'Courses' collection in Firestore.
  const coursesCol = collection(db, "Courses");
  // Fetch all documents from the 'Courses' collection.
  const courseSnapshot = await getDocs(coursesCol);
  // Map the documents to their data objects.
  const courseList = courseSnapshot.docs.map(doc => doc.data());
  // Convert the course list to a formatted JSON string.
  const json = JSON.stringify(courseList, null, 2);
  // Create a Blob object for the JSON data to enable downloading.
  const blob = new Blob([json], { type: "application/json" });
  // Create a URL for the Blob object.
  const url = URL.createObjectURL(blob);
  // Create an anchor element to trigger the download.
  const a = document.createElement("a");
  a.href = url;
  a.download = "courses.json";
  // Add the anchor to the document and programmatically click it to start the download.
  document.body.appendChild(a);
  a.click();
  // Remove the anchor from the document and revoke the Blob URL to free resources.
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
