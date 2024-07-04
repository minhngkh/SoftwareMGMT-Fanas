const { getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut} = require("../firebase");
const Firestore = require("../Firestore");

const authentication = getAuth();

class Authentication {
    async registerUser(userAccount, next) {
        console.log(userAccount);
        const {email, password} = userAccount;
        if(!email || !password) {
            return { message: "There are some missing required fields", status: 422 };
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
            // console.log(userCredential);
            return { message: "Create new user successfully", status: 200, userCredential };
        }catch {
            next();
            return { message: "An error occurred while creating user. Maybe this user already existed.", status: 500 };
        }
    }
    
    async loginUser(userAccount, next) {
        const {email, password} = userAccount;
        if(!email || !password) {
            return { message: "There are some missing required fields", status: 422 };
        }
        try {
            const userCredential = await signInWithEmailAndPassword(authentication, email, password);
            if(await Firestore.isAdmin(userCredential.user?.uid, () => {})) {
                await signOut(authentication);
                return { message: "This is account admin account", status: 200 };
            }
            return { message: "Login successfully", status: 200, uid: userCredential.user?.uid };
        }catch {
            next();
            return { message: "An error occurred while loging in", status: 500 };
        }
        
    }

    async logoutUser(next) {
        try {
            await signOut(authentication);
        }catch {
            next();
            return { message: "Internal Server Error", status: 500 };
        }
        return { message: "User logged out successfully", status: 200 };
    }
}

module.exports = new Authentication;