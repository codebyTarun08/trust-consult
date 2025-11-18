import mongoose from "mongoose";

let isConnected = false;
export default function databseConnection (){
    if(isConnected){
        return;
    }
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Database Connect Successfully");
        isConnected = true;
    })
    .catch((err)=>{
        console.log(err);
        console.log("Issue in Database");
        process.exit(1);
    })
}