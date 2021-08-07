function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}


const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

const Discord = require("discord.js")
const ms = require("ms")
const Canvas = require("canvas")
let emojis = ['✅' , '❌']
exports.run = async (bot,message,args) => {
  let member = bot.parse(message) || message.member
  let getMem = await bot.utils.Level.getUser(member)
	let rank = await bot.utils.Level.getLvl(member);
  let percomp = (getMem.xp-(bot.config.level_up*getMem.level))/(getMem.next-(bot.config.level_up*getMem.level))
  const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = canvas.width*canvas.height;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = applyText(canvas, member.displayName);
ctx.fillStyle = '#fefefe';
ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 2);
ctx.font = '30px bold'
ctx.fillText(`Rank #${rank}`, canvas.width / 1.45, canvas.height / 2);
ctx.font = applyText(canvas, `_______________`);
ctx.fillText(`_______________`, canvas.width / 2.5, canvas.height / 1.8);
ctx.font = `30px bold`
ctx.fillText(`Level ${getMem.level}`, canvas.width / 2.5, canvas.height / 1.35);
ctx.font = `20px bold`
ctx.fillText(`${getMem.xp-(bot.config.level_up*getMem.level)}/${getMem.next-(bot.config.level_up*getMem.level)}`, canvas.width / 1.35, canvas.height / 1.35);
let hex = member.roles.highest.hexColor;
ctx.strokeStyle = hex;
ctx.lineWidth = 5;
roundRect(ctx, canvas.width / 2.45, canvas.height / 1.25, 325, 20, 3, 1)
ctx.strokeStyle = '#222222';
ctx.lineWidth = 10;
ctx.fillStyle = hex;
ctx.fillRect(canvas.width / 2.45, canvas.height / 1.234, 325*percomp, 15);
ctx.fillStyle = '#000000';
ctx.font = `16px bold`
ctx.fillText(`${(percomp*100).toFixed(0) + "%"}`, canvas.width / 1.62, canvas.height / 1.154);
ctx.strokeStyle = '#fefefe';
ctx.lineWidth = 1;
ctx.stroke(canvas.width / 2.3, canvas.height / 1.15, 310, 12);
ctx.lineWidth = 5;
ctx.strokeStyle = '#fefefe';
ctx.strokeRect(0, 0, canvas.width, canvas.height);
ctx.beginPath();
ctx.arc(125, 125, 75, 0, Math.PI * 2, true);
ctx.lineWidth = 10;
ctx.strokeStyle = hex
ctx.stroke();
ctx.closePath();
ctx.clip();

const avatar = await Canvas.loadImage(member.user.avatarURL({ format: 'jpg', size: 4096 }));
ctx.drawImage(avatar, 40, 40, 175, 175);

const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

message.channel.send(attachment);
  }

exports.help = {
  name: "testf",
  aliases: [],
  usage: '',
  description: "--"
}
