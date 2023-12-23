const express =require('express')
const router = express.Router();
const{register,login,token,logout}=require('../../controller/authController')

router.post("/register", register);
router.post("/login",login );
router.post("/token", token);
router.post("/logout",logout);


module.exports =router ;