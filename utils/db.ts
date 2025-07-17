import mongoose from "mongoose"

const MONGODB_URO=process.env.MONGODB_URI!

if(!MONGODB_URO){
    throw new Error("Please define mongo db uri in the env variables")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose={conn:null,promise:null}
}


export async function connectTODatabase(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        const opts={
            bufferCommands : true,
            maxPoolSize:10
        }
       await mongoose.connect(MONGODB_URO,opts).then(()=>mongoose.connection)
    }
    
    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise=null
        throw error
    }

    return cached.conn
}