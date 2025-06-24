function validate_credentials(req,res,next){
    let {email,password}=req.body
        let email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
           if(!(email_pattern.test(email) && password.length >= 8)){
            console.log('invalid input')
            return res.status(400).json({error:'invalid input'}); 
           }//handle with error middleware
           next() 
}
module.exports={validate_credentials}