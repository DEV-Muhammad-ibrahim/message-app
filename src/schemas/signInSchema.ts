import {z} from 'zod'


const emailValidation = z
.string().email({message:"Invalid email address"})


const passwordValidation = z
.string()
export const SignInSchema = z.object({
  email:emailValidation,
  password:passwordValidation
})