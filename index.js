const { WebUntisQR } = require('webuntis');
const axios = require('axios').default;

// The result of the scanned QR Code
const QRCodeData = 'untis://setschool?url=[...]&school=[...]&user=[...]&key=[...]&schoolNumber=[...]';

// Discord Webhook URL
const webhookURL = 'https://discord.com/api/webhooks/...';

const untis = new WebUntisQR(QRCodeData);

const cached = [];

function getUntis() {
    untis
    .login()
    .then(() => {
        return untis.getOwnTimetableForToday();
    })
    .then((timetable) => {
        for (const l of timetable) {
            if (l.substText) {
                if (cached.includes(l.id)) return;
                cached.push(l.id);
                axios.post(webhookURL, {
                    "embeds": [{
                        "title": l.su[0].name,
                        "fields": [{
                            "name": "Raum",
                            "value": l.ro[0].name,
                        }, {
                            "name": "Zeit",
                            "value": l.startTime.toString().slice(0, -2) + ':' + l.startTime.toString().slice(-2) + " - " + l.endTime.toString().slice(0, -2) + ':' + l.endTime.toString().slice(-2),
                        }, {
                            "name": "Bemerkung",
                            "value": l.substText,
                        }]
                    }]
                })
            }
        }
    });
}

setInterval(getUntis, 60000);