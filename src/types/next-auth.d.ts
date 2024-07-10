import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user:{
    _id?:string,
    username?:string,
    isVerified?:boolean,
    isAcceptingMessages?:boolean
    } & DefaultSession['user']
  }
  interface User {
    _id?:string,
    username?:string,
    isVerified?:boolean,
    isAcceptingMessages?:boolean
  }
}
declare module 'next-auth/jwt'{
  interface JWT {
    _id?:string,
    username?:string,
    isVerified?:boolean,
    isAcceptingMessages?:boolean
  }
}