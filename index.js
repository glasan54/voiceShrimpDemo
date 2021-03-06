/*
  Webhook of Dialogflow
  @author: NottDev
  date: 31/05/2019
*/
const server = require('express');
const app = server()
const PORT = process.env.PORT || 9999;
const bodyParser = require('body-parser');

// Import the appropriate class
const {
  WebhookClient
} = require('dialogflow-fulfillment');

class Dorry {
  constructor(farm = 'test', pond  = PORT){
    this._farm = farm;
    this._pond = pond;
  }
  get farm(){
    return this._farm;
  } 
  get pond(){
    return this._pond;
  }
  
}

const dorry = new Dorry();
let farm = dorry.farm;
let pond = dorry.pond;
let wgh = "null";
let total = "null";


app
    .use(server.static(__dirname + '/public'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false}))
    .get('/', (req, res) => res.send(`Edit 1 PORT: ${ PORT }`))
    .post('/webhook', function ( request, response ) {
      console.log('POST: /');
      console.log('Body: ',request.body);

      //Create an instance
      const agent = new WebhookClient({ request, response });

      //Test get value of WebhookClient
      console.log('agentVersion: ' + agent.agentVersion);
      console.log('intent: ' + agent.intent);
      console.log('locale: ' + agent.locale);
      console.log('query: ', agent.query);
      console.log('session: ', agent.session);

      //Function Location
     async function location(agent) {
        await agent.add('Welcome to Thailand.');
      }
     async function farmName(agent){
        //farm = agent.contexts[0].parameters['name'];
        agent.add("ฟาร์มชื่อ : " + farm) ;
        agent.add("โปรดระบุหมายเลขของบ่อ");
      }
        
        
     async function pondNumber(agent){
       // pond  = agent.contexts[0].parameters['pond'];
        agent.add("บ่อหมายเลข : " + pond ) ;
        agent.add("โปรดระบุปริมาณอาหารคงเหลือ");
      }
      
     async function wghNumber(agent){
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

  })
  .use('/postStatus', function (req, res) {
    res.json({
        result: true,
        status: 200
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
