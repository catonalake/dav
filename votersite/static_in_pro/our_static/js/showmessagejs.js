function showMessage(message) {

// this isn't really working... not sure how to delete what was created
    var begin_ul = '<ul class="list-group">'
    var end_ul = '</ul>'
    var begin_li = '<li class="list-group-item list-group-item-success">'
    var end_li = '</li>'
    var message_len = message.length;
    var html_to_insert = begin_ul;
    for (var i = 0, el; i < message_len; i++) {
        html_to_insert = html_to_insert + begin_li + 
          message[i] + end_li;
    }
    html_to_insert = html_to_insert + end_ul; 
    return html_to_insert;

}; // end function showMessage

