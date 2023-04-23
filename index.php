<pre class="wp-block-syntaxhighlighter-code"><!-- include jquery and socket IO -->
//baixar os dois a baixo e colocar na pasta js
<script src="js/jquery.js"></script>
<script src="js/socket.io.js"></script>
 
<script>
  // creating io instance
  var io = io("http://191.252.223.139:6000");
 
  var receiver = "";
  var sender = "";
 
</script></pre>


<pre class="wp-block-syntaxhighlighter-code"><form onsubmit="return enterName();">
  <input id="name" placeholder="Enter name">
  <input type="submit">
</form>
 
<ul id="users"></ul>
     
<script>
    function enterName() {
        // get username
        var name = document.getElementById("name").value;
 
        // send it to server
        io.emit("user_connected", name);
 
        // save my name in global variable
        sender = name;
 
        // prevent the form from submitting
        return false;
    }
 
    // listen from server
    io.on("user_connected", function (username) {
        var html = "";
        html += "<li><button onclick='onUserSelected(this.innerHTML);'>" + username + "</button></li>";
 
        document.getElementById("users").innerHTML += html;
    });
 
    function onUserSelected(username) {
        // save selected user in global variable
        receiver = username;
      }
</script></pre>



<pre class="wp-block-syntaxhighlighter-code"><form onsubmit="return sendMessage();">
  <input id="message" placeholder="Enter message">
  <input type="submit">
</form>
 
<ul id="messages"></ul>
     
<script>
    function sendMessage() {
        // get message
        var message = document.getElementById("message").value;
 
        // send message to server
        io.emit("send_message", {
          sender: sender,
          receiver: receiver,
          message: message
        });
 
        // append your own message
        var html = "";
        html += "<li>You said: " + message + "</li>";
 
        document.getElementById("messages").innerHTML += html;
 
        // prevent form from submitting
        return false;
    }
 
    // listen from server
    io.on("new_message", function (data) {
        var html = "";
        html += "<li>" + data.sender + " says: " + data.message + "</li>";
 
        document.getElementById("messages").innerHTML += html;
    });
</script></pre>
