const mongoose=require("mongoose")
const Listing=require("../models/listing.js")
const initData=require("./data.js")

// const MONGO_URI = 'mongodb://127.0.0.1:27017/airbnb';
const MONGO_URI = 'mongodb+srv://ayushjoshi45:WmxSg3Gr3tnefyry@cluster0.f6ohe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

main()
    .then(() => {
        console.log("Database sucessfully connected");
    }).catch((err) => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URI);
};

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>{
        return {...obj,owner:"6794afb157ca3bacf097431f"}
    })
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();