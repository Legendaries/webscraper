// Create SocketIO instance, connect
// TODO: Input ip/domain
// TODO: Ex http://ip:8081
let socket = io('');

socket.on('response', data => {
    let values = JSON.parse(data);

    let tr = document.createElement('tr');
    tr.className = values[values.length - 1] ? 'bg-success' : '';

    // Generate table from response
    values.forEach((value) => {
        let td = document.createElement('td');
        if (value === true) {
            let i = document.createElement('i');
            i.className = 'fas fa-check-circle';
            td.appendChild(i);
        } else if (value === false) {
            let i = document.createElement('i');
            i.className = 'fas fa-times';
            td.appendChild(i);
        } else {
            td.innerText = value;
        }
        tr.appendChild(td);
    });

    $('#tablebody').append(tr);
});

// Sends a message to the server via sockets
function sendMessageToServer(message) {
    socket.emit('request', message);
}

function sendPersonMessage() {
    sendMessageToServer($('#search_input').val());
}

// JQuery
$(() => {
    // Table search bar
    $("#myInput").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $("#tablebody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    // Icon for search input
    $("#search_input").on("keyup", function() {
        let value = $(this).val();
        let hasHttp = value.includes('http');
        let hasWww = value.includes('www');

        $("#input_icon").attr('class', hasHttp || hasWww ? 'fas fa-link' : 'fas fa-user');
    });
});