const express = require('express');
const upload = require('express-fileupload');
const cors = require('cors');
const csv = require('csvtojson');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
const validator = require('validator');
const logger = require('./configs/logger');
const moment = require("moment");
const FILENAME_TIMESTAMP_FORMAT =
    `${moment().format('YYYY-MM-DD').trim()}-BigCommerce-customer.csv`;

const app = express();
//MIDDLEWARES
app.use(upload({useTempFiles: true}));
app.use(cors());
//ROUTE DEFINE
app.post('/', async function (req, res) {
    try {
        let countSuccessfully = 0;
        let countError = 0;
        const ValidationData = [];
        const data = [];

        let getProducts =
        csv()
            .fromFile(req.files.File.tempFilePath)
            .then((jsonObj) => {

                jsonObj.reduce(function(arr, item, index) {
                var found = false;

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].Email === item.Email) {
                        found = true;
                        arr[i].count++;
                        arr[i].arr.push({
                            'Address Line 1': item.Address1,
                            'Address Line 2': item.Address2,
                            'Address Company': item.Company,
                            'Address City': item.City,
                            'Address State': item.Province,
                            'Address Zip': item.Zip,
                            'Address Country': item.Country,
                            'Address Phone': item.Phone,
                        })
                    }
                }

                if (!found) {
                    item.arr = [{
                        'Address Line 1': item.Address1,
                        'Address Line 2': item.Address2,
                        'Address Company': item.Company,
                        'Address City': item.City,
                        'Address State': item.Province,
                        'Address Zip': item.Zip,
                        'Address Country': item.Country,
                        'Address Phone': item.Phone,
                    }];
                    item.count = 1;
                    arr.push(item);
                    data.push(arr[i]);
                }

                return arr;
            }, [])
            });

            Promise.all([getProducts]).then(() => {
                const writerExport = csvWriter({});

                writerExport.pipe(fs.createWriteStream(`${FILENAME_TIMESTAMP_FORMAT}`));

                data.map((i)=>{
                    let count = 0;
                    i.arr.map((a, index)=>{
                        index++;
                        count++;
                        // loop over keys and values
                        Object.entries(a).forEach(([key, value]) => {
                             i[`${key} - ${index}`] = value;
                        });

                    });
                    delete i.arr;
                });


                /*Change arr*/
                var changeArray = data.map((item, index) => ({
                    'Last Name': item['Last Name'],
                    'First Name': item['First Name'],
                    'Email Address': item['Email'],
                    'Company': item['Company'],
                    'Phone': item['Phone'],
                    'Notes': item['Note'],
                    'Address First Name - 1': item['First Name'],
                    'Address Last Name - 1': item['Last Name'],
                    'Address Company - 1': item['Address Company - 1'],
                    'Address Line 1 - 1': item['Address Line 1 - 1'],
                    'Address Line 2 - 1': item['Address Line 2 - 1'],
                    'Address City - 1': item['Address City - 1'],
                    'Address State - 1': item['Address State - 1'],
                    'Address Zip - 1': item['Address Zip - 1'],
                    'Address Country - 1': item['Address Country - 1'],
                    'Address Phone - 1': item['Address Phone - 1'],
                    'Address First Name - 2': item['First Name'],
                    'Address Last Name - 2': item['Last Name'],
                    'Address Company - 2': item['Address Company - 2'],
                    'Address Line 1 - 2': item['Address Line 1 - 2'],
                    'Address Line 2 - 2': item['Address Line 2 - 2'],
                    'Address City - 2': item['Address City - 2'],
                    'Address State - 2': item['Address State - 2'],
                    'Address Zip - 2': item['Address Zip - 2'],
                    'Address Country - 2': item['Address Country - 2'],
                    'Address Phone - 2': item['Address Phone - 2'],
                    'Address First Name - 3': item['First Name'],
                    'Address Last Name - 3': item['Last Name'],
                    'Address Company - 3': item['Address Company - 3'],
                    'Address Line 1 - 3': item['Address Line 1 - 3'],
                    'Address Line 2 - 3': item['Address Line 2 - 3'],
                    'Address City - 3': item['Address City - 3'],
                    'Address State - 3': item['Address State - 3'],
                    'Address Zip - 3': item['Address Zip - 3'],
                    'Address Country - 3': item['Address Country - 3'],
                    'Address Phone - 3': item['Address Phone - 3'],
                    'Accepts Marketing': item['Accepts Marketing'],
                    'Metafield Namespace': item['Metafield Namespace'],
                    'Metafield Key': item['Metafield Key'],
                    'Metafield Value': item['Metafield Value'],
                    'Metafield Value Type': item['Metafield Value Type'],
                }))

                /*Write CSV*/
                changeArray.map((el, index)=>{
                    let a = `Email Address:${validator.isEmail(el['Email Address'])},Last Name:${validator.isLength(el['Last Name'], {min:3, max: undefined})},First Name:${validator.isLength(el['First Name'], {min:3, max: undefined})},Address Line 1: ${validator.isLength(el['Address Line 1 - 1'], {min:1, max: undefined})},Address Line 2: ${validator.isLength(el['Address Line 2 - 1'], {min:1, max: undefined})},Address City:${validator.isLength(el['Address City - 1'], {min:1, max: undefined})}, Address Country:${validator.isLength(el['Address Country - 1'], {min:1, max: undefined})}, Address Zip:${validator.isLength(el['Address Zip - 1'], {min:1, max: undefined})}`;

                    switch (
                        validator.isEmail(el['Email Address']) &&
                        validator.isLength(el['Last Name'], {min:3, max: undefined}) &&
                        validator.isLength(el['First Name'], {min:3, max: undefined}) &&
                        validator.isLength(el['Address Line 1 - 1'], {min:1, max: undefined}) &&
                        validator.isLength(el['Address Line 2 - 1'], {min:1, max: undefined}) &&
                        validator.isLength(el['Address City - 1'], {min:1, max: undefined}) &&
                        validator.isLength(el['Address Country - 1'], {min:1, max: undefined}) &&
                        validator.isLength(el['Address Zip - 1'], {min:1, max: undefined})
                        ) {
                        case true:
                            countSuccessfully++;
                            writerExport.write(el);
                            break;
                        case false:
                            countError++;
                            ValidationData.push([++index, a]);
                            logger.info(`Validation ${JSON.stringify(a)} - ${JSON.stringify(el)}`);
                            break;
                        default:
                            logger.info(`default`);
                            break;
                    }
                })
            })
            .then(()=>{
                res.status(201).send({
                    message: 'FILE RECEIVED!',
                    countSuccessfully: countSuccessfully,
                    countError: countError,
                    ValidationData: ValidationData
                });
            })

    } catch (e) {
        console.log('error', e)
    }
});
app.get('/download', function (req, res, next) {
    res.download(__dirname + `/${FILENAME_TIMESTAMP_FORMAT}`, `${FILENAME_TIMESTAMP_FORMAT}`);
});

app.listen(8080 || process.env.PORT, function () {
 console.log('Server is running:');
});