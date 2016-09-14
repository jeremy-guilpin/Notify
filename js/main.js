
$(function() {

	$('button.btn.success').click(function(e) {
		Notify.success('Test Success');
		e.preventDefault();
	});
	
	$('button.btn.fail').click(function(e) {
		Notify.fail('Test Fail');
		e.preventDefault();
	});

});