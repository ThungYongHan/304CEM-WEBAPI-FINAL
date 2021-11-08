const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const db = "mongodb+srv://YongHanThung:sXFWaYGgYopFqb7h@cluster0.xla3j.mongodb.net/ProjectDB?retryWrites=true&w=majority";
mongoose
.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to database");
}
)
.catch(() => {
    console.log("Error Connecting to database");
}
)

// a schema matches the table in your database
const UserSchema = new mongoose.Schema({
    Email: { type: String, unique: true, required: true },
    Password: {type: String, required: true},
    });

UserSchema.methods.correctPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.Password);
}

//  encrypt password everytime its saved
UserSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
    next();
    }
  // set encryption strength
  const salt = await bcrypt.genSalt(10);
  // hash the password
  this.Password = await bcrypt.hash(this.Password, salt);
});

// it will automatically make your collect name plural
const User = mongoose.model('users', UserSchema);


module.exports = User;