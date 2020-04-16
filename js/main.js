/**
 * @title        Math Decoder
 * @fileOverview The JavaScript/jQuery button action event logic script and all supporting
 *               helper functions. Made for the Math Decoder web application to generate
 *               mathematical expressions and corresponding letters for kids to decrypt
 *               secret messages that had been encrypted. 
 * @author       Eric McDaniel, April 2020
 * @version      1.0.1
 */

// Global variables and constants initialized at startup.
const demoExamples = ["Ex: The moon is made of cheese!",
                      "Ex: More ice cream for breakfast",
                      "Ex: I want more chores please!",
                      "Ex: Daddy snores in his sleep",
                      "Ex: The dog really ate my homework"];
const operations    = ["+", "-", "*", "/"];
const solutionRange = [1.5, 5.0, 5.0];
var   message       = "";
var   difficulty;

$("#message").attr("placeholder", demoExamples[Math.floor(demoExamples.length * Math.random())]);

/**
 *                           #encryptAction - The Main Focus
 * Invoke the main action event of the application on the press of the "Encrypt" button.
 */
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
    difficulty = Number($("input[name='level']:checked").val());
    message = $("input[name='message']").val().toUpperCase();

    var problems = generateProblemSet();
    var shuffled = printProblemSet(problems);
    printAnswerBubble(problems, shuffled);
  }  
});

function generateProblemSet() {
  // Instantiate empty "problems" object with parallel arrays
  var problems = {
    // letter: shuffle(Array.from(message)),
    letter: Array.from(message),
    firstTerm: [],
    operation: [],
    secondTerm: [],
    solution: []
  };
  populateOperations(problems);

  if (difficulty < 3) {
    populateAddSubtractSolutions(problems);
    populateTerms(problems);
  }

  return problems;
}

/**
 * Starts with the end in mind by generating the final answer first with a factor of a 
 * constant on the difficulty level chosen.
 * 
 * @param {Object} problems 
 */
function populateAddSubtractSolutions(problems) {
  for (var i = 0; i < message.length; i++) {
    do {
      var newSol = Math.floor(message.length * solutionRange[difficulty - 1] * Math.random());
    } while (problems.solution.includes(newSol))
    // A unique, non-repeated solution is found, push to the array and continue.
    problems.solution.push(newSol);
  }
}

/**
 * Generates the remaining terms for the first and second difficulty levels. The terms are
 * randomly generated from a number less than the original solution provided. The second term is
 * the difference of the solution and the first term. Looping until the random seed is > 0.5 is
 * necessary to prevent negative differences.
 * 
 * @param {Object} problems 
 */
function populateTerms(problems) {
  console.log("Printed List for Debugging Purposes. This does not alter performance of application.");
  for (var i = 0; i < message.length; i++) {
    // if the problem set is addition, take the difference of the solution and the first term
    if (problems.operation[i] === operations[0]) {
      problems.firstTerm.push(Math.floor(Math.random() * problems.solution[i]));
      problems.secondTerm.push(problems.solution[i] - problems.firstTerm[i]);
    }
    else {
      // loop through seeds until an outcome above 0.5 is made, which can't guarantee a
      var rand = -1;                        // negative difference. Push to the array.
      do {
        rand = Math.random();
      } while (rand < 0.5);
      problems.firstTerm.push(Math.floor(rand * 2 * problems.solution[i]));
      problems.secondTerm.push(problems.firstTerm[i] - problems.solution[i]);
    }
    
    // Printed List for Debugging Purposes
    if (problems.letter[i] !== " ")
      console.log(problems.letter[i] + " ||| " + problems.firstTerm[i] + " "
          + problems.operation[i] + " " + problems.secondTerm[i] + " = " + problems.solution[i]);
  }
}

/**
 * A random collection of +, -, *, and / operations are created and pushed into the operations
 * array of the problems object. The user's difficulty level is taken into account, omitting
 * the latter multiplication and division operations.
 * 
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
 */
function populateOperations(problems) {  
  for (var i = 0; i < message.length; i++) {
    problems.operation.push( (difficulty === 3) ? 
                              operations[Math.floor(Math.random() * (operations.length - 2)) + 2] :
                              operations[Math.floor(Math.random() * (operations.length - 2))]);
  }
}

function printProblemSet(problems) {
  // Copy the letters from the problem set into new variable in order to shuffle them without
  // losing memory of the original string.
  var shuffled = {
    letter: shuffle(Array.from(message)),
  };

  // Iterate through each shuffled letter, skipping spaces, and use DOM manipulation to add a new
  // div and fill it contents with the created math expressions.
  for (var i = 0; i < message.length; i++) {
    if (shuffled.letter[i] === " ")
      continue;
    $(".row").append("<div class='col-xl-4 col-md-4 col-sm-12 equations px-0'><p><span class='letter'></span><span class='eq'></span><span class='underline'>＿</span></p></div>");
    $(".letter").last().text(shuffled.letter[i]);
    $(".eq").last().text(problems.firstTerm[i] + problems.operation[i] + problems.secondTerm[i] + "=");
  }
  return shuffled;
}

function printAnswerBubble(problems, shuffled) {
  $("#output").append("<div class='row'></div>");
  $(".row").last().append("<div class='col-xl-1 col-md-1 col-sm-12 mt-3'></div>");
  $(".row").last().append("<div id='answerLabel' class='col-xl-10 col-md-10 col-sm-12 mt-3'><p>Answer Key</p><div class='row'></div></div>");
  $(".row").last().css("padding-top", "15px");
  $(".row").last().append("<div class='col-xl-12 col-sm-12 mt-3 mx-0 px-0'></div>");
  var i = 0;
  console.log($(window).width() );
  while (i < message.length) {
      if (problems.letter[i] == " ") {
        $(".col-xl-12").last().append("<span class='noOverline'> </span>");
      }
      var char = (problems.letter[i] == " ") ? null : (problems.solution[i]);
      if (char !== null)
        $(".col-xl-12").last().append("<span class='answerLetter'>" + char + "</span>");
      i++;
    }
}

/**
 * A recreation of the famous Fisher-Yates (aka Knuth) Shuffle Algorithm, because why
 * reinvent the wheel if it works well. This is a generic helper function to shuffle the letters
 * around and not make the message easy to solve.
 * 
 * @param Array arr the original array presorted
 * @return arr the modified array after it is shuffled
 */
function shuffle(arr) {
  var current = arr.length, tempVal, rand;
  while (0 !== current) {
    rand = Math.floor(Math.random() * current);
    current -= 1;
    tempVal = arr[current];
    arr[current] = arr[rand];
    arr[rand] = tempVal;
  }
  return arr;
}