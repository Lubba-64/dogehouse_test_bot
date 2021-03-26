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
        if (msg.author.username == superadmin){
            switch(words[0].toLowerCase()){
                case "switchroom":
                    msg.reply("switching...")
                    msg.delete()
                    let uuid = words[1].replace("https://","");
                    uuid = uuid.replace("dogehouse.tv/room/","");
                    console.log(uuid);
                    app.rooms.join(uuid);
                    break;
            }
        }

        if (command.toLowerCase() == "admin" && (admin.filter(word => word == msg.author.username).length > 0 || msg.author.username == superadmin)){//)){
            var adminCommand = words[1];
            switch(adminCommand.toLowerCase()){
                case "changeprefix":
                case "setprefix":
                    if (words[2] != undefined){
                        prefix = words[2];
                        msg.reply("Changed Prefix to " + prefix);
                        msg.delete();
                    }
                    else{
                        msg.reply("cannot change prefix to undefined");
                        msg.delete();
                    }
                break;
                case "add":
                    var username = words[2].replace(/@/g,"");
                    admin.push(username);
                    msg.reply("added " + username + " as an admin");
                    msg.delete();
                    console.log(username);
                    break;
                case "remove":
                    var username = words[2].replace(/@/g,"");
                    admin.splice(admin.indexOf(username));
                    msg.reply("removed " + username + " as an admin");
                    msg.delete();
                    break;

            }
        }
        else{
            switch (command.toLowerCase()){
                case "help":
                    msg.reply(`\n
                    do <command> help for more info on that command\n
                    𝖈𝖚𝖗𝖗𝖊𝖓𝖙_𝖈𝖔𝖒𝖒𝖆𝖓𝖉𝖘:\n
                    remind, \n
                    roll, \n
                    spam 
                    `
                    ,{mentionUser: false, whispered: true});
                    msg.delete();
                    break;
                case "remind":
                case "reminder":
                    var subCommand = words[1].toLowerCase();
                    if (subCommand == "help"){
                        msg.reply(
                            `\n
                            REMIND_ME:\n
                            COMMAND: remind <wait time(DDD:HH:MM)> <Message>\n
                            USE: Reminds the user of something after a certain amount of time\n
                            `
                        ,{mentionUser: false, whispered: true})
                        msg.delete();
                        return;
                    }
                    else if (subCommand.length == 5){
                        var converted = ConvertTime(words[1]);
                        if (converted == NaN){
                            msg.reply(`
                            please make sure the time is in this format: HH:MM\n
                            EX: remind 99:99 <message> will remind you of <message> 99 hours, and 99 minutes

                            `,{mentionUser: false, whispered: true});
                            msg.delete();
                            return;
                        }
                        else{
                            msg.reply("reminder recorded!",{mentionUser: false, whispered: true});
                            words = words.splice(2,words.length);
                            sendReminder("@" + msg.author.username + " " + words.join().replace(/,/g," "), converted);
                            msg.delete();
                            return;
                        }
                    }
                case "roll":
                    var subCommand = words[1].toLowerCase();
                    if (subCommand == "help"){
                        msg.reply(`
                            roll <integer 2-100000> to get a random number between one and the specified number
                            EX: roll 100 is a 1/100 chance to get the number 1
                            `,{mentionUser: false, whispered: true});
                            msg.delete();
                        return;
                    }
                    else{
                        let rollamount = parseInt(subCommand);
                        if (rollamount != NaN){
                            msg.reply(Math.round(Math.random()*subCommand));
                            msg.delete();
                        }
                        else{
                            msg.reply("thats not an integer",{mentionUser: false, whispered: true});
                            msg.delete();
                        }
                    }
                    break;
                case "spam":
                    var subCommand = words[1].toLowerCase();
                    if (subCommand == "help"){
                        msg.reply(`
                        spams the sentence attached 5 times over 10 seconds\n
                        EX: spam  :Pepega:  :Pepega:  :Pepega:  :Pepega:  :Pepega:  :Pepega:  :Pepega:
                        `)
                        msg.delete();
                    }
                    else{
                        words = words.splice(2,words.length);
                        let message = words.join().replace(/,/g," ")
                        for (let i = 0; i < 6; i++){
                            setTimeout(function(){app.bot.sendMessage(message)},2000*i);
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
