/**
 * @title        Math Decoder
 * @fileOverview The JavaScript/jQuery button action event logic script and all supporting
 *               helper functions. Made for the Math Decoder web application to generate
 *               mathematical expressions and corresponding letters for kids to decrypt
 *               secret messages that had been encrypted. 
 * @author       Eric McDaniel, April 2020
 * @version      1.0.2
 */

// Global variables and constants initialized at startup.
const demoExamples = ["Ex: The moon is made of cheese!",
                      "Ex: More ice cream for breakfast",
                      "Ex: I want more chores please!",
                      "Ex: Daddy snores in his sleep",
                      "Ex: The dog really ate my homework",
                      "Ex: No more monkeys jumping!"];
$("#message").attr("placeholder", demoExamples[Math.floor(demoExamples.length * Math.random())]);
const operations    = ["+", "-", "×", "÷"];
const colors        = ["#bb4455", "#2d3eb1", "#3d723a", "#bf6919"];
const solutionRange = [1.5, 10, 1, 3];
var   solutionsMap  = [];
var   message       = "";
var   difficulty;

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
    $(this).parentsUntil(".inner-container").slideUp(300, function() {
      $(this).remove();
    });

    // Show problem set
    $("#output").css("display", "block");
    $("#promptAtTop").text($("input[name='prompt']").val());
    if ($("input[name='prompt']").val().length === 0)
    $("#promptAtTop").css("visibility", "collapse");

    // Update global scope variables with user-provided input
    difficulty = Number($("input[name='level']:checked").val());
    message = $("input[name='message']").val().toUpperCase();

    var problems = generateProblemSet();
    printProblemSet(problems);
    printAnswerBubble(problems);
  }  
});

/**
 * Builds a new problem set by doing so piece by piece, where the values are kept
 * in parallel arrays, and its construction is dependant on difficulty level. Addition
 * and subtraction problems work backwards generating a solution first and randomly place
 * appropriate values that work, and multiplication/ division problems work inversely.
 * 
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
 */
function generateProblemSet() {
  // Instantiate empty "problems" object with parallel arrays
  var problems = { 
    letter: Array.from(message),
    firstTerm:  [],
    operation:  [],
    secondTerm: [],
    solution:   []
  };
  
  generateSolutionsMap();
  populateOperations(problems);
  if (difficulty < 3) {
    populateAddSubtractSolutions(problems);
    populateAddSubtractTerms(problems);
  }
  else {
    populateMultiDivideProblems(problems);
  }
  return problems;
}

/**
 * Starts with the end in mind by generating the final answer first with a factor of a 
 * constant on the difficulty level chosen.
 * 
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
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
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
 */
function populateAddSubtractTerms(problems) {
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
 * Generates both the problems and solution sets for multiplication and division problems.
 * Random numbers between 0 and 15 are generated for multiplication, and the first digit
 * is continuously incremented until a unique solution is found if the original solution
 * already exists in the solution set. A similar approach is used for division, however
 * with modulo operation. The numbers are added to the problems object.
 * 
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
 */
function populateMultiDivideProblems(problems) {
  console.log("Printed List for Debugging Purposes. This does not alter performance of application.");
  var first, second;

  for (var i = 0; i < message.length; i++) {
    if (problems.operation[i] === "×") {
      first = (Math.floor(Math.random() * 15 * solutionRange[difficulty - 1]));
      second = (Math.floor(Math.random() * 15 * solutionRange[difficulty - 1]) + 1);
      // Increment the first value until the solution is unique in the solution set array
      while (problems.solution.includes(first * second)) {
        first++;
      }
      problems.solution[i] = first * second;
    }
    else {
      // Division
      do {
        first = (Math.floor(Math.random() * 120 * solutionRange[difficulty - 1]));
        second = (Math.floor(Math.random() * 9 * solutionRange[difficulty - 1]) + 1);
        while (first % second !== 0) {
          first++;
        } // Repeat this entire process if the value was found in the solution set.
      } while (problems.solution.includes(first / second));
      problems.solution[i] = first / second;
    }
    // Add remaining terms to problems object
    problems.firstTerm[i] = first;
    problems.secondTerm[i] = second;

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
    problems.operation.push( (difficulty > 2) ? 
                              operations[Math.floor((Math.random() * 0.85) * (operations.length - 2)) + 2] :
                              operations[Math.floor(Math.random() * (operations.length - 2))]);
  }
}

/**
 * Prints out the formatted problem set, mapped with their corresponding shuffled counterparts,
 * into the document window. Spaces are kept blank by discarding the problem entirely. ¯\_(ツ)_/¯
 * 
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
 */
function printProblemSet(problems) {
  // Iterate through each shuffled letter, skipping spaces, and use DOM manipulation to add a new
  // div and fill it contents with the created math expressions.
  // Use the solutionsMap global variable to key-value map the real value with a shuffled value.
  for (var i = 0; i < message.length; i++) {
    if (problems.letter[solutionsMap[i]] === " ")
      continue;
    $(".row").append("<div class='col-xl-4 col-md-4 col-sm-12 equations px-0'><p><span class='letter'></span><span class='eq'></span><span class='underline'>＿</span></p></div>");
    $(".letter").last().text(problems.letter[solutionsMap[i]]);
    $(".letter").last().css("color", colors[Math.floor(Math.random() * colors.length)]);
    $(".eq").last().text(problems.firstTerm[solutionsMap[i]] + problems.operation[solutionsMap[i]] + problems.secondTerm[solutionsMap[i]] + "=");
  }
}

/**
 * Prints out the answer bubble at the bottom with the solutions with the overbar to allow the
 * corresponding letter to be written above. Spaces have no overbar.
 * 
 * @param {Object} problems the complete set of problems including all terms, solutions, and
 *                          assigned letters.
 */
function printAnswerBubble(problems) {
  $("#output").append("<div class='row'></div>");
  $(".row").last().append("<div class='col-xl-1 col-md-1 col-sm-12 mt-3'></div>");
  $(".row").last().append("<div id='answerLabel' class='col-xl-10 col-md-10 col-sm-12 mt-3'><p>Answer Key</p><div class='row'></div></div>");
  $(".row").last().css("padding-top", "15px");
  $(".row").last().append("<div class='col-xl-12 col-sm-12 mt-3 mx-0 px-0'></div>");
  var i = 0;
  while (i < message.length) {
      if (problems.letter[i] == " ") {
        $(".col-xl-12").last().append("<span class='noOverline'> </span>");
      }
      var char = (problems.letter[i] == " ") ? null : (problems.solution[i]);
      if (char !== null)
        $(".col-xl-12").last().append("<span class='answerLetter'>" + formatNumber(char) + "</span>");
      i++;
    }
}

/**
 * A helper function that creates the global solutions map using the Fisher-Yates
 * shuffle function below.
 */
function generateSolutionsMap() {
  var map = [];
  for (var i = 0; i < message.length; i++) {
    map.push(i);
  }
  solutionsMap = shuffle(map);
}

/**
 * A recreation of the famous Fisher-Yates (aka Knuth) Shuffle Algorithm, because why
 * reinvent the wheel if it works well. This is a generic helper function to shuffle the letters
 * around and not make the message easy to solve.
 * 
 * @param arr arr the original array presorted
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

/**
 * A helper function that uses regular expressions to format the argument, assumed to
 * be a number, to have a comma after every three digits, such as 1,000.
 * 
 * @param {String} num 
 */
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}