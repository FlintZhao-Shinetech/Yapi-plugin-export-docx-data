const fs = require('fs');
const jsonSchemaParser = require('./parseJsonSchema');
fs.readFile("test-json-files/data.json",{encoding:"utf8"},(err,data)=>{
    let parsedData=jsonSchemaParser(JSON.parse(data));
    validateIfNewAttrExists(parsedData);
    // fs.writeFile("dataParsed.json",JSON.stringify(parsedData,null,4),()=>{console.log("file writed.")});
    let curproject=fs.readFileSync("test-json-files/project.json",{encoding:"utf8"});
    let curProject=JSON.parse(curproject);
    let logS=fs.readFileSync("test-json-files/log.json",{encoding:"utf8"});
    let log=JSON.parse(logS);
    let docxJson=JSON.stringify({
        curProjectName: `${curProject.name}接口文档`,
        apis: parsedData,
        log,
      }, null, 2);
      validateIfNewAttrExists(JSON.parse(docxJson).apis);
    // fs.writeFile("docxJson.json",docxJson,()=>{console.log("docxJson file writed");});
});

function validateIfNewAttrExists(data){
    console.log("执行转换函数");
    let propFinded=false;
    for (let group of data) {
      for (let api of group.list) {
        if (api.res_body_is_json_schema && api.res_body_json_schema_form) {
          console.log(group.name + ":" + api.title + api.query_path.path);
          propFinded=true;
          console.log("find added prop, break");
          break;
        }
      }
      if(propFinded){
        break;
      }
    }
  }