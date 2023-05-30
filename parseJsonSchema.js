function jsonSchemaParser(data){
    const result = [];
    data.forEach((item)=>{
        let list=[];
        item.list.forEach((api)=>{
            const newApi=realParser(api);
            list.push(newApi);
        })
        item.list=list;
        result.push(item);
    });
    return result;
}
function realParser(api){
    // 移除const效果，否则在toDocx之前的JSON.stringify会丢失新增的属性
    // 即使这里看上去像是加上了
    let newApi=JSON.parse(JSON.stringify(api));
    // 返回结果处理开始
    if(newApi.res_body_is_json_schema){
        let res_body_schema=null;
        try{
            res_body_schema=JSON.parse(newApi.res_body);
        }catch(e){
            console.log("parse res_body error:",newApi.res_body);
        }
        let schema_array=[];
        if(res_body_schema){
            parse_schema("",res_body_schema,false,schema_array,0);
        }else{
            newApi.res_body_is_json_schema=false;
        }
        newApi.res_body_json_schema_form=schema_array;
    }
    // 返回结果处理结束
    // 请求参数处理开始
    if(newApi.req_body_is_json_schema && newApi.req_body_other){
        let req_body_schema=null;
        try{
            req_body_schema=JSON.parse(newApi.req_body_other);
        }catch(e){
            console.log("parse req_body_other error:",newApi.req_body_other);
        }
        let schema_array=[];
        if(req_body_schema){
            parse_schema("",req_body_schema,false,schema_array,0);
        }else{
            newApi.req_body_is_json_schema=false;
        }
        newApi.req_body_json_schema_form=schema_array;
    }
    // 请求参数处理结束
    return newApi;
}

function parse_schema(name, schema,current_required,schema_array,depth){
    let have_children=false;
    let children_name="";
    if(schema['type']==='array'){
        have_children=true;
        children_name="items";
    }
    if(schema['type']==='object'){
        have_children=true;
        children_name="properties";
    }

    let prefix="";
    if(depth>0){
        for(let i=0;i<depth;i++){
            prefix+="　";    
        }
        prefix+="├─";
    }
    if(name){
        let new_item={
            name:name,
            type:schema['type'],
            required:current_required?"1":"0",
            description:schema["description"]?schema["description"]:"--"
        };
        schema_array.push(new_item);
    }

    if(!have_children){
        // 上面处理过了
        return;
    }
    let children=schema[children_name];
    if(children_name=="items"){
        parse_schema(prefix+"items",children,false,schema_array,depth+1);
    }
    if(children_name=="properties"){
        let sub_required_array={};
        if(schema['required']){
            schema['required'].forEach((item)=>{
                sub_required_array[item]=true;
            })
        }
        for(let child_name in children){
            let child=children[child_name];
            parse_schema(prefix+child_name,child,sub_required_array[child_name]?true:false,schema_array,depth+1);
        }
    }
}
module.exports = jsonSchemaParser;