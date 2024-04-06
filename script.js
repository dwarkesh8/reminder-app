$(document).ready(function() {
  // Set the default date value to the current date
  var currentDate = new Date().toISOString().split('T')[0];
  $('#reminderDate').val(currentDate);
  
  $('#reminderForm').submit(function(event) {
    event.preventDefault();
    
    var date = $('#reminderDate').val();
    var time = $('#reminderTime').val();
    var intervalMinutes = parseInt($('#intervalMinutes').val());
    
    // Ensure that at least one input is provided
    if (!time && (isNaN(intervalMinutes) || intervalMinutes <= 0)) {
      alert("Please enter a valid time or interval.");
      return;
    }
    
    var reminderText = "Hello {$userName} It's time for your break!";
    
    // Calculate the time for the first reminder
    var firstReminderDateTime = new Date(date + 'T' + time);
    
    // Set the reminder for the first time
    setReminder(firstReminderDateTime, intervalMinutes, reminderText);
    
    // Display confirmation message
    alertify.success('Reminder has been set!');
  });
  
  function setReminder(dateTime, intervalMinutes, reminderText) {
    // Get the current date and time
    var now = new Date();
    
    // Calculate the time difference between now and the selected time
    var timeDiff = dateTime.getTime() - now.getTime();
    
    // If the selected time is in the past, adjust it to the next occurrence
    if (timeDiff <= 0) {
      var minutesToAdd = Math.ceil(Math.abs(timeDiff) / (1000 * 60));
      dateTime.setMinutes(dateTime.getMinutes() + minutesToAdd);
      timeDiff = dateTime.getTime() - now.getTime();
    }
    
    // Set the reminder to trigger after the calculated time difference
    setTimeout(function() {
      // Show the reminder alert
      alertify.alert(reminderText, function() {
        // Show success message
        alertify.success('Reminder acknowledged!');
      });
      
      // If interval is specified, set the next reminder
      if (!isNaN(intervalMinutes) && intervalMinutes > 0) {
        setReminder(new Date(new Date().getTime() + intervalMinutes * 60000), intervalMinutes, reminderText);
      }
    }, timeDiff);
    
    // Update the countdown timer every second
    updateCountdown(dateTime);
    setInterval(function() {
      updateCountdown(dateTime);
    }, 1000);
  }
  
  function updateCountdown(endTime) {
    var now = new Date().getTime();
    var distance = endTime.getTime() - now;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var countdownElement = document.getElementById("countdown");
    if (distance < 0) {
      countdownElement.innerHTML = "EXPIRED";
    } else {
      countdownElement.innerHTML = "Next reminder in: " + hours + "h " + minutes + "m " + seconds + "s ";
    }
  }
});
