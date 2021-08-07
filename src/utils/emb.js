const emb = module.exports;
let emoji = require("./emoji")

emb.loadQuestions = async (guild) => {
  return new Promise(async (resolve,reject) => {
    let list = new Map();
    let q = ['Title', 'Description', 'Image', 'Color'];
    for(let i = 0; i < q.length; i++) {list.set(emoji[i+1], `${emoji[i+1]} ${q[i]}`)};
    console.log(list)
    let k=[];
    let v=[];
    for(let [key,val] of list) {
      k.push(key)
      v.push(val)
    }
    resolve({k:k,v:v});
  })
}
