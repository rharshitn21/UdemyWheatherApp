import express from 'express';
import path from 'path';
import https from 'https';
const __dirname = path.resolve();
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res)=>{

    const query = req.body.city;
    const apiKey = "e57aa64124b40c464f684bdc30c71071";

    const tempUnit = req.body.temp_unit;

    var unit, degree;
    if(tempUnit == '0'){
        unit = "Default";
        degree = "Kelvin";
    }
    else if (tempUnit == '1'){
        unit = "metric";
        degree = "Celcius";
    }
    else{
        unit = "Imperial";
        degree = "Fahrenheit";
    }

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
    https.get(url, (response)=>{
        response.on("data", (data)=>{
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const iconUrl = "https://openweathermap.org/img/wn/" + icon +"@2x.png"
            console.log(iconUrl);
            console.log(weatherData.main.temp);
            console.log(weatherData.weather[0].description);
            res.write( "<h1>Temperature in "+query+" is "+temp+" " + degree + " </h1>" + "<br><h2>"+weatherData.weather[0].description+"</h2>");
            res.write("<img src=" + iconUrl + " >");
            res.send();
        });
    });
    //res.send("Server is up and running ");

});

app.listen(3000, ()=>{
    console.log("Server is listening at port 3000");
});
