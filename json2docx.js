const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
/* eslint-disable-next-line */
const yapi = require('yapi.js');
// const data = require('./api.json')

const fs = require('fs');
const path = require('path');
const parser = require('./parser.js');
// const jsonSchemaParser = require('./parseJsonSchema');

// Load the docx file as a binary

function toDocx(data) {
  let templateName=getTemplateFileName(data);
  console.log("using template: "+templateName);
  const content = fs
    .readFileSync(path.resolve(yapi.WEBROOT_SERVER, '../', templateName), 'binary');

  const zip = new JSZip(content);

  const doc = new Docxtemplater();
  doc.loadZip(zip);

  doc.setOptions({ linebreaks: true, parser });

  // set the templateVariables
  doc.setData(JSON.parse(data));

  try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render();
  } catch (error) {
    const e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
    };
    console.log(JSON.stringify({ error: e }));
    // The error thrown here contains additional information
    // when logged with JSON.stringify (it contains a property object).
    throw error;
  }

  const buf = doc.getZip()
    .generate({ type: 'nodebuffer' });

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  // fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);
  return buf;
}

function getTemplateFileName(data){
  let dataJson=JSON.parse(data);
  if(!dataJson.project){
    return "input.docx";
  }
  try{
    fs.accessSync(path.resolve(yapi.WEBROOT_SERVER, '../', "docTemplates"),fs.constants.R_OK);
  }catch{
    return "input.docx";
  }
  try{
    fs.accessSync(path.resolve(yapi.WEBROOT_SERVER, '../', "docTemplates/input-"+dataJson.project._id+".docx"),fs.constants.R_OK);
  }catch{
    return "input.docx";
  }
  return "docTemplates/input-"+dataJson.project._id+".docx";
}

module.exports = toDocx;
