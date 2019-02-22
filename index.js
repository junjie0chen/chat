const http = require("http");
const url = require("url");
const fs = require("fs");
const req = require("request");


http.createServer(function (request, response) {
    const pathName = url.parse(request.url).pathname;
    const params = url.parse(request.url, true).query;
    const is = isStatic(pathName);
    if (is) {
        try {
            var data = fs.readFileSync("./page" + pathName);
            response.writeHead(200);
            response.write(data);
            response.end();
        } catch (e) {
            response.writeHead(404);
            response.write("<html><body><h1>404 NotFound</h1></body></html>")
        }
    } else {
        if (pathName == "/chat") {
            const data = {
                "reqType":0,
                "perception":  {
                    "inputText": {
                        "text": params.text,
                    }
                },
                "userInfo": {
                    "apiKey": "5c6102431d2741948e8e04f31a3317f9",
                    "userId": "123456"
                }
            };
            const content = JSON.stringify(data);
            req({
                url:"http://openapi.tuling123.com/openapi/api/v2",
                method: "POST",
                header: {
                    "contetn-type": "application/json"
                },
                body: content,
            }, function (error, reqs, body) {
                if (!error && reqs.statusCode == 200) {
                    const obj = JSON.parse(body)
                    if (obj && obj.results && obj.results.length > 0 && obj.results[0].values) {
                        const header = {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Methods": "GET",
                            "Access-Control-Header": "x-requested, content-type"
                        };
                        response.writeHead(200, header);
                        response.write(JSON.stringify(obj.results[0].values))
                        response.end();
                    }
                }
            })
        }
    }

}).listen(12306);

function isStatic(pathname) {
    const staticFiles = [".html", ".css", ".js", ".ico", ".jpg", ".png"];
    for (let i = 0; i < staticFiles.length; i++) {
        if (pathname.indexOf(staticFiles[i]) == pathname.length - staticFiles[i].length) {
            return true;
        }
    }
    return false;
}