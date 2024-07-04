const { dbFirestore } = require("../firebase")

const usersRef = dbFirestore.collection("Users");

class Firestore {
    async createNewUser(userInfo, next) {
        console.log(userInfo);
        const {userID, avatarPath, fullname, favoriteGenres, role} = userInfo;
        // if(!userID) {
        //     return { message: "Missing userID", status: 422 };
        // }
        const fullUserInfo = {
            userID,
            avatarPath,
            fullname,
            favoriteGenres,
            favoriteList: [],
            historyList: [],
            role
        }
        try {
            await usersRef.doc(userID).set(fullUserInfo);
        }catch {
            next();
        }
    }

    async isAdmin(userID, next) {
        console.log("Checking role of ", userID);
        try {
            const userSnapshot = await usersRef.doc(userID).get();
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
}

module.exports = new Firestore;