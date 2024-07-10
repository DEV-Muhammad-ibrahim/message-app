import mongoose from "mongoose"

interface connectionObject{
  isConnected?:number
}
const connection : connectionObject ={}

export default async function dbConnect() : Promise<void>{
  if(connection.isConnected){
    console.log("Already connected to database")
    return
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URI || '',{})
     connection.isConnected  =   db.connections[1].readyState 
  } catch (error) {
    console.log("Something went wrong")
    process.exit(1)
  }
}