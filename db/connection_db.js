import mongoose from "mongoose";




const Connection_db =async ()=>{
        // return await mongoose.connect("mongodb+srv://apparel_store:apparel_store@cluster0.e09gpvw.mongodb.net/apparelStore")
        return await mongoose.connect("mongodb+srv://apparel_store:apparel_store@cluster0.e09gpvw.mongodb.net/apparel_Store")
        .then(res=>console.log("ConnectionDB is Running........"))
        .catch(err=>console.log({message:"fail in ConnectionDB" , err}))
}







export default Connection_db
