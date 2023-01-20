const Rooms = require('./roomsSchema')

module.exports.getRooms = async (req, res) => {

    let curDate = new Date(Date.now());

    let rooms = await Rooms.find({ expBookDate: { $lt: curDate } })

    if (rooms.length == 0) {
        res.status(300).json({
            status: 'fail',
            msg: 'there isn\'t any available room right now'
        })
    }
    else {
        res.status(200).json({
            status: 'ok',
            rooms: rooms
        })
    }
}

function toDate(dateStr) {
    let parts = dateStr.split("-")
    return new Date(parts[2], parts[1] - 1, parts[0])
}


module.exports.addRoom = async (req, res) => {
    let roomInfo = req.body;
    let check = await Rooms.findOne({ roomNum: roomInfo.roomNum })
    if (check) {
        res.status(400).json({
            status: 'fail',
            msg: 'this room is already added'
        })
    }
    else {
        let bookDate = toDate(roomInfo.expBookDate);

        roomInfo.expBookDate = bookDate;

        let room = new Rooms(roomInfo);
        room.save().then(ss => {
            res.status(200).json({
                status: 'ok',
                roomInfo
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({
                status: 'fail',
                msg: 'an error occurs please try again later'
            })
        })
    }
}


module.exports.bookRoom = async (req, res) => {

    let id = req.params.id;

    let bookDate = toDate(req.body.bookDate);

    Rooms.updateOne({ roomNum: id }, {
        expBookDate: bookDate
    }).then(ok => {
        res.status(200).json({
            status: 'ok',
            msg: 'booked'
        })
    }).catch(err => {
        res.status(400).json({
            status: 'fail',
            msg: 'an error occurs please try again later'
        })
    });
}

module.exports.clear = async (req, res) => {
    Rooms.deleteMany({}).then(rr => res.send('cleared'));
}