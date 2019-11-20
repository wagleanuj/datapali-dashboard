const { Schema, model } = require('mongoose');

const controlSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    UP: { type: String, required: true, default: "ArrowUp" },
    DOWN: { type: String, required: true, default: "ArrowDown" },
    LEFT: { type: String, required: true, default: "ArrowLeft" },
    RIGHT: { type: String, required: true, default: "ArrowRight" },
    JUMP: { type: String, required: true, default: "KeyX" },
    SLIDE: { type: String, required: true, default: "KeyC" },
    ACTION: { type: String, required: true, default: "KeyZ" },
    LEFT_SWAP: { type: String, required: true, default: "KeyA" },
    RIGHT_SWAP: { type: String, required: true, default: "KeyD" },
});

module.exports = {
    Controls: model("Controls", controlSchema)
}

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


