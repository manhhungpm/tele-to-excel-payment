import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import 'dotenv/config';
import moment from 'moment'

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    if (!match[1].split(',').length === 3) {
        bot.sendMessage(chatId, 'Vui lòng nhập đúng định dạng.' + '\n\n' + 'Ví dụ:\n```\n/add thu,viec,tien\n```', {
            parse_mode: 'Markdown'
        });
        return;
    }

    bot.sendChatAction(chatId, 'typing');

    const resp = match[1];
    const values = resp.split(',');

    const url = new URL(process.env.WEBHOOK_URL);

    // const params = `?nhom=${(values[0]).toUpperCase()}&ngay=${moment().format('DD/MM/YYYY')}&viec=${values[1]}&tien=${values[2]}`
    url.searchParams.append('NHÓM', (values[0]).toUpperCase());
    url.searchParams.append('NGÀY', moment().format('DD/MM/YYYY'));
    url.searchParams.append('VIỆC', values[1]);
    url.searchParams.append('SỐ TIỀN', values[2]);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                bot.sendMessage(chatId, 'Đã thêm thành công.');
            } else {
                bot.sendMessage(chatId, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(err => {
            bot.sendMessage(chatId, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });
});

console.log('Bot is running...')
