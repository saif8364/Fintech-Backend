import admin from 'firebase-admin';
import { errorResponse } from '../utils/errorResponse.js';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceaccountkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const auth = admin.auth();

// Verify ID token
export const verifyIdToken = async (req,res,next) => {
    try {
        const idToken = req.headers.authorization.split(" ")[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        console.log('Verified UID:', decodedToken.uid);
        req.user = decodedToken;
        next()
    } catch (error) {
        console.error('Token verification failed:', error);
        errorResponse(res, 'Unauthorized', 401);
    }
};
