let id = "the id of the room to join here";
let prefix = "@_Bot ";
let admin = []
let superadmin = "the user in control of the admin commands"
 
require('dotenv').config();
const { Client } = require('dogehouse.js');
const app = new Client();

app.connect(process.env.DOGEHOUSE_TOKEN, process.env.DOGEHOUSE_REFRESH_TOKEN).then(async () => {
    console.log('Bot connected!');
    await app.rooms.join(id)
});

app.on('newChatMessage', async msg => {
    if (msg.author !== null){
        if (msg.author.username !== null){
            if (msg.toString().indexOf(prefix) === 0){
                CheckCommands(msg);
            }
        }
    }
});

function CheckCommands(msg){
    var words = msg.toString().split(" ");
    words = words.slice(1)
    if (words.length > 0){
        var command = words[0];
        if (command.toLowerCase() == "admin" && (admin.filter(word => word == msg.author.username).length > 0 || msg.author.username == superadmin)){//)){
            var adminCommand = words[1];
            switch(adminCommand.toLowerCase()){
                case "changeprefix":
                case "setprefix":
                    if (words[2] != undefined){
                        prefix = words[2];
                        msg.reply("Changed Prefix to " + prefix);
                    }
                    else{
                        msg.reply("cannot change prefix to undefined")
                    }
                break;
                case "add":
                    var username = words[2].replace(/@/g,"");
                    admin.push(username);
                    msg.reply("added " + username + " as an admin");
                    console.log(username);
                    break;
                case "remove":
                    var username = words[2].replace(/@/g,"");
                    admin.splice(admin.indexOf(username));
                    msg.reply("removed " + username + " as an admin");

                    break;
            }
        }
        else{
            switch (command.toLowerCase()){
                case "help":
                    msg.reply(`\n
                    do <command> help for more info on that command\n
                    CURRENT_COMMANDS:\n
                    remind
                    `
                    ,{mentionUser: false, whispered: true})
                    break;
                case "remind":
                case "reminder":
                    let subCommand = words[1].toLowerCase();
                    if (subCommand == "help"){
                        msg.reply(
                            `\n
                            REMIND_ME:\n
                            COMMAND: remind <wait time(DDD:HH:MM)> <Message>\n
                            USE: Reminds the user of something after a certain amount of time\n
                            `
                        ,{mentionUser: false, whispered: true})
                        return;
                    }
                    else if (subCommand.length == 5){
                        var converted = ConvertTime(words[1])
                        if (converted == NaN){
                            msg.reply(`
                            please make sure the time is in this format: HH:MM\n
                            for example:
                            99:99 is 99 hours, and 99 minutes

                            `,{mentionUser: false, whispered: true})
                            return;
                        }
                        else{
                            msg.reply("reminder recorded!",{mentionUser: false, whispered: true});
                            words = words.splice(2,words.length);
                            sendReminder("@" + msg.author.username + " " + words.join().replace(/,/g," "), converted);
                            return;
                        }
                    }
                    break;
            }
        }
    }
function ConvertTime(time){
    // takes in 00:00
    // add that to current
    var split = time.split(":");
    hours = parseInt(split[0]);
    minutes = parseInt(split[1]);
    if (hours == NaN || minutes == NaN){
        return NaN;
    }
    return ((hours*3600000)+(minutes*60000));
}
function sendReminder(reminder, time){
    setTimeout(function(){app.bot.sendMessage(reminder)},time)
}

}
