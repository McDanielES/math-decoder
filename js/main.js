$("#encrypt").on("click", function() {
  $(this).parent().parent().parent().parent().parent().parent().slideUp(200, function() {
    $(this).remove();
  });
});