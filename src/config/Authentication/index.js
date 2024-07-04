const {
    getAuth,
    admin,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} = require("../firebase");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail")

const authentication = getAuth();

class Authentication {
    async registerUser(userAccount, next) {
        console.log(userAccount);
        const { email, password } = userAccount;
        if (!email || !password) {
            return { message: "There are some missing required fields", status: 422 };
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
            // console.log(userCredential);

            // Generate email verification link
            const emailVerificationLink = await admin.auth().generateEmailVerificationLink(email);
            await sendEmail(email, emailVerificationLink);

            return { message: "Create new user successfully. Verification email sent!", status: 200, userCredential };
        } catch (error) {
            console.log("Error in Authentication", error.message);
            next();
            return { message: "An error occurred while creating user. Maybe this user already existed.", status: 500 };
        }
    }

    async loginUser(userAccount, next) {
        const { email, password } = userAccount;
        if (!email || !password) {
            return { message: "There are some missing required fields", status: 422 };
        }
        try {
            const userCredential = await signInWithEmailAndPassword(authentication, email, password);
            if (await User.isAdmin(userCredential.user?.uid, () => { })) {
                await signOut(authentication);
                return { message: "This is admin account", status: 200 };
            }
            return { message: "Login successfully", status: 200, userCredential: userCredential };
        } catch (error) {
            console.log("Error in Authentication", error.message);
            next();
            return { message: "An error occurred while login", status: 500 };
        }

    }

    async logoutUser(next) {
        try {
            await signOut(authentication);
        } catch (error) {
            console.log("Error in Authentication", error.message);
            next();
            return { message: "Internal Server Error", status: 500 };
        }
        return { message: "User logged out successfully", status: 200 };
    }
}

module.exports = new Authentication;