const twilio = require('twilio');
const axios = require('axios');

const accountSid = 'REPLACE-YOURS';// Twilio Account SID
const authToken = 'REPLACE-YOURS';    // Twilio Auth Token
const client = twilio(accountSid, authToken);

async function sendRequestWithRetry(config, retries = 3, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios(config);
        } catch (error) {
            if (error.code === 'ETIMEDOUT' && i < retries - 1) {
                console.log(`Retrying request... Attempt ${i + 1}`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw error;
            }
        }
    }
}

function generateMessage(student, advisor, examType, marks) {
    if (!marks || marks.length === 0) {
        throw new Error('Marks data is missing or empty');
    }

    const subjectMarks = 'Subject || Marks\n' + marks.map(mark => `${mark.subject} || ${mark.marks}`).join("\n");

    const language = student.language ? student.language.toLowerCase() : 'tamil';
    if (language === 'hindi' || language === 'bihar') {
        return `ईरोड सेंगुंदर इंजीनियरिंग कॉलेज\n(स्वायत्त)\nतुडुपति, ईरोड - 638 057\n\nडॉ. वी. वेंकटाचलम\nस्नातक ${advisor.department} विभाग में ${advisor.year} वर्ष और ${advisor.semester} सेमेस्टर में पढ़ रहे\n${student.name}, रोल नंबर: ${student.rollno}, द्वारा आयोजित आंतरिक मूल्यांकन परीक्षा में प्राप्त अंकों का विवरण नीचे दिया गया है।\n\nजिन विषयों में "AB" उल्लेख किया गया है, वे परीक्षाएं नहीं दी गई हैं। 50 अंकों से कम वाले विषयों में छात्र उत्तीर्ण नहीं हुए हैं। यदि यह स्थिति बनी रहती है, तो उन्हें आगामी सेमेस्टर परीक्षा (SEMESTER EXAM) में बैठने की अनुमति नहीं दी जाएगी।\n\nइस संबंध में या किसी अन्य जानकारी के लिए, कृपया कक्षा शिक्षक से संपर्क करें।\n\n${subjectMarks}\n\nसंपर्क करें: ${advisor.mobile}`;
    } else {
        return `ஈரோடு செங்குந்தர் பொறியியல் கல்லூரி\n(தன்னாட்சி)\nதுடுபதி, ஈரோடு-638 057\n\nமுனைவர் V.VENKATACHALAM\nஇளங்கலை ${advisor.department}யில் ${advisor.year}ம் ஆண்டு ${advisor.semester}ம் பருவத்தில் படிக்கும் ${student.name}, ROLLNO:${student.rollno} நடந்து முடிந்த உள்மதிப்பீட்டு தேர்வில்\n${examType} பெற்ற மதிப்பெண்கள் கீழே கொடுக்கப்பட்டுள்ளன. அதில் AB என்று குறிப்பிட்டுள்ள படத்தின் தேர்வை எழுதவில்லை என்றும்,\n50 மதிப்பெண்களுக்கு கீழ் உள்ள பாடங்களில் அவர் தேர்ச்சி பெறவில்லை என்பதை அறியவும்.இந்நிலை நீடிக்குமெனில் அவரை வரும் பருவத்தேர்வு\n(SEMESTER EXAM) எழுத அனுமதிக்க இயலாது. இது தொடர்பாக அல்லது ஏதும் தகவல் தேவைப்படும் எனில் வகுப்பு ஆசிரியரை தொடர்பு கொள்ளவும்\n\n${subjectMarks}\n\ncontact:${advisor.mobile}`;
    }
}

async function sendMarks(student, advisor, examType, marks) {
    try {
        const message = generateMessage(student, advisor, examType, marks);
        const to = student.whatsapp;

        // Send WhatsApp message
        await sendRequestWithRetry({
            method: 'post',
            url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            auth: {
                username: accountSid,
                password: authToken
            },
            data: new URLSearchParams({
                Body: message,
                From: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
                To: `whatsapp:${to}`
            }),
            timeout: 60000 // Increase timeout to 60 seconds
        });
        console.log('WhatsApp message sent');

        // Send SMS message
        await sendRequestWithRetry({
            method: 'post',
            url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            auth: {
                username: accountSid,
                password: authToken
            },
            data: new URLSearchParams({
                Body: message,
                From: '+15076328525', // Twilio phone number
                To: to
            }),
            timeout: 60000 // Increase timeout to 60 seconds
        });
        console.log('SMS message sent');
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

module.exports = { sendMarks };
/*
const twilio = require('twilio');
const axios = require('axios');

const accountSid = 'ACe2e6aad6a2aad3b6d416cd111036ac6d';
const authToken = '5e87a3a52e561870c5f2b6f1dd7b3136';
const client = twilio(accountSid, authToken);

async function sendRequestWithRetry(config, retries = 3, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios(config);
        } catch (error) {
            if (error.code === 'ETIMEDOUT' && i < retries - 1) {
                console.log(`Retrying request... Attempt ${i + 1}`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw error;
            }
        }
    }
}

function generateMessage(student, advisor, examType, marks) {
    if (!marks || marks.length === 0) {
        throw new Error('Marks data is missing or empty');
    }

    const subjectMarks = 'Subject || Marks\n' + marks.map(mark => `${mark.subject} || ${mark.marks}`).join("\n");

    const language = student.language ? student.language.toLowerCase() : 'tamil';
    if (language === 'hindi' || language === 'bihar') {
        return `ईरोड सेंगुंदर इंजीनियरिंग कॉलेज\n(स्वायत्त)\nतुडुपति, ईरोड - 638 057\n\nडॉ. वी. वेंकटाचलम\nस्नातक ${advisor.department} विभाग में ${advisor.year} वर्ष और ${advisor.semester} सेमेस्टर में पढ़ रहे\n${student.name}, रोल नंबर: ${student.rollno}, द्वारा आयोजित आंतरिक मूल्यांकन परीक्षा में प्राप्त अंकों का विवरण नीचे दिया गया है।\n\nजिन विषयों में "AB" उल्लेख किया गया है, वे परीक्षाएं नहीं दी गई हैं। 50 अंकों से कम वाले विषयों में छात्र उत्तीर्ण नहीं हुए हैं। यदि यह स्थिति बनी रहती है, तो उन्हें आगामी सेमेस्टर परीक्षा (SEMESTER EXAM) में बैठने की अनुमति नहीं दी जाएगी।\n\nइस संबंध में या किसी अन्य जानकारी के लिए, कृपया कक्षा शिक्षक से संपर्क करें।\n\n${subjectMarks}\n\nसंपर्क करें: ${advisor.mobile}`;
    } else {
        return `ஈரோடு செங்குந்தர் பொறியியல் கல்லூரி\n(தன்னாட்சி)\nதுடுபதி, ஈரோடு-638 057\n\nமுனைவர் V.VENKATACHALAM\nஇளங்கலை ${advisor.department}யில் ${advisor.year}ம் ஆண்டு ${advisor.semester}ம் பருவத்தில் படிக்கும் ${student.name}, ROLLNO:${student.rollno} நடந்து முடிந்த உள்மதிப்பீட்டு தேர்வில்\n${examType} பெற்ற மதிப்பெண்கள் கீழே கொடுக்கப்பட்டுள்ளன. அதில் AB என்று குறிப்பிட்டுள்ள படத்தின் தேர்வை எழுதவில்லை என்றும்,\n50 மதிப்பெண்களுக்கு கீழ் உள்ள பாடங்களில் அவர் தேர்ச்சி பெறவில்லை என்பதை அறியவும்.இந்நிலை நீடிக்குமெனில் அவரை வரும் பருவத்தேர்வு\n(SEMESTER EXAM) எழுத அனுமதிக்க இயலாது. இது தொடர்பாக அல்லது ஏதும் தகவல் தேவைப்படும் எனில் வகுப்பு ஆசிரியரை தொடர்பு கொள்ளவும்\n\n${subjectMarks}\n\ncontact:${advisor.mobile}`;
    }
}

async function sendMarks(student, advisor, examType, marks) {
    try {
        const message = generateMessage(student, advisor, examType, marks);
        const to = student.whatsapp;

        // Send WhatsApp message
        await sendRequestWithRetry({
            method: 'post',
            url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            auth: {
                username: accountSid,
                password: authToken
            },
            data: new URLSearchParams({
                Body: message,
                From: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
                To: `whatsapp:${to}`
            }),
            timeout: 60000 // Increase timeout to 60 seconds
        });
        console.log('WhatsApp message sent');

        // Send SMS message
        await sendRequestWithRetry({
            method: 'post',
            url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            auth: {
                username: accountSid,
                password: authToken
            },
            data: new URLSearchParams({
                Body: message,
                From: '+15076328525', // Twilio phone number
                To: to
            }),
            timeout: 60000 // Increase timeout to 60 seconds
        });
        console.log('SMS message sent');
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

module.exports = { sendMarks };*/