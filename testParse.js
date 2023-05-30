const fs = require('fs');
const jsonSchemaParser = require('./parseJsonSchema');
fs.readFile("data.json",{encoding:"utf8"},(err,data)=>{
    let parsedData=jsonSchemaParser(JSON.parse(data));
    for(let group of parsedData){
        for(let api of group.list){
            if(api.res_body_is_json_schema && api.res_body_json_schema_form){
                console.log(group.name+":"+api.title+api.query_path.path);
            }
        }
    }
    fs.writeFile("dataParsed.json",JSON.stringify(parsedData,null,4),()=>{console.log("file writed.")});
    
    let docxJson=JSON.stringify({
        curProjectName: `接口文档`,
        apis: parsedData,
        // log,
      }, null, 2);
    fs.writeFile("docxJson.json",docxJson,()=>{console.log("docxJson file writed");});
});