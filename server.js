const http = require('http');
const fs = require('fs');
const uuid = require('uuid4');

const promiseReadFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
};

const server = http.createServer((req, res) => {
    let urlInParts = req.url.split('/');

    switch (urlInParts[1]) {
        case 'html':
            promiseReadFile('public/index.html')
                .then((data) => {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    })
                    res.write(data);
                    res.end();
                })
                .catch((err) => {
                    res.writeHead(500);
                    res.end();
                    console.error('Error while reading the index.html file ' + err);
                });
            break;

        case 'json':
            promiseReadFile('data/data.json')
                .then((data) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.write(data);
                    res.end();
                })
                .catch((err) => {
                    res.writeHead(500);
                    res.end();
                    console.error('Error while reading the data.json file ' + err);
                });
            break;

        case 'uuid':
            let idObj = null;
            try {
                let id = uuid();
                idObj = {
                    'uuid': id
                }
            }
            catch (err) {
                res.writeHead(500);
                res.end();
                console.error('Error while generating uuid key ' + err);
                break;
            }
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(idObj, null, 4));
            res.end();
            break;

        case 'status':
            try {
                let flag = 0;
                for (code in http.STATUS_CODES) {
                    if (code === urlInParts[2]) {
                        res.writeHead(code);
                        res.write(http.STATUS_CODES[code]);
                        res.end();
                        flag = 1;
                        break;
                    }
                }
                if (flag === 0) {
                    res.writeHead(404);
                    res.end();
                }
            }
            break;

        case 'delay':
            setTimeout(() => {
                res.writeHead(200);
                res.write(`Page delayed by ${urlInParts[2]} Seconds`);
                res.end();
            }, urlInParts[2] * 1000);
            break;

        default:
            res.writeHead(404);
            res.end();
    }
});

server.listen(8000);