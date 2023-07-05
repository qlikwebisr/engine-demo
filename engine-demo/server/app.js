"use strict";

/* node imports */
const fs = require('fs');
const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.612.0");
const WebSocket = require("ws");
const express = require('express');
const cors = require('cors');

//settings file
const settings = require('./settings.js');

/* Settings */
// replace with your information
const tenant = settings.tenant;
const apiKey = settings.apiKey;
const appId = settings.appId;
const objID = settings.objID;

const defaultRowNumber = settings.defaultRowNumber;


//url for the Enigma WS
const url = `wss://${tenant}/app/${appId}`;

//Express router
const express_app = express();

const port = 3000;

/* express_app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
 */
//CORS
express_app.use(cors({
    origin: '*'
}));

// Serve static files from the "public" directory
express_app.use(express.static('public'));

// Parse JSON request bodies
express_app.use(express.json());

//routes
//html file
express_app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//post to service
express_app.get('/table', async (req, res) => {

    //const rows = req.body.rows ? req.body.rows : defaultRowNumber;
    //const data = req.body;

    const rows = defaultRowNumber;
    const response = await getTableData(rows);

    console.log('response', response);

    res.json(response);
});

express_app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

//test function
async function asyncTest(rows, data) {

    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            resolve({
                'this': 'is test for ' + rows + ' rows for: ' + data.admin_group + ', prompt is: ' + data.prompt
            })
        }, 5000)
    })

}

// main function to get the table data and send prompt to Chat GPT 
async function getTableData(rows) {

    return new Promise(async (resolve, reject) => {

        try {

            //create session with enigma 
            const session = enigma.create({
                schema,
                createSocket: () =>
                    new WebSocket(url, {
                        headers: {
                            Authorization: `Bearer ${apiKey}`
                        },
                    }),
            });

            // bind traffic events to log what is sent and received on the socket:
            //session.on("traffic:sent", (data) => console.log("sent:", data));
            //session.on("traffic:received", (data) => console.log("received:", data));

            const global = await session.open();

            global.openDoc(appId).then(async model => {

                //console.log(admin_group);

                //select field
              /*   model.getField('admin_group')
                    .then(field => {
                        //console.log('field',field);

                        const selected = [{
                            "qText": data.admin_group,
                            "qIsNumeric": false,
                            "qNumber": 0
                        }]
                        return field.selectValues(selected);
                    })
                    .then((successful) => {
                        if (successful) {
                            console.log('Selection done');
                        } else {
                            console.error('Selection failed');
                        }
                    })
                    .catch(console.error); */

                /*  get data from table  */
                model.getObject({
                    "qId": objID
                }).then(async model => {
                    model.getLayout().then(async modelLayout => {

                        //console.log('modelLayout', modelLayout);

                        const columns = modelLayout.qHyperCube.qSize.qcx;
                        const totalheight = modelLayout.qHyperCube.qSize.qcy;

                        //build headers part
                        const columnOrder = modelLayout.qHyperCube.columnOrder;
                        const qDimensionInfo = modelLayout.qHyperCube.qDimensionInfo.map(dim => dim.qFallbackTitle);
                        const qMeasureInfo = modelLayout.qHyperCube.qMeasureInfo.map(measure => measure.qFallbackTitle);

                        const headers_unordered = qDimensionInfo.concat(qMeasureInfo);

                        const headers = [];

                        for (let index = 0; index < columnOrder.length; index++) {
                            if (headers_unordered[columnOrder[index]] !== undefined) {
                                headers.push(headers_unordered[columnOrder[index]])
                            }
                        }

                        //console.log('headers', headers);
                        //console.log('rows', rows);

                        //build table data
                        const table_data = []

                        await model.getHyperCubeData('/qHyperCubeDef', [{
                            qTop: 0,
                            qLeft: 0,
                            qWidth: columns,
                            qHeight: rows
                        }]).then(data => {

                            data[0].qMatrix.forEach((row, i) => {

                                const obj = {}

                                const row_qText = row.map(data => data.qText);

                                for (let index = 0; index < headers.length; index++) {
                                    obj[headers[index]] = row_qText[index];
                                }

                                //console.log('obj', obj);

                                table_data.push(obj)
                            });
                        });

                        //console.log('table_data', table_data);
                        //get data from table in string
                        const table_data_json = JSON.stringify(table_data);

                        //fs.writeFile('../csv/table_data.txt', prompt, (err) => {}); 

                        resolve(table_data_json)


                    }); //model.getLayout().then(async modelLayout => {


                }); // model.getObject({


            }); //const app = global.openDoc(appId).then(model => {


            console.log("You are connected!");

            //await session.close();
            //console.log("Session closed!");

        } catch (err) {

            console.log("Something went wrong :(", err);

            reject("Something went wrong :(", err)

        } //try

    }); //return new Promise(async(resolve, reject) => {

}