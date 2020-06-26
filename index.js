
const nodeFetch = require('node-fetch');
const fetch = require('fetch-cookie')(nodeFetch);
const fs = require('fs');
const fsSync = require('async-file');
const readlineSync = require('readline-sync');
const cheerio = require('cheerio');
const colors = require('./lib/colors');
const moment = require('moment');


console.log(colors.FgMagenta, `
#######################################################################

                                                               
  # #  #####  #####  #      ######    #    #   ##   #      # #####  
 #  #  #    # #    # #      #         #    #  #  #  #      # #    # 
#    # #    # #    # #      #####     #    # #    # #      # #    # 
###### #####  #####  #      #         #    # ###### #      # #    # 
#    # #      #      #      #          #  #  #    # #      # #    # 
#    # #      #      ###### ######      ##   #    # ###### # #####  
                                                                   

Thanks to : Mukhlis Akbarrudin, Aminudin
#######################################################################
`,colors.Reset);


const fileName = readlineSync.question('Masukan nama file : ');


const cekValid = (emailId) => new Promise((resolve, reject) => {
  const boday = { id: `${emailId}`}
  fetch('https://iforgot.apple.com/password/verify/appleid', {
    method :'POST',
    headers: {
     'Content-Type': 'application/json' 
    },
  body: JSON.stringify(boday),
  })
  .then(res => res.text())
  .then(res => {
    resolve(res)

  })
  .catch(err => {
    reject(err)
  })
});

(async () => {
    
      await fs.readFile(fileName, async function(err, data) {
        if (err) throw err;
        const array = data
          .toString()
          .replace(/\r\n|\r|\n/g, " ")
          .split(" ");
          
          for(let i = 0; i < array.length; i++){
          
            const email = array[i];
            const getCekValid = await cekValid(email);
            const $ = cheerio.load(getCekValid);
            const confirmSucces = $('form').attr('action');
            const newI = i === 0 ? 1 : i + 1
            // console.log(confirmSucces)


            if (confirmSucces !== undefined) {             
              console.log(colors.FgGreen, `${newI}. ${email} => valid [${moment().format("HH:mm:ss")}]`, colors.Reset);
              await fsSync.appendFile(
                'valid.txt',
                `${email}\n`,
                'utf-8'
              )
            } else {
              console.log(colors.FgRed, `${newI}. ${email} => invalid [${moment().format("HH:mm:ss")}]` , colors.Reset)
              await fsSync.appendFile(
                'invalid.txt', 
                `${email}\n`, 
                "utf-8"
              )
            }
          }

      });

      process.on('unhandledRejection', (reason, promise) => {
        if (reason.code === 'ENOENT') {
          console.log('File tidak ditemukan.')
        }else{
          console.log('ada masalah')
        }
        // Application specific logging, throwing an error, or other logic here
      });
    
    

})();