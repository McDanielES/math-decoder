$("#encrypt").on("click", function() {
  $(this).parentsUntil(".container").slideUp(200, function() {
    $(this).remove();
  });
});