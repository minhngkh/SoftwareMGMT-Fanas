const { dbFirestore } = require("../firebase")

const userCollection = dbFirestore.collection("Users");

class User {
    async createNewUser(userInfo, next) {
        console.log(userInfo);
        const {userID, avatarPath, email, role} = userInfo;
        // if(!userID) {
        //     return { message: "Missing userID", status: 422 };
        // }
        const fullUserInfo = {
            userID,
            avatarPath,
            email,
            favoriteGenres:[],
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
}

module.exports = new User;