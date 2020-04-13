// Fill message box with demonstration silly samples
var sillySample = ["Ex: The moon is made of cheese!",
                   "Ex: More ice cream for breakfast",
                   "Ex: I want more chores please!",
                   "Ex: Daddy snores in his sleep"];
var operations = ["+", "-", "*", "/"];
var solutionRange = [1.5];
var message = "";
var difficulty;

$("#message").attr("placeholder", sillySample[Math.floor(sillySample.length * Math.random())]);

// Invoke most of the application on the press of the "Encrypt" button
$("#encryptAction").on("click", function() {
  // Alert user that input field is empty
  if ($("input[name='message']").val() === "") {
    $("#inputRequired").css("display", "block");
    $("#inputRequired").html("<i class='fas fa-exclamation-triangle'></i> Don't forget to enter a message!");
  }
  else {
    // Remove the entire panel, instructions and interface
    $(this).parentsUntil(".inner-container").slideUp(200, function() {
      $(this).remove();
    });

    // Show problem set
    $("#output").css("display", "block");
    $("#promptAtTop").text($("input[name='prompt']").val());

    // Update global scope variables with user-provided input
    difficulty = $("input[name='level']:checked").val();
    message = $("input[name='message']").val();

    var problems = generateProblemSet();


    var firstTerm = Math.floor(10 * Math.random());
    var another = Math.floor(10 * Math.random());

    $(".row").append("<div class='col-xl-4 col-md-6 col-sm-12 equations'>    <p><span class='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");
    $(".eq").last().text((1 + "+" + 2 + "="));

    $(".row").append("<div class='col-xl-4 col-md-6 col-sm-12 equations'>    <p><span class='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");
    $(".eq").last().text((3 + "+" + 4 + "="));

    $(".row").append("<div class='col-xl-4 col-md-6 col-sm-12 equations'>    <p><span class='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");
    $(".eq").last().text((5 + "+" + 6 + "="));

    $(".row").append("<div class='col-xl-4 col-md-6 col-sm-12 equations'>    <p><span class='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");
    $(".eq").last().text((7 + "+" + 8 + "="));

    $(".row").append("<div class='col-xl-4 col-md-6 col-sm-12 equations'>    <p><span class='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");
    $(".eq").last().text((9 + "+" + 10 + "="));

    $(".row").append("<div class='col-xl-4 col-md-6 col-sm-12 equations'>    <p><span class='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");
    $(".eq").last().text((11 + "+" + 12 + "="));

  }  
});

function generateProblemSet() {
  // Instantiate empty "problems" object with parallel arrays
  var problems = {
    firstTerm: [],
    operation: [],
    secondTerm: [],
    solution: []
  };
  populateUniqueSolutions(problems);

  return problems;
}

function populateUniqueSolutions(problems) {
  for (var i = 0; i < message.length; i++) {
    var newSol = Math.floor(message.length * solutionRange[difficulty - 1] * Math.random());
    while (problems.solution.includes(newSol)) {
      var newSol = Math.floor(message.length * solutionRange[difficulty - 1] * Math.random());
    }
    problems.solution.push(newSol);
  }
  return problems;
}