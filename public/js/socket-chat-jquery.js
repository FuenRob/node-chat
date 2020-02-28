var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');
// Reference
var divUsers = $('#divUsuarios');
var formSent = $('#formSent');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');

// Render People
function renderPeople(people){

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> '+params.has('sala')+'</span></a>';
    html += '</li>';

    for(var i=0; i< people.length; i++){
        html += '<li>';
        html += '<a data-id="'+people[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+people[i].name+' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsers.html(html);
}

function renderChats(message, me){
    
    var date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();
    var adminClass = 'info';
    if( message.name === 'Administrador')
        adminClass = 'danger';
    var html = '';
    
    if(me){
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>'+message.name+'</h5>';
        html += '<div class="box bg-light-inverse">'+message.message+'</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '<div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }else{
        html += '<li class="animated fadeIn">';
        if( message.name !== 'Administrador')
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '<div class="chat-content">';
        html += '<h5>'+message.name+'</h5>';
        html += '<div class="box bg-light-'+adminClass+'">'+message.message+'</div>';
        html += '</div>';
        html += '<div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

// Listeners
divUsers.on('click', 'a', function(){
    var id = $(this).data('id');
    if(id){
        console.log(`Id of the user: ${id}`)
    }
});

formSent.on('submit', function(e){
    e.preventDefault();

    if(txtMessage.val().trim().length === 0)
        return;
    
    socket.emit('sentMessage', {
        name: name,
        message: txtMessage.val()
    }, function(resp) {
        renderChats(resp, true);
        txtMessage.val('').focus();
        scrollBottom()
    });
})

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}