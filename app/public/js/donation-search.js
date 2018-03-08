$(document).ready(function () {

  //This file just does a GET request to figure out which user is logged in
  //and updates the HTML on the page

  $.get("/api/user_data").then(function (data) {
    $(".user-name").text(data.name);
    console.log("The user name is: ", data);
  });

  //========================ORG SEARCHES FOR DONATIONS - SEARCH BY CATEGORY======================
  //===============================================================================================

  // holds all donations
  var availableDonationsContainer = $("#available-donations-container");
  //console.log("Requests", data);

  // Donation category user selects from dropdown
  var donationCategorySelect = $("#donation-category");

  // call function donationCategorySelect on category change
  donationCategorySelect.on("change", handleDonationCategoryChange);

  // hold individual items
  var donations;

  // This function handles reloading new donations when category changes
    function handleDonationCategoryChange() {
      var newDonationCategory = parseInt(($(this).val()));
      console.log("is this a category? " +  parseInt(($(this).val())));
      getDonations(newDonationCategory);
    }


  // grab donations by category from database and updates the view
  //***Needs to be by catergoryID***
  // if there are none, call displayEmptyDonations to show message to user
  function getDonations(categoryID) {
    console.log("in function getDonations - by category: " + categoryID)
    $.get("/api/donations/" + categoryID, function (data) {
      console.log("Donations::: ", data);
      donations = data;
      console.log(donations);

      if (!donations || !donations.length) {
        displayEmptyDonations();
      }
      else {
        initializeDonationsRows();
      }
    });
  }

  // initializeDonationsRows handles appending all of our constructed donations HTML inside
  function initializeDonationsRows() {
    console.log(donations);

    availableDonationsContainer.empty();
    var donationToAdd = [];
    for (var i = 0; i < donations.length; i++) {
      donationToAdd.push(createNewDonationRow(donations[i]));
    }
    availableDonationsContainer.append(donationToAdd);
  }

  //============BUILD OUT INDIVIDUAL DONATIONS==========
  // construct a request's HTML
  // need to work in image thumbnail
  // Need 'Claim It!' button
  //===========================================
  function createNewDonationRow(donation) {
    console.log("donation object " + donation.name);
    console.log("donation id " + donation.id);

     var $newDonationRow =  $('#available-donations-container').append(`
          <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img src="http://placehold.it/128x128" alt="Image">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Item:</strong> <small>${donation.name}</small><small style="float:right;">1m</small>
                <br>
                <small>${donation.description}</small>
              </p>
            </div>
            <nav class="level">
                <div class="level-right">
                   <a class="button is-small is-info" href="#">Contact</a>
                 </div>
            </nav>

          </div>
        </article>
      `); 
    
      return $newDonationRow;
  };


 // displays a message when there are no donations to list on the DOM
 function displayEmptyDonations() {
  console.log("Donations do not exist");
  availableDonationsContainer.empty();
  var messageDonor = $("<h2>");
  messageDonor.css({ "text-align": "center", "margin-top": "50px" });
  messageDonor.html("Sorry, there are no donations available in this category. Choose another!");
  availableDonationsContainer.append(messageDonor);
}

});
