const { Schema, model } = require('mongoose');


const makeSchema = function(tree, rootId){
    const treeToSchema = (node)=>{
        const schema = new Schema({});
        node.childNodes.forEach(it=>{
            const item = tree[it];
            if(item._type==="question"){
                schema.add({[item.customId||item.id]:{type: String }})       

            }else if(item._type==="section"){
                schema.add({[item.customId||item.id]: [{type: treeToSchema(item), default:()=>({})}]});
            }else{
                schema.add({[item.customId||item.id]:{type: treeToSchema(item),default:()=>({})}})
            }
        });
        return schema;
    };
    return treeToSchema(tree[rootId]);
}

function makeTree(root , tree = undefined) {
    const type = tree ? 'section' : 'root';
    if(!tree) {
        tree = {}
    }
    const val = {
        ...root,
        _type: type,
        childNodes: []
    };
    for (let i = 0; i < root.content.length; i++) {
        let item = root.content[i];
        if (item.hasOwnProperty("content")) {
            val.childNodes.push(item.customId||item.id);
            makeTree(item, tree);
        } else {
            val.childNodes.push(item.customId||item.id);
            const question = { ...item, _type: 'question' };
            tree[item.customId||item.id] = question;
        }
    }
    tree[root.customId||root.id] = val;
    return tree;
}

module.exports = {
    makeTree,
    makeSchema
}

