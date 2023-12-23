const grantAuth =(req,res,next)=>{

if(req.user.role == 'admin'){
    next()
}else{
    res.send('not granted permision')
}

}


module.exports=grantAuth