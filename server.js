const express = require('express');
const mongoose = require('mongoose');
const User = require('./modules/usersSchema')
const app = express();
const auth = require('./modules/authController')
const rooms = require('./modules/rooms')
require('dotenv').config()
let port=process.env.PORT || 3000
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => { console.log('connected') })

app.use(express.json())


// create a new user
app.route('/reg').post(auth.protect, auth.createUser);
// login a user
app.route('/login').post(auth.login);
// logout a user
app.route('/logout').delete(auth.checkUserToken, auth.logout)
// get all availabe rooms
app.route('/rooms/list').get(auth.checkUserToken, rooms.getRooms);
// book a room
app.route('/rooms/book/:id').put(auth.checkUserToken, rooms.bookRoom);
// add a room by admin
app.route('/adminroute/addroom').post(auth.checkUserPermission, rooms.addRoom);
// create admin user
app.route(`/${process.env.SECRET_ROUTE}`).post(auth.createUser);
// this route to clear all rooms 
// app.route('/clear').get(rooms.clear)

app.listen(port, (err) => {
    console.log(err ? err : `hello from ${port}`);
})