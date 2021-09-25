import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},  // unique는 중복되는 것 없도록 함
    password: {type: String, required: true},
    name: {type: String, required: true},
    location: String,
});

userSchema.pre('save', async function() {
    console.log("Users password:", this.password);
    this.password = await bcrypt.hash(this.password, 5);   // this는 create 되는 user를 가리킨다.
    console.log("Hashed password:", this.password);
})

const User = mongoose.model("User", userSchema);
export default User;