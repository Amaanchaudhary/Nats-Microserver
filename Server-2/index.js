import express from 'express'
import dotenv from 'dotenv'
import { connect } from 'nats'

const app = express();

dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Backend server 2 ")
})

const natsOptions = {
    servers: ['nats://localhost:4222']
}

const handleMessageEvent = (msg) => {
    const eventdata = JSON.parse(msg.data)
    console.log(`Employee Name = ${eventdata.Name} , Employee Surname = ${eventdata.Surname} `)
};

const subscribeToMessageEvent = async () => {
    try{
        const nc = await connect(natsOptions);
        console.log('Connected to NATS server.');
        const subscription = nc.subscribe('Message' , (err , msg) => {
            try{
                handleMessageEvent(msg)
                console.log('Received "Message" event');
            }catch(error){
                console.error('Error handling "Message" event:', error)
            }
        })
    }catch(error){
        console.error('Error connecting to NATS server:', error);
    }
}

subscribeToMessageEvent().catch((err) => {   //function call along with catch 
    console.log("Error" , err.message);
})



app.listen(7001, () => console.log("App is running on port 7001"))

