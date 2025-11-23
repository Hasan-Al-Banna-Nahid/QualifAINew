// lib/services/firebase-auth-service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/(main)/lib/firebase/config";

export interface User {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class FirebaseAuthService {
  resetPassword(email: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  private userCache = new Map<string, User>();

  // Email/Password Registration
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: name,
      });

      // Create user document in Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        name,
        email,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (firestoreError) {
        console.warn(
          "Firestore write failed, but auth succeeded:",
          firestoreError
        );
        // Continue even if Firestore fails - we'll sync later
      }

      // Get ID token
      const token = await firebaseUser.getIdToken();

      // Cache user
      this.userCache.set(firebaseUser.uid, userData);

      // Store in localStorage as fallback
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      return {
        user: userData,
        token,
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(this.getFirebaseError(error.code));
    }
  }

  // Email/Password Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Try to get user data from Firestore, but fallback to auth data if offline
      let userData: User;

      try {
        userData = await this.getUserFromFirestore(firebaseUser.uid);

        // If Firestore fails, create user data from auth info
        if (!userData) {
          userData = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email!,
            avatar: firebaseUser.photoURL || undefined,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Try to save to Firestore, but don't fail if offline
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              ...userData,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (firestoreError) {
            console.warn(
              "Firestore write failed during login:",
              firestoreError
            );
          }
        }
      } catch (firestoreError) {
        console.warn("Firestore read failed, using auth data:", firestoreError);
        // Fallback to auth data
        userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email!,
          avatar: firebaseUser.photoURL || undefined,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Get ID token
      const token = await firebaseUser.getIdToken();

      // Cache user
      this.userCache.set(firebaseUser.uid, userData);

      // Store in localStorage as fallback
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      return {
        user: userData,
        token,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(this.getFirebaseError(error.code));
    }
  }

  // Google Sign In
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      let userData: User;

      try {
        // Check if user exists in Firestore
        userData = await this.getUserFromFirestore(firebaseUser.uid);

        // If user doesn't exist, create them
        if (!userData) {
          userData = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email!,
            avatar: firebaseUser.photoURL || undefined,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Try to save to Firestore, but don't fail if offline
          try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
              ...userData,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (firestoreError) {
            console.warn(
              "Firestore write failed for Google sign-in:",
              firestoreError
            );
          }
        }
      } catch (firestoreError) {
        console.warn(
          "Firestore read failed for Google sign-in, using auth data:",
          firestoreError
        );
        // Fallback to auth data
        userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email!,
          avatar: firebaseUser.photoURL || undefined,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Get ID token
      const token = await firebaseUser.getIdToken();

      // Cache user
      this.userCache.set(firebaseUser.uid, userData);

      // Store in localStorage as fallback
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      return {
        user: userData,
        token,
      };
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      throw new Error(this.getFirebaseError(error.code));
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.userCache.clear();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local data
      this.userCache.clear();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      throw new Error(this.getFirebaseError(error.code));
    }
  }

  // Get current user with offline support
  async getCurrentUser(): Promise<User | null> {
    // First check localStorage for cached user data
    try {
      const cachedUser = localStorage.getItem("user_data");
      const token = localStorage.getItem("auth_token");

      if (cachedUser && token) {
        const userData = JSON.parse(cachedUser);
        this.userCache.set(userData.uid, userData);
        return userData;
      }
    } catch (error) {
      console.warn("Error reading cached user data:", error);
    }

    const user = auth.currentUser;
    if (!user) return null;

    try {
      // Check cache first
      const cachedUser = this.userCache.get(user.uid);
      if (cachedUser) return cachedUser;

      // Try to get from Firestore
      try {
        const userData = await this.getUserFromFirestore(user.uid);
        if (userData) {
          this.userCache.set(user.uid, userData);
          // Update localStorage
          localStorage.setItem("user_data", JSON.stringify(userData));
          return userData;
        }
      } catch (firestoreError) {
        console.warn("Firestore read failed, using auth data:", firestoreError);
      }

      // Fallback to auth data
      const fallbackUser: User = {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email!,
        avatar: user.photoURL || undefined,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.userCache.set(user.uid, fallbackUser);
      localStorage.setItem("user_data", JSON.stringify(fallbackUser));

      return fallbackUser;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Get user from Firestore with better error handling
  private async getUserFromFirestore(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: data.uid || uid,
          name: data.name || "User",
          email: data.email || "",
          avatar: data.avatar,
          role: data.role || "user",
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      throw error; // Re-throw to handle in calling function
    }
  }

  // Update user profile with offline support
  async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const updatedData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Try to update Firestore, but don't fail completely if offline
      try {
        await updateDoc(doc(db, "users", user.uid), updatedData);
      } catch (firestoreError) {
        console.warn("Firestore update failed:", firestoreError);
        // We'll continue to update local state even if Firestore fails
      }

      // Update Firebase Auth profile if name changed
      if (updates.name && user.displayName !== updates.name) {
        await updateProfile(user, {
          displayName: updates.name,
        });
      }

      // Update cache and localStorage
      const currentUser = this.userCache.get(user.uid);
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...updates,
          updatedAt: new Date(),
        };
        this.userCache.set(user.uid, updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw new Error(this.getFirebaseError(error.code));
    }
  }

  // Firebase error code to user-friendly messages
  private getFirebaseError(code: string): string {
    const errorMap: { [key: string]: string } = {
      // Authentication errors
      "auth/email-already-in-use":
        "This email is already registered. Please try logging in instead.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/operation-not-allowed":
        "Email/password accounts are not enabled. Please contact support.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/user-disabled":
        "This account has been disabled. Please contact support.",
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-credential": "Invalid login credentials.",
      "auth/account-exists-with-different-credential":
        "An account already exists with the same email but different sign-in credentials.",
      "auth/popup-closed-by-user": "Sign-in was cancelled.",
      "auth/network-request-failed":
        "Network error. Please check your connection and try again.",
      "auth/too-many-requests":
        "Too many unsuccessful login attempts. Please try again later.",

      // Firestore errors
      "failed-precondition":
        "Service temporarily unavailable. Please try again.",
      unavailable: "Service unavailable. Please check your connection.",
      "resource-exhausted": "Service limit reached. Please try again later.",

      // Generic error
      "auth/internal-error": "An internal error occurred. Please try again.",
      unavailable:
        "Service unavailable. Please check your internet connection.",
    };

    return errorMap[code] || "An unexpected error occurred. Please try again.";
  }

  // Get cached user (O(1) operation)
  getCachedUser(uid: string): User | undefined {
    return this.userCache.get(uid);
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.userCache.clear();
  }
}

export const firebaseAuthService = new FirebaseAuthService();
