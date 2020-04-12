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


    $(".row").last().append().html("<div class='col-xl-4 col-md-6 col-sm-12 border-right border-dark equations'>    <p><span id='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");

    $("#eq").append((firstTerm + "+" + problems.solution[0] + "="));
    (firstTerm + "+" + problems.solution[0] + "=");

    $(".row").last().append().html("<div class='col-xl-4 col-md-6 col-sm-12 border-right border-dark equations'>    <p><span id='eq'></span><span class='underline'> &nbsp; &nbsp; </span></p>  </div>");

    $("#eq").append((another + "+" + problems.solution[1] + "="));
    (another + "+" + problems.solution[1] + "=");

    // $("div").last().parent().append(another + "+" + problems.solution[1] + "=").addClass("col-xl-4 col-md-6 col-sm-12 border-right border-dark equations");
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