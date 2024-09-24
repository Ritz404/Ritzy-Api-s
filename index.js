var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const cheerio = require("cheerio");
const CFonts  = require('cfonts');
const { tiktok } = require('betabotz-tools') 
const { spotifydl } = require('betabotz-tools') 
const { pinterest } = require('betabotz-tools') 
const { instagram } = require('betabotz-tools') 
const { aio } = require('betabotz-tools') 
const { remini } = require('betabotz-tools') 
const path = require('path');
const os = require('os');
const fs = require('fs');
const ptz = require('./function/index') 
const axios = require('axios')

creator = "Ritzy"

var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000;

app.get('/stats', (req, res) => {
  const stats = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    cpuModel: os.cpus()[0].model,
    numCores: os.cpus().length,
    loadAverage: os.loadavg(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    processId: process.pid,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage()
  };
  res.json(stats);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});
 app.get('/api/pins', async(req, res) => {
  let querry = req.query.querry
  if (!querry) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter teks"})  
  let result = await ptz.pins(querry)
  res.json({ 
    status: 200,
    creator: "Ritzy",
        data: result,
     })
})
 app.get('/api/pinterest', async(req, res) => {
  let url = req.query.url
  if (!url) return res.json({ status : false, creator : `${creator}`, message : "[!] masukan parameter url"})  
  const results = await pinterest(url)
  try {
  res.json({
   status: true,
   creator:"Ritzy",
         data: results,
     })
 } catch(err) {
     console.log(err)
     res.json({error: "error"})
    }
 })

//igstory
app.get('/api/soundcloud', async(req, res) => {
  let url = req.query.url
  if (!url) return res.json({err: 'Masukan url'})
  let result = await ptz.soundcloud(url)
  try {
  res.json({
    status: 200,
    creator: "Ritzy",
    data: { result }
     })
 } catch(err) {
     console.log(err)
     res.json(loghandler.error)
    }
 })
 //Wikipedia
 app.get('/api/Wikipedia', async(req, res) => {
  let q = req.query.q
  if (!q) return res.json({err:'Masuukan Teks'})
  let result = await ptz.Wikipedia(q)
  try {
  res.json({
    status: 200,
    creator: "Ritzy",
    data: { result }
     })
 } catch(err) {
     console.log(err)
     res.json(loghandler.error)
    }
 })


app.get('/api/ragbot', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.ragBot(message);
    res.status(200).json({
      status: 200,
      creator: "Ritzy",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk degreeGuru
app.get('/api/degreeguru', async (req, res) => {
  try {
    const { message }= req.query;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.degreeGuru(message);
    res.status(200).json({
      status: 200,
      creator: "Ritzy",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk smartContract
app.get('/api/smartcontract', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.smartContract(message);
    res.status(200).json({
      status: 200,
      creator: "Ritzy",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk blackboxAIChat
app.get('/api/blackboxAIChat', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.blackboxAIChat(message);
    res.status(200).json({
      status: 200,
      creator: "Ritzy",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/gpt", async (req, res) => {
const text = req.query.text;

if (!text) {
return res.status(400).send("Parameter 'text' is required.");
}

try {
const requestData = {
operation: "chatExecute",
params: {
text: text,
languageId: "6094f9b4addddd000c04c94b",
toneId: "60572a649bdd4272b8fe358c",
voiceId: ""
}
};

const config = {
headers: {
Accept: "application/json, text/plain, */*",
Authentication: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTZjMjFhMGE1NTNiNjE1MDhmNWIxOSIsImlhdCI6MTcxMjc2NzUxNH0.qseE0iNl-4bZrpQoB-zxVsc-pz13l3JOKkg4u6Y08OY",
"Content-Type": "application/json"
}
};
let {data} = await axios.post("https://api.rytr.me/", requestData, config)
data.data.content = data.data.content.replace(/<\/?p[^>]*>/g, '');
res.json(data);
} catch (error) {
console.error(error);
res.status(500).send("Internal Server Error");
}
});


app.use((req, res, next) => {
  res.status(404).send("Halaman tidak ditemukan");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ada kesalahan pada server');
});

CFonts.say('Rell API', {
  font: 'block',
  align: 'center',
  gradient: ['red', 'magenta']
})

CFonts.say(`Recode By Ritzy`, {
  font: 'console',
  align: 'center',
  gradient: ['blue', 'yellow']
})

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
