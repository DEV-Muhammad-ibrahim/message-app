
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { renderWhiteSpace } from "@react-email/components";


export default async function POST(req:Request){
 await dbConnect();
 try {
  const {username,email,password} = await req.json()
  const existingVerifiedUserByUsername = await UserModel.findOne({username,isVerified:true});
  if(existingVerifiedUserByUsername){
    return Response.json({
      success:false,
      message:"Username already exists"
     },{
      status:200
     })
  }
  const existingUserByEmail = await UserModel.findOne({email})
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
  
  if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json({
          success:false,
          message:"Email already exists"
         },{
          status:200
         })
      }else {
        const hashedPassword = await bcrypt.hash(password,10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
  }else{
  const hashedPassword = bcrypt.hash(password,10)
  const verifyCodeExpiryDate = new Date()
  verifyCodeExpiryDate.setHours(verifyCodeExpiryDate.getHours() + 1)
  const newUser = await new UserModel({
    username,
    email,
    password:hashedPassword,
    verifyCode,
    isAcceptingMessages:true,
    isVerified:false,
    verifyCodeExpiry:verifyCodeExpiryDate,
    messages:[]
  })
  await newUser.save()
  }

  //Send Verification Email
 const emailResponse = await sendVerificationEmail(email,username,verifyCode);
 if(!emailResponse.success){
  return Response.json({
     success:false,
      message:emailResponse.message
     },{
       status:500
      })
 }

  
  return Response.json(
    {
      success: true,
      message: 'User registered successfully. Please verify your account.',
    },
    { status: 201 }
  );
 } catch (error) {
   console.log("Error while creating user",error)
   return Response.json({
    success:false,
    message:"Error Registering User"
   },{
    status:500}
   )
 }

}