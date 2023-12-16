import express from 'express'
import dotenv from 'dotenv'
import { connect } from 'nats'

const app = express();

dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Backend server 1 ")
})

app.get("/send", (req, res) => {

    const natsOptions = {
        servers: ['nats://localhost:4222']
    }

    let natsConnection;

    const publishEvent = async (subject, data) => {
        if (!natsConnection) {
            natsConnection = await connect(natsOptions);
            console.log("Connected to nats server")
        }
        try {
            natsConnection.publish(subject, data);
            console.log("Event publish successfully");
            await natsConnection.flush();
        } catch (error) {
            console.log("Error Publish event: ", error)
        }
    }

    async function callPublishEvent() {
        const EmployeeData = {
            Name: "Amaan",
            Surname : "chaudhary"
        }
        await publishEvent('Message', JSON.stringify(EmployeeData))
    }

    callPublishEvent();

    return res.status(200).json({success : true , message : "Message Delivered to Server-2, Check Console"})

})



app.listen(7000, () => console.log("App is running on port 7000"))

