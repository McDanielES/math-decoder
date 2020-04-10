$("#encryptAction").on("click", function() {
  $(this).parentsUntil(".inner-container").slideUp(200, function() {
    $(this).remove();
  });
  $("#output").css("display", "block");
  var difficulty = $("input[name='level']:checked").val();
  var message = $("input[name='message']").val();
  var problems = generateProblemSet(message.length);
  console.log(problems);

  // $("#eq").each(function( index ) {
  //   console.log( index + ": " + $( this ).text() );
  // });
  $("#eq").text("3+3=");
});

function generateProblemSet(length) {
  return length;
}