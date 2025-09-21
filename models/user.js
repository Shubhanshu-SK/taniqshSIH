const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://luffy:onepiece@cluster0.5bwmmth.mongodb.net/taniqshSIH?retryWrites=true&w=majority")
// mongoose.connect("mongodb://localhost:27017/taniqshSIH")

// Define schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    country: String,
    password: { type: String, required: true },
    
});

// Export model
module.exports = mongoose.model("User", userSchema);