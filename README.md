# Stock-Market-Analysis

NOTE: this project is to get ticking data with a date range for a specific company, we are using yahoo finance api to fetch analytic data

1. Clone the repository to your local machine
2. initialize directory Stock-Market-Analysis to with npm -- [command: npm init]
3. install all dependencies -- [command: npm i]
4. edit the prod.conf file and add specified field like port, yahoo finance api key
5. install git bash
6. open git bash and navigate to working directory
7. type command npm run start-prod to start the server
8. use GET of http://{ip}:{port}/ticking/data?stock={shortname of stock}&startdate={start-date}&enddate={end date}&region={region}
  sample request:
  http://localhost:4000/ticking/data?stock=AMC Entertainment Holdings, Inc&startdate=2020-12-03&enddate=2021-12-03&region=US
  sample output:
  [
    {
        "date": "Thu Jul 08 2021",
        "high": 49.790000915527344,
        "status": "went below threshhold"
    },
    {
        "date": "Wed May 26 2021",
        "high": 19.950000762939453,
        "status": "comes back within threshhold"
    }
]

9. Ouput is an array of stock data date-date when it has ticking price,price: the price on which it changes its state, status: crosses above threshold/crosses below threshold/come back to threshold limit

Thanks
--------
