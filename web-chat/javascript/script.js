// only works with MODULES
//import { APIKEY} from '/javascript/keys,js';
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBHMoFjss6ZpYSoZLnCGFm_FXMZ5gnmnXU",
    authDomain: "webchat-9b5c2.firebaseapp.com",
    databaseURL: "https://webchat-9b5c2.firebaseio.com",
    projectId: "webchat-9b5c2",
    storageBucket: "webchat-9b5c2.appspot.com",
    messagingSenderId: "441364454098"
};
firebase.initializeApp(config);



class Message {

    constructor(name, text) {
        this.name = name;
        this.text = text;
    }
}






// for authentication
const auth = firebase.auth();
var USERNAME;

console.log(USERNAME);


// choose which view we are in.
transitionView();

document.getElementById("logMeIn").addEventListener("touchend", initiateLogin);
document.getElementById("sendButton").addEventListener("touchend", addToFirebase);
document.getElementById("logOut").addEventListener("touchend", logOut);

/************
 * Author: Jesse Hillman
 * 
 * Grab the database reference and populate messages.
 * 
 * **********/
function retrieveFirebase() {
    // clear the message board.
    let chat = document.getElementById("chatLog");
    chat.innerHTML = null;

    // show me all the messages
    let dbRef3 = firebase.database().ref().child('Messages');

    dbRef3.on('child_added', (data) => {

        data.forEach((childData) => {
            console.log(childData.val().text);
            addToMessageView(childData.val().name, childData.val().text);
        });

    });

    dbRef3.on('child_changed', (data) => {

        data.forEach((childData) => {
            addToMessageView(childData.val().name, childData.val().text);
        });

    });

    dbRef3.on('child_removed', (data) => {

        data.forEach((childData) => {
            addToMessageView(childData.val().name, childData.val().text);
        });
    });


}


/***************************************
 * Author: Jesse Hillman
 * Adds new content to the message view
 * 
 * 
 * ********************************/
function addToMessageView(username, text) {

    // place to put the conversation
    let chatArea = document.getElementById("chatLog");

    // make a new node
    let chatNode = document.createElement('div');
    chatNode.className = "ChatNodes";

    // make a new userName
    let chatUser = document.createElement('div');
    let chatText = document.createElement('div');

    // add the new nodes
    chatNode.appendChild(chatUser);
    chatNode.appendChild(chatText);
    chatArea.appendChild(chatNode);

    // grab the new content and put it in the node
    chatUser.innerText = username;
    chatText.innerText = text;

}


/****************
 * Author: Jesse Hillman
 * 
 * Send the database a new entry
 * 
 * ********** */
function addToFirebase(userName) {

    let firebaseFriendlyUsername = USERNAME.substring(0, USERNAME.length - 4);

    userName = firebaseFriendlyUsername;


    // create a new entry
    let newEntry;
    // populate it
    newEntry = document.getElementById("inputText").value;

    // empty the input
    document.getElementById("inputText").value = null;

    scrollToBottom();

    // Get a reference to the database service
    var database = firebase.database();
    let newKey = database.ref('Messages/' + userName).push().key;

    let myMessage = new Message(userName, newEntry);


    // add a new item with the unique key
    database.ref('Messages/' + newKey).set({
        // use the object
        text: myMessage,

    })
}



/*******************
 * Author: Jesse Hillman
 * Purpose: removes chat elements
 * 
 * 
 * **************/
function removeChat() {
    let threads = document.getElementById("threads");
    let chatLog = document.getElementById("chatLog");
    let contributeChat = document.getElementById("contributeChat");

    threads.className = "hidden";
    chatLog.className = "hidden";
    contributeChat.className = "hidden";

}


/**********************
 * Author: Jesse Hillman
 * purpose: login initiation
 * 
 * ************** */
function initiateLogin() {

    console.log("iniating login");

    // TODO: Check if email is real
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;


    console.log(login);
    console.log(password);


    // auth
    const promise = auth.signInWithEmailAndPassword(login, password);
    promise.catch(e => console.log(e.message));


    // listener for authentication
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {




            console.log(firebaseUser);
            console.log("logged in");
            removeLogin();

            // we are logged in.
            //   removeLogin();
        }
        else {
            console.log('not logged in');
            removeChat();
            // show login
        }
    });

}


/***********
 * Author: Jesse Hillman
 * 
 * Purpose: logs out the user.
 * 
 * ***** */
function logOut() {

    console.log("logging out");
    firebase.auth().signOut();
    console.log("logged out!");
}


/*************
 * Author: Jesse Hillman
 * Purpose: show the login elements
 * 
 * *********/
function removeLogin() {
    let loginBlock = document.getElementById("loginBlock");
    loginBlock.className = "hidden";


    // show the chat log
    let threads = document.getElementById("threads");
    let chatLog = document.getElementById("chatLog");
    let contributeChat = document.getElementById("contributeChat");

    threads.className = "thread";
    chatLog.className = "chat";
    contributeChat.className = "chatInput";

}

/***********************
 * Author: Jesse Hillman
 * Purpose: Choose the view
 * 
 *******************/
function transitionView() {

    // listener for authentication
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            // UPDATE THE
            USERNAME = firebaseUser.email;
            console.log(USERNAME);


            // who is talking
            let threads = document.getElementById("threads");
            let newDiv = document.getElementById("welcomeMessage");
            newDiv.innerHTML =   "Welcome " + USERNAME.substring(0, USERNAME.length - 12);
            threads.appendChild(newDiv);


            // we are logged in.
            removeLogin();
            retrieveFirebase();
        }
        else {
            // show login
            showLogin();
            removeChat();
            console.log('not logged in');
        }
    });
}


/*******************
 * Author: Jesse Hillman
 * Purpose: Show login.
 * 
 * ****************/
function showLogin() {
    console.log("showing login");
    let loginBlock = document.getElementById("loginBlock");
    loginBlock.className = "loginC";
}


/*****************
 * Author: Jesse Hillman
 * 
 * 
 * ***** */
function scrollToBottom() {
    var chatLog = document.getElementById("chatLog");
    chatLog.scrollTop = chatLog.scrollHeight;
    console.log(chatLog.scrollTop);

}