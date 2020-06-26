const nodeFetch = require('node-fetch');
const fetch = require('fetch-cookie')(nodeFetch);

const boday = {
  "merchantApiKey": "195230857030",
  "nominal": "0",
  "staticQR": "1",
  "mdrId": "4",
  "surchargeId": "1",
  "tipFirstProposition": "500",
  "tipSecondProposition": "500",
  "tipSuggestedAmount": "1500",
  "invoiceName": "es batu",
  "qrGaruda": "1" 
}

fetch('https://qren-api.tmoney.co.id/paybyqr/createinvoice/', {
  method :'POST',
  headers: {
   'Content-Type': 'application/json',
   'Authorization': 'Basic dG1vbmV5OmZmODY2ZjViNjE1NGJiYjdkOTc4ZTUyNDNiNDkzMjBiMGQxYWQ2N2M='
  },
body: JSON.stringify(boday),
})

.then(res => res.json())
.then(json => console.log(json.content.substring(40, 58)))
.catch(err => console.log(err))