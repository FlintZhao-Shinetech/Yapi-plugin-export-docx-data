function remarkParser(data){
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
    let newApi=JSON.parse(JSON.stringify(api));
    // 保证这个字段存在
    newApi.markdown_text="";
    if(!newApi.markdown){
        return newApi;
    }
    newApi.markdown_text=newApi.markdown.replace(/<[^>]+>/g,'');
    return newApi;
}
module.exports = remarkParser;