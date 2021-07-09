const express = require('express');
const { validateInput } = require('./../utils/validations');
const { getTredingTickers, getSymbol, getHistoricData, getTickingData } = require('./../utils/stockData');

//initializing router instance
const Router = express.Router;
const stockRouter = new Router();

// exposed apis
stockRouter.get('/ticking/data', validateInput, getTredingTickers, async (req, res) => {
  try {
    const { stock, startdate, enddate, region } = req.query;
    const symbol = await getSymbol(stock, req.tickers);
    const historic_data = await getHistoricData(symbol, region);
    const ticking_data = await getTickingData(historic_data, startdate, enddate)
    res.status(200).send(ticking_data);
  } catch (e) {
    res.status(404).send("Failed")
  }
})

module.exports = stockRouter;