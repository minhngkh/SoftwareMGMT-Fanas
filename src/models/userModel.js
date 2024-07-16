const { dbFirestore } = require("../config/firebase")

const userCollection = dbFirestore.collection("Users");

class User {
    async createNewUser(userInfo, next) {
        const {userID, avatarPath, email, role, favoriteGenres} = userInfo;
        // if(!userID) {
        //     return { message: "Missing userID", status: 422 };
        // }
        const fullUserInfo = {
            userID,
            avatarPath,
            email,
            favoriteGenres: favoriteGenres,
            favoriteList: [],
            historyList: [],
            role
        }
        try {
            const userRef= userCollection.doc(userID)
            await userRef.set(fullUserInfo);
        }catch {
            next();
        }
    }

    async isAdmin(userID, next) {
        console.log("Checking role of ", userID);
        try {
            const userSnapshot = await userCollection.doc(userID).get();
            if(userSnapshot.exists) {
                const role = userSnapshot.data().role;
                if(role === "admin") {
                    return true;
                }else {
                    return false;
                }
            }
        }catch {
            next();
        }
    }

    async getUser(userID, next) {
        try {
            const userSnapshot = await userCollection.doc(userID).get();
            if(userSnapshot.exists) {
                const userData = userSnapshot.data();
                return userData;
            }else {
                return {};
            }
        }catch {
            next();
            return {};
        }
    }
}

module.exports = new User;