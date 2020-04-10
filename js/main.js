$("#encryptAction").on("click", function() {
  $(this).parentsUntil(".inner-container").slideUp(200, function() {
    $(this).remove();
  });
  var difficulty = $("input[name='level']:checked").val();
  var message = $("input[name='message']").val();
});