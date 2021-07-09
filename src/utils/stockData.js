const axios = require("axios").default;
const stock_url_tickers = process.env.STOCK_URL_TICKER;
const stock_url_history = process.env.STOCK_URL_HISTORY
const x_rapidapi_key = process.env['x-rapidapi-key'];
const x_rapidapi_host = process.env['x-rapidapi-host'];

const getTredingTickers = (req, res, next) => {
  const options = {
    method: 'GET',
    url: stock_url_tickers,
    params: { region: req.query.region },
    headers: {
      'x-rapidapi-key': x_rapidapi_key,
      'x-rapidapi-host': x_rapidapi_host
    }
  };
  axios.request(options).then(function (response) {
    req.tickers = response.data;
    next();
  }).catch(function (error) {
    res.status(500).send("There is issue with fetching data, please try after some time");
  });
}

const getHistoricData = (symbol, region) => {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: stock_url_history,
      params: { symbol: symbol, region: region },
      headers: {
        'x-rapidapi-key': x_rapidapi_key,
        'x-rapidapi-host': x_rapidapi_host
      }
    };
    axios.request(options).then(function (response) {
      resolve(response.data);
    }).catch(function (error) {
      reject("There is issue with fetching data, please try after some time");
    });
  })
}
const getSymbol = (target_stock, tickers) => {
  return new Promise((resolve, reject) => {
    if (!(tickers && tickers.finance && tickers.finance.result))
      return reject("No Data");
    let tickers_list = tickers.finance.result;
    let total_page = tickers_list.length

    //loop through each pages of result
    for (let page = 0; page < total_page; page++) {
      let total_item = tickers_list[page].count;

      //loop through each item in current page
      for (let item = 0; item < total_item; item++) {
        let { shortName, symbol } = tickers_list[page].quotes[item];
        if (shortName == target_stock) {
          return resolve(symbol);
        }
      }
    }
    return reject("No Data");
  })
}

const getTickingData = (historic_data, startdate, enddate) => {
  // historic_data.prices.sort((a, b) => a.date - b.date)
  let mean = getMean(historic_data.prices, historic_data.prices.length);
  let sd = getStandardDeviation(historic_data.prices, historic_data.prices.length, mean);
  let lowerLimit = mean - sd;
  let upperLimit = mean + sd;

  //convert dates to corresponding epoch time
  startdate_epoch = Math.floor((new Date(startdate).getTime() - new Date(startdate).getMilliseconds()) / 1000)
  enddate_epoch = Math.floor((new Date(enddate).getTime() - new Date(enddate).getMilliseconds()) / 1000)

  //getTickers
  let getTickers = getTickerData(lowerLimit, upperLimit, historic_data.prices, historic_data.prices.length, startdate_epoch, enddate_epoch);
  return getTickers;
}

const getTickerData = (lowerLimit, upperLimit, prices, total, startdate, enddate) => {
  let range = 0;//0--within sd,1--above sd,-1--below sd
  let result = [];
  for (let i = 0; i < total; i++) {
    if (prices[i].date >= startdate && prices[i].date <= enddate) {
      let { date, high } = prices[i];
      date = new Date(date * 1000).toDateString();
      if (lowerLimit >= prices[i].high && range == 0) {
        result.push({ date, price:high,status:"went below threshhold" });
        range = -1;
      }
      else if (upperLimit <= prices[i].high && range == 0) {
        result.push({ date, price:high,status:"went above threshhold" });
        range = 1
      }
      else if (range != 0 && upperLimit > prices[i].high && lowerLimit < prices[i].high) {
        result.push({ date, price:high,status:"comes back within threshhold" });
        range = 0;
      }
    }
    else
      break;
  }
  return result;
}

const getStandardDeviation = (prices, total, mean) => {
  let square = 0;
  for (let price = 0; price < total; price++) {
    square = square + Math.pow((prices[price].high - mean), 2);
  }
  let variance = square / total;
  let sd = Math.sqrt(variance);
  return sd;
}



const getMean = (prices, total) => {
  let sum = 0;
  for (let price = 0; price < total; price++) {
    sum += prices[price].high;
  }
  let mean = sum / total;
  return mean;
}

module.exports = { getTredingTickers, getSymbol, getHistoricData, getTickingData };