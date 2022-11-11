const users=[];

//adduser,RemoveUser,GetUser,GetUsersInRoom
const removeUser=(id)=>{
 const index=users.findIndex((user)=>{
    return user.id==id;
 });

 if(index!==-1){
    return users.splice(index,1)[0]
 }
}

//get user function
const getUser=(id)=>{
     return users.find((user)=>user.id===id);  
    }
//get users in room
const getUsersInRoom=(room)=>{
room= room.trim().toLowerCase();
return users.filter((user)=>user.room===room);

}

//Add a user to the array
const addUser=({id,username,room})=>{
//Clean the data
username= username.trim().toLowerCase();
room= room.trim().toLowerCase();
//Validate the data
if(!username ||!room){
 return {
    error: 'Username and room are required!'
 }
}
//Check for exisiting user
const exisitingUser= users.find((user)=>{
    return user.room===room&&user.username===username;
})
//validate username
if(exisitingUser){
    return {
        error: "Username is already in use"
    }
}
// Store user
const user={id,username,room}
users.push(user);
return user;
}




module.exports={
   addUser,
   getUser,
   removeUser,
   getUsersInRoom
}




