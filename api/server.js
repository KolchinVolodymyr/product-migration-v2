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
    `${moment().format('YYYY-MM-DD').trim()}-BigCommerce-products-import.csv`;
const BigCommerce = require('node-bigcommerce');

const bigCommerce = new BigCommerce({
    clientId: 'k774mcmpeu75ert9zrha24gvsbswj1y',
    accessToken: '86fxqoc9f8q6psha1sc0xaf6s2wgjyv',
    storeHash: '85kzbf18qd',
    responseType: 'json',
    apiVersion: 'v3' // Default is v2
});
const app = express();
//MIDDLEWARES
app.use(upload({useTempFiles: true}));
app.use(cors());
//ROUTE DEFINE
app.post('/', async function (req, res) {
    try {
        const data = [];
            let getProducts =
                csv()
                    .fromFile(req.files.File.tempFilePath)
                    .then((jsonObj) => {
                        var combinedItems = jsonObj.reduce(function(arr, item, index) {
                            var found = false;

                            for (var i = 0; i < arr.length; i++) {
                                console.log("arr[i].Handle", arr[i])
                                if (arr[i].Handle === item.Handle) {
                                    found = true;
                                    arr[i].count++;
                                    // console.log('arr[i].option_display_name', arr[i].option_display_name)
                                    arr[i].variants.push({
                                        'sku': item['Variant SKU'],
                                        'option_values': [{
                                            'option_display_name': arr[i].option_display_name,
                                            'label': item['Option1 Value']
                                        }]
                                    })
                                }
                            }

                            if (!found) {
                                item.variants = [{
                                    'sku': item['Variant SKU'],
                                    'option_values': [{
                                        'option_display_name': item['Option1 Name'],
                                        'label': item['Option1 Value']
                                    }]
                                }];
                                item.count = 1;
                                item.option_display_name = item['Option1 Name'];
                                arr.push(item);
                                data.push(arr[i]);
                            }

                            return arr;
                        }, [])
                    });
            /*pruductsBigCommerce arr*/
            let productsBigCommerce = [];
            Promise.all([getProducts]).then(() => {
                data.forEach((element)=>{
                    if(element.count > 1) {
                        productsBigCommerce.push({
                            'name': element['Title'],
                            'sku': element['Handle'],
                            'price': element['Variant Price'],
                            'weight': element['Variant Grams'],
                            'type': 'physical',
                            'variants': element['variants'],
                            'description': element['Body (HTML)'],
                            'brand_name': element['Vendor'],
                            "images": [
                                {
                                  "image_url": element['Image Src']
                                }
                            ]
                        })
                    } else {
                        productsBigCommerce.push({
                            'name': element['Title'],
                            'price': element['Variant Price'],
                            'sku': element['Handle'],
                            'weight': element['Variant Grams'],
                            'type': 'physical',
                            'description': element['Body (HTML)'],
                            'brand_name': element['Vendor'],
                            "images": [
                                {
                                  "image_url": element['Image Src']
                                }
                            ]
                        })
                    }
                })
                //
                console.log('productsBigCommerce', productsBigCommerce);

            }).then((value)=>{

                productsBigCommerce.map((lineItem)=>{
                    //console.log('line', lineItem);
                    bigCommerce.post(`/catalog/products`, lineItem)
                        .then((data) => {
                            console.log('data', data);
                        })
                        .catch((err)=>{
                            console.log("Error", err);
                            logger.info(`${JSON.stringify(err)}`);
                        })
                })
            })
    } catch (e) {
        console.log('error9999', e)
    }
});

app.listen(8080 || process.env.PORT, function () {
 console.log('Server is running:');
});