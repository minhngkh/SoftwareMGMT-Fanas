const {
  getAuthClient,
  getAuthAdmin,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
} = require("../firebase");
require("firebase/auth");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail");

const authClient = getAuthClient();
const authAdmin = getAuthAdmin();

const SESSION_EXPIRATION_TIME = 60 * 60 * 24 * 5 * 1000; // 5 days

class Authentication {
  async registerUser(userAccount, next) {
    const { email, password } = userAccount;
    if (!email || !password) {
      return { message: "There are some missing required fields", status: 422 };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        authClient,
        email,
        password,
      );
      // console.log(userCredential);

      // Generate email verification link
      // const emailVerificationLink = await admin.auth().generateEmailVerificationLink(email);
      // await sendEmail(email, emailVerificationLink);

      return {
        message: "Create new user successfully. Verification email sent!",
        status: 200,
        userCredential,
      };
    } catch (error) {
      console.log("Error in Authentication", error.message);
      next();
      return {
        message:
          "An error occurred while creating user. Maybe this user already existed.",
        status: 500,
      };
    }
  }

  async loginUser(userAccount, next) {
    const { email, password } = userAccount;
    if (!email || !password) {
      return { message: "There are some missing required fields", status: 422 };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        authClient,
        email,
        password,
      );

      if (await User.isAdmin(userCredential.user?.uid, () => {})) {
        // await signOut(authClient);
        return { message: "This is admin account", status: 200 };
      }

      const idToken = await userCredential.user.getIdToken();
      const sessionCookie = await authAdmin.createSessionCookie(idToken, {
        expiresIn: SESSION_EXPIRATION_TIME,
      });

      return {
        message: "Login successfully",
        status: 200,
        userCredential: userCredential,
        sessionCookie: sessionCookie,
        expirationTime: SESSION_EXPIRATION_TIME,
      };
    } catch (error) {
      console.log("Error in Authentication", error.message);
      next();
      return { message: "An error occurred while login", status: 500 };
    }
  }

  async changePassword(newPassword) {
    try {
      if (this.isLoggedIn()) {
        await updatePassword(authClient.currentUser, newPassword);
        return { message: "Password updated successfully", status: 200 };
      }
    } catch (error) {
      console.error("Error in Authentication:", error.message);
      if (error.code === "auth/weak-password") {
        return { message: "The new password is too weak.", status: 400 };
      }
      return {
        message: "An error occurred while updating the password",
        status: 500,
      };
    }
  }

  async reAuthenticate(currentUserPassword) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        authClient,
        authClient.currentUser.email,
        currentUserPassword,
      );
      if (userCredential) {
        return true;
      }
    } catch (error) {
      console.log("Error in Authentication", error.message);
      return false;
    }
  }

  async logoutUser(sessionCookie) {
    try {
      await authAdmin
        .verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
          return authAdmin.revokeRefreshTokens(decodedClaims.sub);
        });

      return { success: true };
    } catch {
      return { message: "An error occurred while logout", success: false };
    }
  }

  isLoggedIn() {
    const user = authClient.currentUser;
    if (user) {
      return true;
    }
    return false;
  }

  async changePassword(newPassword) {
    try {
      if (this.isLoggedIn()) {
        await updatePassword(authClient.currentUser, newPassword);
        return { message: "Update password successfully", status: 200 };
      }
    } catch (error) {
      if (error.code === "auth/weak-passwor") {
        console.log(error);
        return { message: "Update password successfully", status: 200 };
      }
    }
  }
}

module.exports = new Authentication();
