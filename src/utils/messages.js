const generateMessage=(username,text)=>{
  return {
    username,
    text,
    createdAt: new Date().getTime(),
    defaultName: "System"
  }
}
const generateLocationMessage=(username,url)=>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}