//IMPORTS
const Discord = require("discord.js"),
    client = new Discord.Client({
        partials: ["MESSAGE", "REACTION"],
        fetchAllMembers: true
    }),
    config = require("./config.json"),
    fs = require("fs")
    cooldown = new Set()

//client.login(config.token)
client.login(process.env.TOKEN)
client.commands = new Discord.Collection()
fs.readdir("./commands", (err, files) =>{
    if (err) throw err
    files.forEach(file =>{
        if(!file.endsWith(".js")) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})


//INIT BOT
client.on("ready", () => {
    const statuses = [
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Membres, THX 💖`,
        () => 'twitch.tv/nitrousbgc',
        () => 'twitter.com/NitrousBGC',
        () => 'instagram.com/nitrousbgc',
        () => 'discord.gg/nitrouscommunity'
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'WATCHING', url: 'https://www.twitch.tv/nitrousbgc'})  
        i = ++i % statuses.length 
    }, 1e4)
})

//PLAYER UPDATE
client.on("guildMemberUpdate", (oldMember, newMember) => {
    if(oldMember.user.bot || !oldMember.guild) return
    //LOGS CHANGE NAME
    if(oldMember.displayName === newMember.displayName) return
    if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
        oldMember.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
        .setColor(config.greeting.colorYellow)
        .setAuthor(` ✔️ ${oldMember.user.tag}`, oldMember.user.displayAvatarURL())
        .setDescription(`► **${oldMember.user} vient de changer son pseudo.**`)
        .addField(`Ancien pseudo`, `${oldMember.displayName}`, true)
        .addField(`Nouveau pseudo`, `${newMember}`, true)
        .setFooter(`ID Utilisateur: ${newMember.id}`, config.greeting.serverIcon)
        .setTimestamp())
    }
})

//MSGs
client.on("message", async message => {
    if(message.type !== 'DEFAULT' || message.author.bot) return
    //LOGS
    if(config.serverState.msgLogsState.statue.toLowerCase() === "on".toLowerCase()) {
        message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
        .setColor(config.greeting.colorGreen)
        .setAuthor(message.channel.name, message.author.displayAvatarURL())
        .setDescription(` 🗨️ ${message.author}: ${message.content}`)
        .setFooter(`ID Utilisateur: ${message.author.id}`, config.greeting.serverIcon)
        .setTimestamp())
    }
    if(!message.member.hasPermission("MANAGE_MESSAGES")) {
        const id = message.author.id
        if(cooldown.has(id)){
            message.delete()
            return message.member.send(`Vous devez attendre **3 secondes** avant de publier un nouveau message !\n\n__**Attention**__ ! Vous pouvez être kick pour Spam.`).then(sent => sent.delete({timeout : 5e3}))
        }
        cooldown.add(id)
        setTimeout(() => cooldown.delete(id), 3e3)
    }
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if(!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if(!command) return
    if(command.guildOnly && !message.guild) return
    command.run(message, args, client)
})

//MESSAGE SUPPRIMÉ
client.on("messageDelete", async deletedMsg => {
    if(!deletedMsg.guild) return
    let logs = await deletedMsg.guild.fetchAuditLogs({type: 72})
    let entry = logs.entries.first()
    var embDel = new Discord.MessageEmbed
    //LOGS
    if(config.serverState.msgLogsState.statue.toLowerCase() === "on".toLowerCase()) {
        embDel.setColor(config.greeting.colorRed)
        embDel.addField(`Message envoyé`, `${deletedMsg.author}: ${deletedMsg.content}`, false)
        embDel.addField(`Supprimé par`, entry.executor, true)
        embDel.addField(`Channel`, `${deletedMsg.channel}`, true)
        embDel.setAuthor(` ❌ [MSG] ${deletedMsg.author.tag}`, deletedMsg.author.displayAvatarURL())
        embDel.setFooter(`ID Utilisateur: ${deletedMsg.author.id}`, config.greeting.serverIcon)
        embDel.setTimestamp()
        deletedMsg.guild.channels.cache.get(config.logsChannelID).send(embDel)
    }
})

//MESSAGE EDITÉ
client.on("messageUpdate", async (oldMsg, newMsg) => {
    if(oldMsg.author.bot) return
    if(!oldMsg.guild) return
    let logs = await oldMsg.guild.fetchAuditLogs({type: 72})
    let entry = logs.entries.first()
    //LOGS
    if(config.serverState.msgLogsState.statue.toLowerCase() === "on".toLowerCase()) {
        oldMsg.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
        .setColor(config.greeting.colorYellow)
        .setAuthor(` ✏️ [MSG] ${oldMsg.author.tag}`, oldMsg.author.displayAvatarURL())
        .addField(`Message envoyé`, `${oldMsg.author}: ${oldMsg.content}`, false)
        .addField(`Édité par`, `${entry.executor}: ${newMsg.content}`, true)
        .addField(`Channel`, `${oldMsg.channel}`, true)
        .setFooter(`ID Utilisateur: ${oldMsg.author.id}`, config.greeting.serverIcon)
        .setTimestamp())
    }
})

//AJOUT REACTION
client.on("messageReactionAdd", (reaction, user) =>{
    if(!reaction.message.guild || user.bot) { return; }
    const reactionRoleElem = config.reactionRole[reaction.message.id];
    if(!reactionRoleElem) { return; }
    const prop = reaction.emoji.id ? 'id' : 'name';
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop]);
    var embedRole = new Discord.MessageEmbed;
    var roleName = "";
    if(emoji.roles === "778682700533727233") {roleName = "Twitch";}
    else if(emoji.roles === "778682703116894238") {roleName = "YouTube";}
    else if(emoji.roles === "778682708145602560") {roleName = "Nouveautés";}
    else if(emoji.roles === "778682705436344342") {roleName = "Giveaways";}
    else if(emoji.roles === "778682710255599649") {roleName = "Animations";}
    if(emoji) {
        reaction.message.guild.member(user).roles.add(emoji.roles)
        embedRole.setTitle(config.greeting.serverName);
        embedRole.setColor(config.greeting.mainColor);
        embedRole.setThumbnail(config.greeting.serverIcon);
        embedRole.setDescription(`Le rôle ${roleName} vous a été attribué !\nVous pouvez en sélectionner d'avantage.`);
        embedRole.setFooter(config.greeting.serverName, config.greeting.serverIcon);
        user.send(embedRole);
    } else {
        reaction.users.remove(user);
    }
})

//DELETE REACTION
client.on("messageReactionRemove", (reaction, user) =>{
    if(!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if(!reactionRoleElem || !reactionRoleElem.removable) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    var embedRole = new Discord.MessageEmbed
    var roleName = ""
    if(emoji.roles === "778682700533727233") roleName = "Twitch"
    else if(emoji.roles === "778682703116894238") roleName = "YouTube"
    else if(emoji.roles === "778682708145602560") roleName = "Nouveautés"
    else if(emoji.roles === "778682705436344342") roleName = "Giveaways"
    else if(emoji.roles === "778682710255599649") roleName = "Animations"
    if(emoji)reaction.message.guild.member(user).roles.remove(emoji.roles)
    embedRole.setTitle(config.greeting.serverName)
    embedRole.setThumbnail(config.greeting.serverIcon)
    embedRole.setColor(config.greeting.mainColor)
    embedRole.setDescription(`Le rôle ${roleName} vous a été retiré !\nVous pouvez vous en retirer d'avantage.`)
    embedRole.setFooter(config.greeting.serverName, config.greeting.serverIcon)
    user.send(embedRole)
})

//CHANNEL CRÉÉ
client.on('channelCreate', channel => {
    if(!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Mute')
    if(!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})

//MEMBRE REJOINS
client.on("guildMemberAdd", member =>{
    const channelCountID = '831577623238148186'
    const updateChannel = (guild) => {
        const channel = guild.channels.cache.get(channelCountID)
        channel.setName(`🌟 • ${guild.memberCount.toLocaleString()} MEMBRES • 🌟`)
    }
    updateChannel(member.guild)
        var embedMessage = new Discord.MessageEmbed
        embedMessage.setColor(config.greeting.mainColor)
        embedMessage.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        embedMessage.setTitle("🎉 UN NOUVEL ARRIVANT ! 🎉")
        embedMessage.setURL(member.user.displayAvatarURL({ dynamic: true }))
        embedMessage.setDescription(`► Bienvenue sur ${member.guild.name} <@!${member.id}> !\n\nN'hésite pas a check le <#${config.greeting.channelRules}> et a suivre\nNitrous sur Twitch: https://twitch.tv/nitrousbgc`)
        embedMessage.setTimestamp()
        embedMessage.setFooter(`${member.guild.name}`, config.greeting.serverIcon)
        member.guild.channels.cache.get(config.greeting.channelWelcome).send(embedMessage)
        member.roles.add(config.greeting.roleBase)
})

//MEMBRE QUITTE
client.on('guildMemberRemove', member =>{
    const channelCountID = '831577623238148186'
    const updateChannel = (guild) => {
        const channel = guild.channels.cache.get(channelCountID)
        channel.setName(`🌟 • ${guild.memberCount.toLocaleString()} MEMBRES • 🌟`)
    }
    updateChannel(member.guild)
    //LOGS
    if(config.serverState.joinState.statue.toLowerCase() === "on".toLowerCase()) {
        member.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
        .setColor(config.greeting.mainColor)
        .setAuthor(` 🚪 [LEAVE] ${member.user.tag}`, member.user.displayAvatarURL())
        .setDescription(`${member} vient de quitter le serveur.`)
        .addField(`Rejoint le`, member.joinedAt.getDay() + "/" + member.joinedAt.getMonth() + "/" + member.joinedAt.getFullYear() + " à " + member.joinedAt.getHours() + "h" + member.joinedAt.getMinutes(), true)
        .addField(`Nombre d'utilisateurs`, member.guild.memberCount + " Membres", true)
        .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
        .setTimestamp())
    }
})