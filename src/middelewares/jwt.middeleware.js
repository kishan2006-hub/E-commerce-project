import jwt from "jsonwebtoken"

const jwtAuth = (req,res,next)=>{
   
    const token = req.headers["authorization"]
    
    if(!token){
       return res.status(401).send("Unauthorized")
    }

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = payload.userId
    }catch(err){
        return res.status(401).send("Expire your token.")
    }

    next()
}


export default jwtAuth

