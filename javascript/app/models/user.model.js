const mongoose = require('mongoose')

const User = mongoose.model(
  'User',

  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    type: String,
    org: String,
    channel: String,
    access_id: String,
    access_list: [{ type: String }],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  })
)

module.exports = User
