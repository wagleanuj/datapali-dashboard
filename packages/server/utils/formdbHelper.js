const { Schema, model } = require('mongoose');


const makeSchema = function(tree, rootId){
    const treeToSchema = (node)=>{
        const schema = new Schema({});
        node.childNodes.forEach(it=>{
            const item = tree[it.id];
            if(item._type==="question"){
                schema.add({[item.id]:{type: String }})       

            }else if(item._type==="section"){
                schema.add({[item.id]: [{type: treeToSchema(item)}]});
            }else{
                schema.add({[item.id]:{type: treeToSchema(item)}})
            }
        });
        return schema;
    };
    return treeToSchema(tree[rootId]);
}


