const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const re = /\b\d{16}\|\d{2}\|\d{2,4}\|\d{3}\b/g;

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const bot = new TelegramBot('6617850814:AAGfQ5fm5nsYoYZ3ZEqxyJg2tKfOocyVZ4E', { polling: true });
const app = express();

// Handle the /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to the Credit Card Number Extractor Bot! DEV by ADNAN');
});

// Handle messages to extract credit card numbers
bot.on('message', (msg) => {
    const messageText = msg.text;
    const creditCardNumbers = messageText.match(re);

    if (creditCardNumbers) {
        const cardList = creditCardNumbers.join('\n');

        // Append the credit card numbers to the file
        fs.appendFileSync('credit_cards.txt', cardList + '\n');

        bot.sendMessage(msg.chat.id, `Credit Card Numbers saved to file. dev by Adnan`);
    } else {
        bot.sendMessage(msg.chat.id, 'No credit card numbers found in the message.');
    }
});

// Handle requests to view a specific card
app.get('/view/card/:number', (req, res) => {
    const cardNumber = parseInt(req.params.number);
    if (cardNumber > 0) {
        fs.readFile('credit_cards.txt', 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading credit card file.');
                return;
            }
            const cardList = data.trim().split('\n');
            if (cardNumber <= cardList.length) {
                const cardToView = cardList[cardNumber - 1];
                res.send(`${cardToView}`);
            } else {
                res.status(404).send('Card not found.');
            }
        });
    } else {
        res.status(400).send('Invalid card number.');
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});
