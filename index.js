const http = require('http');
const fs = require('fs');
const port =3000
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
};
const server = http.createServer(function(req, res) {
    if (req.url == "/node_modules") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Jind&appid=6d1b025b4a41ae0d009b593e87e4640d")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                //console.log(arrData);
                const realTimeData = arrData.map((val) => {
                    //console.log(val.main);
                    replaceVal(homeFile, val);
                })
                //res.write(realTimeData);
                console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                //console.log('end');
            }); 
    }
});
server.listen(port, function(error){
    if (error) {
        console.log('Something went wrong' + port)
    }
    else{
        console.log('Server is listening on port' + port)
    }
});