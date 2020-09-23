const moment = require('moment');

function formatMsg(username, txt, typ){
    return{
        username,
        txt,
        time: moment().format('h:mm a'),
        typ
    }
}

module.exports = formatMsg;