(async () => {
"use strict";

/* node imports */
const fs = require('fs');
const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.612.0");
const WebSocket = require("ws");
const express = require('express');
const cors = require('cors');
const {
    Configuration,
    OpenAIApi
} = require("openai");

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
    session.on("traffic:sent", (data) => console.log("sent:", data));
    session.on("traffic:received", (data) => console.log("received:", data));

    const global =  await session.open();

    console.log('appId', appId);

   /*  global.openDoc(appId).then(async model => {
        console.log(model);
    }); */

    const global =  await session.open();

    global.openDoc(appId).then(async model => {

        model.getObject({
            "qId": objID
        }).then(async model => {
            //console.log('model CPWbTj', model);
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

                        // console.log('obj', obj);

                        table_data.push(obj)
                    });
                });

                console.log('table_data', table_data);
                //get data from table in string
                const table_data_json = JSON.stringify(table_data);

                // fs.writeFile('../csv/table_data.json', table_data_json, (err) => {}); 


            }); //model.getLayout().then(async modelLayout => {


        }); // model.getObject({


    }); //const app = global.openDoc(appId).then(model => { */


    console.log("You are connected!");

    //await session.close();
    //console.log("Session closed!");

} catch (err) {

    //console.log("Something went wrong :(", err);

    //reject("Something went wrong :(", err)

} //try

})()