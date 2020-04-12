// Fill message box with demonstration silly samples.
var sillySample = ["Ex: The moon is made of cheese!",
                   "Ex: More ice cream for breakfast",
                   "Ex: I want more chores please!",
                   "Ex: Daddy snores in his sleep"];
$("#message").attr("placeholder", sillySample[Math.floor(sillySample.length * Math.random())]);

// Envoke most of the application on the press of the "Encrypt" button.
$("#encryptAction").on("click", function() {
  // Alert user that input field is empty
  if ($("input[name='message']").val() === "") {
    $("#inputRequired").css("display", "block");
    $("#inputRequired").html("<i class='fas fa-exclamation-triangle'></i> Don't forget to enter a sentence!");
  }
  else {
    // Remove the entire panel, instructions and interface. Show problem set
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
  }  
});

function generateProblemSet(length) {
  return length;
}