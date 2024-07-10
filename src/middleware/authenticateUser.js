const {
  getAuthAdmin,
  getAuthClient
} = require("../config/firebase");

const authClient = getAuthClient();

const authenticateUser = async (req, res, next) => {
    await authClient.onAuthStateChanged((user) => {
      if(!user) {
        res.redirect('/signin');
      }else {
        return next();
      }
    })

    // const idToken = req.headers.authorization;
    // console.log("::::idToken", idToken);

    // try {
    //   const decodedToken = await authAdmin.verifyIdToken(idToken);
    //   req.user = decodedToken;
    // }
    // catch(error) {
    //   console.log('Error verifying ID token:', error);
    //   res.redirect('/login');
    //   // res.status(401).json({ error: 'Invalid token' });
    // }
  };

module.exports = authenticateUser;