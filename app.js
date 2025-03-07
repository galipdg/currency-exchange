import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;
const API_URL = "https://v6.exchangerate-api.com/v6/";

app.use(express.static("public"));

app.get("/", async (req, res) =>{
    res.render("index.ejs", {
        currency: null,
        amount: null,
        convertedAmount: null,
    });
});

app.get("/convert", async (req, res) =>{
    const amount = req.query.amount;
    const targetCurrency = req.query.targetCurrency;
    const baseCurrency = req.query.baseCurrency;
    try {
        const result = await axios.get(API_URL + API_KEY + "/latest/" + baseCurrency);
        const convertedAmount = (amount * result.data.conversion_rates[targetCurrency]).toFixed(4);
        const date = result.data.time_last_update_utc.slice(0, -6);
        res.render("index.ejs", {
            baseCurrency: baseCurrency,
            targetCurrency: targetCurrency,
            amount: amount,
            convertedAmount: convertedAmount,
            date: date,
        });
    } catch (error){
        console.log(error.message);
        res.status(500);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});