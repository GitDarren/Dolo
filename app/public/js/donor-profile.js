$(document).ready(function () {

  //================DONOR PROFILE DATA TO POPULATE DOM ============================================
  //===============================================================================================

  $.get("/api/user_data").then(function (data) {
    $(".user-name").text(data.name);
    $(".user-city").text(data.city);
    $(".user-state").text(data.state);
    $(".user-email").text(data.email);
    $(".user-phone").text(data.phone);
    $(".user-street").text(data.street);
    $(".user-zip").text(data.zip);
    console.log("The user data is: ", data);
  });



  //================DONOR PROFILE PAGE - WE HAVE OUR DONATIONS & A FORM TO ADD MORE================
  //===============================================================================================
  // myDonationsContainer holds all of our donated items
  var myDonationsContainer = $(".donations-container");
  
  // Click events for donation edit and delete buttons -call edit/deleted functions
  $(document).on("click", "a.donationDelete", handleDonationDelete);

  // $(document).on("click", "a.donationEdit", handleDonationEdit);
 $(document).on("click", "a.donationEdit", handleDonationEdit);

  // hold individual items
  var donations;
  //fix later TODO
  var currentId;


  // Sets a flag for whether or not we're updating a donation to be false initially
  var updating = false;

  // grabs donations from the database and updates the view
  // if there are none, call displayEmptyDonations to show message to user
  function getDonations() {
    $.get("/api/donations/", function (data) {
      console.log("Donations", data);
      donations = data;
      if (!donations || !donations.length) {
        displayEmptyDonations();
      }
      else {
        initializeDonationsRows();
      }
    });
  }

  // Getting the list of user's donations
  //=====================================
  getDonations();

  // initializeDonationsRows handles appending all of our constructed donation HTML inside
  // myDonationsContainer
  function initializeDonationsRows() {
    myDonationsContainer.empty();
    var donationToAdd = [];
    for (var i = 0; i < donations.length; i++) {
      donationToAdd.push(createNewDonationRow(donations[i]));
    }
    myDonationsContainer.append(donationToAdd);
  }

  //============BUILD OUT INDIVIDUAL DONATIONS INTO .donations-container==========
  // construct a donation's HTML
  // need to work in image thumbnail
  //===========================================
  function createNewDonationRow(donation) {
    console.log("donation object " + donation);
    console.log("donation id " + donation.id);

     var $newDonationRow =  $('.donations-container').append(`
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
              <div class="level-left">
                <a class="level-item donationEdit" data="${donation.id}">
                  <span class="icon is-small"><i class="edit fa fa-edit" ></i></span>Edit
                </a>
                <!-- <p>Edit</p> -->
              </div>
              <div class="level-right">
              <a class="level-item donationDelete" data="${donation.id}">
                <span class="icon is-small"><i class="fa fa-trash"></i></span>Delete
              </a>
            </div>
            </nav>
          </div>
        </article>
      `); 
      // $newDonationRow.find("a.donationDelete").data("id", donation.id);
      
      // $newDonationRow.find("a.donationEdit").data("id", donation.id);
      return $newDonationRow;
  };

  // Getting jQuery references to the name, description, image, form, and category select
  var nameInput = $("input#donation-name");
  var descriptionInput = $("textarea#donation-description");
  var imgUpload = $("donation-image");
  var donationForm = $("#donation-form");
  var donationCategorySelect = $("select#donation-category");
  var updating = false;

  //===========================Click Event - Submit Form==========================
  // contains logic for new donation and update existing donation
  donationForm.on("submit", function handleFormSubmit(event) {
    console.log('clicked form submit');
    console.log("name " + nameInput.val() );
    console.log("desc " + descriptionInput.val() );
    console.log("category id " + donationCategorySelect.val() );

    event.preventDefault();
    // Wont submit the donation if we are missing a name or description
    if (!nameInput.val() || !descriptionInput.val()) {
      console.log('no name or description! try again');
      return;
    }
    // Constructing a newDonation object to hand to the database
    var newDonation = {
      name: nameInput.val(),
      description: descriptionInput.val(),
      item_categoryID: parseInt(donationCategorySelect.val()),
      type: "material",
      id: currentId
      //image: imgUpload //??????????????????????????
    };

    console.log("new donation is below");
    console.log(newDonation);

    // If we're updating a donation run updateDonation
    // Otherwise run submitDonation to create a new donation
    if (updating) {

      console.log("donation ID = " + currentId);
      updateDonation(newDonation);
    }
    else {
      submitDonation(newDonation);
    }
  
});
  //===========================END - Submit Form==========================



  // ===========================NEW DONATION==============================
  // Submit a new donation
  function submitDonation(Donation) {
    console.log("function submitDonation is running");
    $.post("/api/donations", Donation, function() {
      // call getDonations to print all user donations to DOM
      getDonations();
      nameInput.val("");
      descriptionInput.val("");
    });
  }
  // ======================END - NEW DONATION========================



  //==========================UPDATE DONATION========================
  // figure out donation id we want to edit 
  function handleDonationEdit() {
    console.log($(this).attr("data"));
    // var editThisDonationId = $(this).data("id");
    var editThisDonationId = $(this).attr("data")
    getDonationData(editThisDonationId);
     
  }

  // Gets donation data if we're editing
  function getDonationData(id) {
    console.log("Updating ID # id " + id);
    $.get("/api/donations/" + id, function(data) {
      if (data) {
        console.log("this is the donation to update" + data);
        
        // If this donation exists, prefill our forms with its data
        console.log("name " + data.name );
        console.log("desc " + data.description );
        console.log("category id " + data.item_categoryID );

        nameInput.val(data.name);
        descriptionInput.val(data.description);
        donationCategorySelect.val(data.item_categoryID);
        //donationID from backend get request
        currentId = id;
        //imgUpload //??????????????????????????
       
        updating = true;
      }
    });
  }

  // Update a given donation, bring user to the donations page when done
  function updateDonation(item) {
    console.log("ITEM is below");
    console.log(item);
    $.ajax({
      method: "PUT",
      url: "/api/donations/:" + item.currentId,
      data: item
    })
    .then(function() {
      getDonations();
      nameInput.val("");
      descriptionInput.val("");
    });
  }
  //========================== END - UPDATE DONATION========================
 

  //==============================DELETE DONATION============================
  // figure out which donation we want to delete and then calls
  // deleteDonation
  function handleDonationDelete() {
    // console.log(this);
    console.log($(this).attr("data"));
    var deleteThisDonationId = $(this).attr("data");
    
    deleteDonation(deleteThisDonationId);
  }

  // This function does an API call to delete donation
  // then calls function getDonations to re-write all remaining donations to DOM
  function deleteDonation(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/donations/" + id
    })
      .then(function () {
        getDonations();
      });
  }
  //==============================END - DELETE DONATION========================


  // displays a message when there are no donations to list on the DOM
  function displayEmptyDonations() {
    console.log("Donations do not exist");
    myDonationsContainer.empty();
    var messageDonor = $("<h2>");
    messageDonor.css({ "text-align": "center", "margin-top": "50px" });
    messageDonor.html("Local organizations are in need! Post a donation.");
    myDonationsContainer.append(messageDonor);
  }


});