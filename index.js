/*
  Webhook of Dialogflow
  @author: NottDev
  date: 31/05/2019
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 4000;

// Import the appropriate class
const {
  WebhookClient
} = require('dialogflow-fulfillment');

app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({
    success: true
  });
})

app.post('/webhook', (req, res) => {
  console.log('POST: /');
  console.log('Body: ',req.body);

  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  let farm = "null";
  let pond  = "null";
  let wgh = "null";
  let total = "null";

  //Test get value of WebhookClient
  console.log('agentVersion: ' + agent.agentVersion);
  console.log('intent: ' + agent.intent);
  console.log('locale: ' + agent.locale);
  console.log('query: ', agent.query);
  console.log('session: ', agent.session);

  //Function Location
  function farmName(agent){
    farm = agent.contexts[0].parameters['name'];
    agent.add("ฟาร์มชื่อ : " + farm) ;
    agent.add("โปรดระบุหมายเลขของบ่อ");
  }
    
    
  function pondNumber(agent){
    pond  = agent.contexts[0].parameters['pool'];
    agent.add("บ่อหมายเลข : " + pond ) ;
    agent.add("โปรดระบุปริมาณอาหารคงเหลือ");
  }
  
  function wghNumber(agent){
    wgh = agent.contexts[0].parameters['number.original'];
    total = farm + " บ่อหมายเลข " + pond  + ` \nปริมาณอาหารคงเหลือ ` + wgh + " กิโลกรัม.";
    agent.add(total);
    //agent.add("ต้องการแก้ไขหรือไม่?");
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Location', location);  // "Location" is once Intent Name of Dialogflow Agent
  intentMap.set('Amount_Food_Farm_Name', farmName);
  intentMap.set('Amount_Food_Pond_Number', pondNumber);
  intentMap.set('Amount_Food_WGH', wghNumber);
  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});