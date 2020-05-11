$(document).ready(function() {
  $('#inputPassword').keyup(function() {
    $('#admin-password-progress-bar').html(checkStrength($('#inputPassword').val()))
  });

  function checkStrength(password) {
    var strength = 0;

    if (password.length < 1) {
      strength = 0;
    }

    if (password.length > 1) {
      strength += 1;
    }
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 1;
    }
    // If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
      strength += 1;
    }
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    // If it has two special characters, increase strength value.
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    // Calculated strength value, we can return messages
    if (strength == 0) {
      $('#admin-password-progress-bar').removeClass();
      return '';
    }

    if (strength < 2) {
      $('#admin-password-progress-bar').removeClass();
      $('#admin-password-progress-bar').addClass('progress-bar weak');
      return 'Weak';
    }
    else if (strength == 2) {
      $('#admin-password-progress-bar').removeClass();
      $('#admin-password-progress-bar').addClass('progress-bar good');
      return 'Good';
    }
    else {
      $('#admin-password-progress-bar').removeClass();
      $('#admin-password-progress-bar').addClass('progress-bar strong');
      return 'Strong';
    }
  }
});
