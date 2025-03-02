// Importamos las librerías necesarias
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Creamos el cliente de Discord con los permisos necesarios
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Para interactuar con los servidores
        GatewayIntentBits.GuildVoiceStates, // Para gestionar los canales de voz
        GatewayIntentBits.GuildMessages, // Para leer los mensajes
        GatewayIntentBits.MessageContent // Para acceder al contenido de los mensajes
    ]
});

// Creamos la instancia de DisTube para la reproducción de música
const distube = new DisTube(client, { emitNewSongOnly: true });

// Escuchamos los mensajes
client.on("messageCreate", async message => {
    // Si el mensaje no es un comando, lo ignoramos
    if (!message.content.startsWith("!")) return;

    const args = message.content.slice(1).split(" "); // Extraemos el comando y sus argumentos
    const command = args.shift().toLowerCase(); // El primer argumento será el comando

    // Comando para reproducir música
    if (command === "play") {
        if (!message.member.voice.channel) {
            return message.reply("¡Debes estar en un canal de voz!"); // Mensaje si no estás en un canal de voz
        }
        
        try {
            // Intentamos reproducir música
            await distube.play(message.member.voice.channel, args.join(" "), {
                textChannel: message.channel,
                member: message.member
            });
            console.log("Reproduciendo música...");
        } catch (err) {
            console.error("Error al intentar reproducir música:", err); // Aquí mostramos más detalles del error
            message.reply(`Hubo un error al intentar reproducir la música. Detalles: ${err.message}`);
        }
    }
    // Comando para saltar la canción
    else if (command === "skip") {
        distube.skip(message);
    }
    // Comando para detener la música
    else if (command === "stop") {
        distube.stop(message);
    }
});

// Iniciamos sesión con el token de tu bot (desde el archivo .env)
client.login(process.env.DISCORD_TOKEN);
