import {z} from 'zod'

const usernameValidation = z
.string()
.min(2,'Username must be more than 2 characters')
.max(20,'Username must be less than 20 characters')
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');


const emailValidation = z
.string()
.email({ message: "Invalid email address" });

const passwordValidation = z
.string()
.min(6,'Pasword must be at least 6 characters');

const signUpSchema = z.object({
  username:usernameValidation,
  email:emailValidation,
  password:passwordValidation
}) 
export default signUpSchema;