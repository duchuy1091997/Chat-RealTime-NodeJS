const express = require("express");
const app = express();
//Respone to customer something customer able to see
app.use(express.static("public"));
//Set view use ejs library views stored in views directory 
app.set("view engine", "ejs");
app.set("views", "./views");
const server = require("http").Server(app);
const io = require("socket.io")(server);
//Server is Listening
io.on("connection", (socket) => {
    console.log("Có người connect!!!" + socket.id);

    //Check who disconnected
    socket.on("disconnect", () => {
        console.log(socket.id + " Disconneted!!!");
        
    });
});
server.listen(3000);

app.get("/", (req, res) => {
    res.render("HomePage");
})