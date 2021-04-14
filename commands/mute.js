const Discord = require("discord.js")
const config = require("../config.json")

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`\nVous n'avez pas la permission d'effectuer cette commande.`)
        const member = message.mentions.members.first()
        if(!member) return message.reply("\nVeuillez cibler un utilisateur présent sur le serveur.\n**Exemple:** !mute @NitrousBGC Harcèlement")
        if(member.id === message.guild.ownerID) return message.reply("\nVous ne pouvez pas mute le propriétaire du serveur.")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.reply(`\nVous ne pouvez pas mute cet utilisateur.`)
        if(!member.manageable) return message.reply(`\nLe BOT ne peut pas mute ce membre.`)
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie.'
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Mute')
        if(member.roles.cache.find(role => role.name === 'Mute')) return message.reply(`\nL'utilisateur ciblé est déjà mute.`)
        if(!muteRole){
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'Mute',
                    permissions: 0
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }))
        }
        await member.roles.add(muteRole)
        var embedMute = new Discord.MessageEmbed
        embedMute.setTitle(config.greeting.serverName)
        embedMute.setColor(config.greeting.colorYellow)
        embedMute.setThumbnail("https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        embedMute.setDescription(` 🔇 Vous venez d'être mute du serveur !\n\n__**Raison:**__ ${reason}\n\nVous ne pouvez plus envoyer de messages ni rejoindre les salons vocaux.`)
        embedMute.setFooter("𝐓𝐇𝐄 𝐍𝐈𝐓𝐑𝐎𝐔𝐒 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘", "https://cdn.discordapp.com/attachments/702708620726632458/831292254135648326/PP.jpg")
        //LOGS
        if(config.serverState.logsState.statue.toLowerCase() === "on".toLowerCase()) {
            message.guild.channels.cache.get(config.logsChannelID).send(new Discord.MessageEmbed()
            .setColor(config.greeting.colorYellow)
            .setAuthor(` 🔇 [MUTE] ${member.user.tag}`, member.user.displayAvatarURL())
            .addField(`Utilisateur`, member, true)
            .addField(`Exécutant`, message.author, true)
            .addField(`Raison`, reason, false)
            .addField(`Durée`, '∞', true)
            .setFooter(`ID Utilisateur: ${member.id}`, config.greeting.serverIcon)
            .setTimestamp())
        }
        member.send(embedMute).catch(console.error)
        message.reply(`\nVous venez de mute **<@!${member.id}>**.\n__**Raison:**__ ${reason}.`)
    },
    name: 'mute',
    guildOnly: 'true'
}