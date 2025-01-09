import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { DEFAULT_PROFILE_IMAGE } from "../utils/commonConstant.js";

class User {
  constructor(name, email, password, profilePicture, userRole, id, createdAt) {
    this.id = id || null;
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture || DEFAULT_PROFILE_IMAGE;
    this.userRole = userRole || "user";
    this.createdAt = createdAt || Timestamp.now();
  }

  /**
   * Retrieve a user from Firestore by Email.
   * @returns void
   */
  async save() {
    const db = getFirestore();

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      profilePicture: this.profilePicture,
      userRole: this.userRole,
      createdAt: this.createdAt,
    };

    const docRef = db.collection("users").doc();
    await docRef.set(userData);
  }

  /**
   * Retrieve a user from Firestore by Email.
   * @param {string} email - User email
   * @returns {User} - User object or null if not found
   */
  static async findByEmail(email) {
    const db = getFirestore();

    const userDoc = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    let user;

    userDoc.forEach((doc) => {
      const data = doc.data();
      user = new User(
        data.name,
        data.email,
        data.password,
        data.profilePicture,
        data.userRole,
        doc.id,
        data.createdAt,
      );
    });

    return user;
  }

  /**
   * Delete a user from Firestore by ID.
   * @param {string} id - Firestore document ID
   */
  static async deleteById(id) {
    const db = admin.firestore();
    await db.collection("users").doc(id).delete();
    console.log(`User with ID ${id} deleted successfully!`);
  }

  /**
   * Get all users from the `users` collection.
   * @returns {User[]} - Array of User objects
   */
  static async findAll() {
    const db = admin.firestore();
    const snapshot = await db.collection("users").get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new User(
        doc.id,
        data.name,
        data.email,
        data.password,
        data.createdAt,
        data.address
      );
    });
  }
}

export default User;
