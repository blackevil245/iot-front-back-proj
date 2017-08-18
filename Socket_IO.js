const socket = io();

socket.on('NEW_LIGHT_DATA', function (data) {
	$("#light_value").html(data);
    log(message, {prepend: true});
  });

socket.on('NEW_HEAT_DATA', function (data) {
	$("#temp_value").html(data);
    log(message, {prepend: true});
  });

$('#fan_switch').change(function () {
    if ($(this).is(':checked')) {
		socket.emit('NEW_FAN_STATE', 1);
        console.log($(this).val() + ' is now checked');
    } else {
        socket.emit('NEW_FAN_STATE', 0);
		console.log($(this).val() + ' is now unchecked');
    }
});
