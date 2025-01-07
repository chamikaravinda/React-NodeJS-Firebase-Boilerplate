import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

class User {

  constructor(name, email, password, profilePicture, userRole, id, createdAt) {
    this.id = id || null;
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    this.userRole = userRole || "user";
    this.createdAt = createdAt || Timestamp.now();
  }


  async save() {
    const db = getFirestore();
    const userCollection = db.collection('users').doc();

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      profilePicture: this.profilePicture,
      userRole: this.userRole,
      createdAt: this.createdAt,
    };

    if (this.id) {
      await userCollection.doc(this.id).set(userData);
    } else {
      console.log('Creating new user in Firestore...');
      const docRef = await userCollection.set(userData);
      this.id = docRef.id;
    }
    console.log(`User ${this.id ? 'updated' : 'created'} successfully!`);
  }

  /**
   * Retrieve a user from Firestore by ID.
   * @param {string} id - Firestore document ID
   * @returns {User} - User object or null if not found
   */
  static async findById(id) {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(id).get();

    if (userDoc.exists) {
      const data = userDoc.data();
      return new User(id, data.name, data.email, data.password, data.createdAt, data.address);
    } else {
      console.log(`User with ID ${id} not found.`);
      return null;
    }
  }

  /**
   * Delete a user from Firestore by ID.
   * @param {string} id - Firestore document ID
   */
  static async deleteById(id) {
    const db = admin.firestore();
    await db.collection('users').doc(id).delete();
    console.log(`User with ID ${id} deleted successfully!`);
  }

  /**
   * Get all users from the `users` collection.
   * @returns {User[]} - Array of User objects
   */
  static async findAll() {
    const db = admin.firestore();
    const snapshot = await db.collection('users').get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new User(doc.id, data.name, data.email, data.password, data.createdAt, data.address);
    });
  }
}

export default User;
