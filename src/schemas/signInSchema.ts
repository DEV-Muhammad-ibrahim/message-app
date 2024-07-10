import {z} from 'zod'


const emailValidation = z
.string()


const passwordValidation = z
.string()
const SignInSchema = z.object({
  email:emailValidation,
  password:passwordValidation
})