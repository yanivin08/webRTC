const chatForm = document.getElementById('chat-form'); //message submitted
const chatMsgs = document.querySelector('.chat-messages'); //where all messages inserted
//const roomName = document.getElementById('room-name');
//const userList = document.getElementById('users');

//const peerConnection = new RTCPeerConnection();
const socket = io()

let room

if(window.location.href.indexOf('?') == -1){
    room = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
}else{
    room = window.location.href.substring(window.location.href.lastIndexOf('/') + 1,window.location.href.indexOf('?'));
}

const username = document.getElementById('usernames').innerHTML;

//join chatroom
socket.emit('joinRoom', {username, room});

socket.on('msg', message =>{
    outputMessage(message);
    //scroll down
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    //emit submitted message
    socket.emit('chatMsg', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');

    console.log(msg.typ);
    if(msg.typ == 'chatbot'){
        div.innerHTML = `<div class="chat-body clearfix">
            <div class="header">
                <small class="pull-right text-muted mb-3 text-center">
                    <p class="text-center">${msg.txt}</p>
                </small>
            </div>
        </div>`
    }else{
        if(msg.username == username){
            div.innerHTML = `<li class="right clearfix mt-3">
                    <span class="chat-img float-right">
                        <img src="http://placehold.it/50/FA6F57/fff&amp;text=ME" alt="User Avatar" class="rounded-circle">
                    </span>
                    <div class="chat-right ">
                        <div class="header">
                            <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>${msg.time}</small>
                            <strong class="float-right primary-font">${msg.username}</strong>
                        </div>
                        <p class="text-right">
                            ${msg.txt}
                        </p>
                    </div>
                </li>`
        }else{
            div.innerHTML = `<li class="left mt-3">
                <span class="chat-img float-left">
                    <img src="http://placehold.it/50/55C1E7/fff&amp;text=U" alt="User Avatar" class="rounded-circle">
                </span>
                <div class="chat-left ">
                    <div class="header">
                        <strong class="primary-font">${msg.username}</strong> <small class="float-right text-muted">
                            <span class="glyphicon glyphicon-time"></span>${msg.time}</small>
                    </div>
                    <p class="text-left">
                        ${msg.txt}
                    </p>
                </div>
            </li>`
        }
    }

    document.querySelector('.chat-messages').appendChild(div);
}
