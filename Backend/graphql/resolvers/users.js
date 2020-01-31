const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { SECRET_KEY } = require('../../config')
const User  = require('../../models/User')

//test
const { userValidation } = require('../validation/uservalidation')
const { objectFuncOne } = require('../validation/uservaldationObject')

const  { validateRegisterInput, validateLoginInput }  = require('../../utils/validations')

function generateToken(user) {
   return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'})

}

module.exports = {
    Mutation: {
        async login(_, {loginInput: {username, password}, context,info}){
            const { valid, errors } =  validateLoginInput(username,password);
            const user = await User.findOne({ username })
            if(!valid) {
                throw new UserInputError( 'Input Error', { errors })
            }
            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong Credentials', { errors })
            }

            const copiedUser = { ...user } 

            console.log('copiedUser: ', copiedUser)
            const token = generateToken(user)

            return {
                butu:"hahah",
                ...user._doc,
                id: user._id,
        
            }

        },

        //most of the time args
        // register(parent, args, context, info) original params

        //args is here the input RegisterInput in type Def
        async register(_, { registerInput: { username, email, password, confirmPassword} }, context, info) {
            // TODO
            // Validate User
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
           
            if(!valid) {
                throw new UserInputError( 'Input Error', { errors })
            }
            console.log('commenst register')

            // console.log(testValid('string'))


            // Make sure user is doesnt exist
            // password hash
            // create an auth
            const user = await User.findOne({ username })

            //TEST
            // console.log(userValidation('user1 '))
            // console.log(objectFuncOne('userObject 1 '))
            //TEST

            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}
