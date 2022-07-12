const User = require('./UserModel');
const bcrypt = require('bcrypt');



const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10)

    let user = new User ({ username, email, password: encryptedPassword});

    const userExists = await User.findOne({"$or": [{ username: username}, {email: email}]}).exec();
    
    if(userExists){
        res.status(422).json({
            message: "Username or Email already in use."
        })
    } else {
        user.save().then(user=> {
            res.json({
                message: 'User Added Succesfully!'
            })
        })
        .catch(error => {
            console.log(error);
            res.json({ // res.json and res.send are the same thing
                message: 'User failed to add'
            })
        })
    }

}

module.exports = {
    register
}