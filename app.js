const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
const formatMsg = require('./utils/messages')

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

const http = require('http')
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const botName = 'ChatBot';

//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.urlencoded({ extended: false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/sessions', require('./routes/sessions'));
app.use('/dashboard', require('./routes/dashboard'));

//run when customer connects
io.on('connection',socket => {
    socket.on('joinRoom',({ username, room}) =>{
        const user =  userJoin(socket.id, username, room);
        socket.join(user.room);
        //emit when user connection
        socket.emit('msg', formatMsg(botName,'You are now connected','chatbot'));
        //broadcast when user connects
        socket.broadcast.to(user.room).emit('msg',formatMsg(botName,`${user.username} has joined the chat`,'chatbot'));
        //users send room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

     //listen for chatMessage
     socket.on('chatMsg', (msg) =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('msg',formatMsg(user.username,msg),'userchat');
    })
    //runs when client disconnects
    socket.on('disconnect',() => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('msg',formatMsg(botName,`${user.username} has left the chat`,'chatbot'));
        }
        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));