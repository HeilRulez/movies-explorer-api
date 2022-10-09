const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Не должно быть постым'],
    minlength: [2, 'Должно быть не менее {VALUE}'],
    maxlength: [30, 'Должно быть не более {VALUE}'],
  },
  email: {
    type: String,
    required: [true, 'Не должно быть пустым'],
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Не должно быть постым'],
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
