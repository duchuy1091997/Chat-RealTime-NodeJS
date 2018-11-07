const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000);

io.on("connection", (socket) => {
    console.log("co nguoi ket noi " + socket.id);

    //User Register
    var usersArray = ["abc"];
    socket.on("client-send-username", (data) => {
        console.log(data);

        //User Regiter condition
        if(usersArray.indexOf(data) >= 0)
        {
            //Fail
            socket.emit("register-fail");
        }
        else
        {
            //Success
            usersArray.push(data);
            console.log(usersArray);
            //create user name for every socket id
            socket.UserName = data;
            socket.emit("success-register", data);
            io.sockets.emit("user-list", usersArray);
        }
    });

    //User Logout
    socket.on("logout", (data) => {
        usersArray.splice(
            usersArray.indexOf(socket.UserName), 1
        );
        socket.broadcast.emit("user-list", usersArray);
    });

    //user send message
    socket.on("user-send-message", (data) => {
        io.sockets.emit("server-send-message", {username: socket.UserName, content: data})
    });

    //user is typing
    socket.on("user-typing", () => {
        var s = socket.UserName + " is typing";
        io.sockets.emit("typing",s);
    });
    //stop typing
    socket.on("user-stop-typing", () => {
        io.sockets.emit("stop");
    });
});
app.get("/", (req, res) => {
    res.render("HomePage.ejs");
});