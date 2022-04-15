const express = require('express')
const app = express()
const path = require('path');
var cors = require('cors')
app.use(cors({ origin: true, credentials: true }));
//notification
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('secret'));

app.use(session({
  secret: 'something',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));
app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

//body-parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

//set public
app.use(express.static(path.join(__dirname, 'public/')));

//database
const db = require('./config/db')
db.connect()

//xac dinh tuyen duong
const route = require('./routes');
route(app);

const serverApp = app.listen(process.env.PORT || 8002)

const io = require("socket.io")(serverApp, {
  cors: {
    origin: "http://localhost:8080"
  }
});


let onlineUsers = [];

const removeUser = (userName) => {
  onlineUsers = onlineUsers.filter((user) => {
    return user.userName !== userName
  })
}
const addNewUser = (userName, position, socketId) => {
  let userExist = onlineUsers.find((user) => user.userName === userName)
  if (userExist) {
    removeUser(userName)
  }
  onlineUsers.push({ userName, position, socketId })
}

io.on("connection", (socket) => {
  console.log("co nguoi ket noi")
  socket.on("newUser", ({ userName, position }) => {
    console.log("them user")
    addNewUser(userName, position, socket.id)
    // console.log(onlineUsers)
  })

  socket.on("sendNotificationAddOrder", ({ senderName, table }) => {
    onlineUsers.forEach((user) => {
      if (user.position === 2)
        io.to(user.socketId).emit("getNotificationAddOrder", senderName + " đã lập hóa đơn cho " + table)
    })
  })

  socket.on("sendNotificationUpdate", ({ senderName, table, act }) => {
    onlineUsers.forEach((user) => {
      if (act === 1 && (user.position === 1 || user.position === 2)) {
        io.to(user.socketId).emit("getNotificationUpdate", { message: senderName + " đã xác nhận hóa đơn " + table, type: "success" })
      }
      else if (act === 2 && (user.position === 1 || user.position === 2)) {
        io.to(user.socketId).emit("getNotificationUpdate", { message: senderName + " đã huỷ hóa đơn " + table, type: "danger" })
      }
    })

  })

  socket.on("sendNotificationWaiterUpdate", ({ senderName, table, act }) => {
    onlineUsers.forEach((user) => {
      if (act === 1 && (user.position === 1 || user.position === 2)) {
        io.to(user.socketId).emit("getNotificationWaiterUpdate", { message: senderName + " đã cập nhật hóa đơn " + table, type: "normal" })
      }
      else if (act === 2 && (user.position === 1 || user.position === 2)) {
        io.to(user.socketId).emit("getNotificationWaiterUpdate", { message: senderName + " đã huỷ hóa đơn " + table, type: "danger" })
      }
    })
  })

  socket.on("sendNotificationChefNote", ({ senderName, table }) => {
    onlineUsers.forEach((user) => {
      if (user.position === 1)
        io.to(user.socketId).emit("getNotificationChefNote", "Thông báo mới từ " + senderName + " về " + table)
    })
  })

  socket.on("sendNotificationChefCompleteOrder", ({ senderName, table }) => {
    onlineUsers.forEach((user) => {
      if (user.position === 1 || user.position === 2)
        io.to(user.socketId).emit("getNotificationChefCompleteOrder", senderName + " đã hoàn thành món " + table)
    })
  })

  socket.on("sendNotificationWaiterCompleteOrder", ({ senderName, table }) => {
    onlineUsers.forEach((user) => {
      if (user.position === 1 || user.position === 2)
        io.to(user.socketId).emit("getNotificationWaiterCompleteOrder", senderName + " đã hoàn thành món " + table)
    })
  })

  socket.on("sendNotificationWaiterCompletePayOrder", ({ senderName, table }) => {
    onlineUsers.forEach((user) => {
      if (user.position === 1 || user.position === 2)
        io.to(user.socketId).emit("getNotificationWaiterCompletePayOrder", senderName + " đã hoàn thành hóa đơn " + table)
    })
  })

  socket.on("sendNotificationBookShip", () => {
    onlineUsers.forEach((user) => {
      if (user.position === 1)
        io.to(user.socketId).emit("getNotificationBookShip", "Có khách hàng đặt lịch")
    })
  })

  socket.on("sendNotificationShipperConfirmBookShip", ({ senderName }) => {
    onlineUsers.forEach((user) => {
      if (user.position === 2)
        io.to(user.socketId).emit("getNotificationShipperConfirmBookShip", senderName + " đã xác nhận đơn ship mới")
    })
  })

  socket.on("removeUserOnline", ({ userName }) => {
    console.log("co nguoi ngat ket noi")
    removeUser(userName)
  })

  socket.on("forceDisconnect", () => {
    console.log("co nguoi ngat ket noi")
    socket.disconnect()
  })

});




