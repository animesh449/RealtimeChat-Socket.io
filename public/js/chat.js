
const socket=io();
socket.on("message",(message)=>{
    console.log(message);

})
//elements
const $messageForm= document.querySelector('#message-form');
const $messageFormInput=document.querySelector("input");
const $messageFormButton=document.querySelector("button");
const $sendLocationButton=document.querySelector('#send-location');
const $messages= document.querySelector("#messages");


//Templates
const messageTemplate= document.querySelector('#message-template').innerHTML;
const locationTemplate=document.querySelector('#location-template').innerHTML;
const $sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;

console.log(messageTemplate);

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix: true});


//autoscroll
const autoscroll=()=>{
    //New message element
    const $newMessage= $messages.lastElementChild;
    //get the height of the last message
    const newMessageStyles=getComputedStyle($newMessage);
    const newMessageMargin=parseInt(newMessageStyles.marginBotton);
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin;
    //visible height
    const visibleHeight=$messages.offsetHeight;
    //Height of messsages container
    const containerHeight=$messages.scrollHeight;
    //How far have i scrolled

    const scrollOffset=$messages.scrollTop+visibleHeight;
    if(containerHeight-newMessageHeight<=scrollOffset){
     $messages.scrollTop=$messages.scrollHeight;
    }

}


socket.on("message",(message)=>{
    console.log('A new connections has been established');
    const html=Mustache.render(messageTemplate,{username: message.username,message: message.text,createdAt: moment(message.createdAt).format('h:mm a')});
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});
socket.on('location',(location)=>{
    const html=Mustache.render(locationTemplate,{username:location.username, url: location.url, createdAt: moment(location.createdAt).format("h:m a")});
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll();
}
);

socket.on('roomData',({room,users})=>{
    const html=Mustache.render($sidebarTemplate,{users,room});
    document.querySelector('#sidebar').innerHTML=html;

})

//SEND MESSAGE 

document.querySelector("#message-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    //disable the form while the message is being sent
     $messageFormButton.setAttribute('disabled','disabled');
     


    const message=e.target.elements.message.value;
    socket.emit('sendMessage',message,(error)=>{
        //enable the form 
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value='';
        $messageFormInput.focus();

        if (error) {
            return console.log(error)
        }
        console.log("message delivered");
    });


});

/*SEND LOCATION*/
document.querySelector('#send-location').addEventListener('click',()=>{
   
    if(!navigator.geolocation){
        return alert("Geolocation is not support by your browser");
    };
    $sendLocationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('geolocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute("disabled");
            console.log("Locations has been shared successfully")
        });
    })
 
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href="/";
    }
  
});
