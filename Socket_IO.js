socket.on('', function (data) {
	$("#light_value").html(data);
    log(message, {prepend: true});
  });

socket.on('', function (data) {
	$("#temp_value").html(data);
    log(message, {prepend: true});
  });

//socket.on('', function (data) {
  //  log(message, {prepend: true});
  //});

$('#fan_switch').change(function () {
    if ($(this).is(':checked')) {
		socket.emit();
        console.log($(this).val() + ' is now checked');
    } else {
        socket.emit();
		console.log($(this).val() + ' is now unchecked');
    }
});

//socket.emit();