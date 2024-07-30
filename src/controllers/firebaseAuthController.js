const { 
    getAuth, 
    admin,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    collection,
    addDoc, 
    dbFirestore
   } = require('../config/firebase');
const Authentication = require("../config/Authentication");
const User = require('../models/userModel');

class FirebaseAuthController {
    async registerUser(req, res) {
        // console.log(req.body);
        // const { email, password } = req.body;
        // if (!email || !password) {
        //     return res.status(422).json({
        //     email: "Email is required",
        //     password: "Password is required",
        //     });
        // }
        // createUserWithEmailAndPassword(auth, email, password)
        // .then((userCredential) => {
        //     // addDoc(collection(dbFirestore,"Users"), {
        //     //     "avatarPath": "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
        //     //     "email": email,
        //     //     "favoriteGenres": [],
        //     //     "favoriteList": [],
        //     //     "fullname": email,
        //     //     "historyList": [],
        //     //     "password": password,
        //     //     "role": "customer"
        //     // })
        //     console.log(userCredential);
        //     res.status(201).json({ message: "Verification email sent! User created successfully!" });
        // })
        // .catch((error) => {
        //     const errorMessage = error.message || "An error occurred while registering user";
        //     res.status(500).json({ error: errorMessage });
        // });
        const {message, status, userCredential} = await Authentication.registerUser(req.body, () => {});
        if(userCredential) {
            const userInfo = {
                "userID": userCredential.user?.uid,
                "avatarPath": "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
                "email": req.body.email,
                "role": "customer"
            }
            await User.createNewUser(userInfo ,() => {});
        }
        res.status(status).json({message});
    } 
    
    async loginUser(req, res) {
        // const { email, password } = req.body;
        // if (!email || !password) {
        //     return res.status(422).json({
        //         email: "Email is required",
        //         password: "Password is required",
        //     });
        // }

        // signInWithEmailAndPassword(auth, email, password)
        // .then((userCredential) => { 
        //     const idToken = userCredential._tokenResponse.idToken
        //     if (idToken) {
        //         // res.cookie('access_token', idToken, {
        //         //     httpOnly: true
        //         // });
        //         res.status(200).json({ message: "User logged in successfully", userCredential });
        //     } else {
        //         res.status(500).json({ error: "Internal Server Error" });
        //     }
        // })
        // .catch((error) => {
        //     console.error(error);
        //     const errorMessage = error.message || "An error occurred while logging in";
        //     res.status(500).json({ error: errorMessage });
        // });
        const {message, status, userCredential} = await Authentication.loginUser(req.body, () => {});
        if(userCredential) {
            res.cookie("uid", userCredential.user.uid, { expires: new Date(Date.now() + 900000), httpOnly: true });
        }
        res.status(status).json({message,userCredential});
        console.log({message, status});
    }

    async logoutUser(req, res) {
        // signOut(auth)
        //   .then(() => {
        //     //res.clearCookie('access_token');
        //     res.status(200).json({ message: "User logged out successfully" });
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //     res.status(500).json({ error: "Internal Server Error" });
        //   });

        const {message, status} = await Authentication.logoutUser(() => {});
        res.clearCookie("uid");
        res.status(status).json({message});
        console.log({message, status});
    }
}
  
module.exports = new FirebaseAuthController();