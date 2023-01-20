const express = require('express');
const mongoose = require('mongoose');
const User = require('./modules/usersSchema')
const app = express();
const auth = require('./modules/authController')
const rooms = require('./modules/rooms')
require('dotenv').config()

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => { console.log('connected') })

app.use(express.json())
app.use('/room', auth.checkUserToken)

// create new user
app.route('/reg').post(auth.protect, auth.createUser);
// login a user
app.route('/login').post(auth.login);
// logout a user
app.route('/logout').delete(auth.checkUserToken, auth.logout)
// get all availabe rooms
app.route('/rooms/list').get(rooms.getRooms);
// book a room
app.route('/rooms/book/:id').put(rooms.bookRoom);
// add a room by admin
app.route('/adminroute/addroom').post(auth.checkUserPermission, rooms.addRoom);
// create admin user
app.route(`/${process.env.SECRET_ROUTE}`).post(auth.checkUserPermission, auth.createUser);
// this route to clear all rooms 
// app.route('/clear').get(rooms.clear)

app.listen(3000, (err) => {
    console.log(err ? err : 'hello from 3000');
})