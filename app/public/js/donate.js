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

  $(document).on("click", "a.donationEdit", handleDonationEdit);

  // hold individual items
  var donations;
  //fix later TODO
  var currentId;
  
  var newDonation;
  // Sets a flag for whether or not we're updating a donation to be false initially
  var updating = false;

   // for testing: set uid to 3
   var donorUID = 3;

  //do we have a current user?
  // function getUserID() {
  //   $.get("/api/user_data", function (data) {
  //     console.log("do we have user data? : ", data);
  //     donorUID = data.id;
  //   });
  // }
  // getUserID();
  
 

  // grabs donations from the database and updates the view
  // if there are none, call displayEmptyDonations to show message to user
  function getDonations(donorUID) {
    $.get("/api/donations/" + donorUID, function (data) {
      console.log("Donations", data);
      console.log(data.id);

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
  getDonations(donorUID);

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
    console.log("donation object " + donation.name);
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
    console.log("donation id " + currentId );


    event.preventDefault();
    // Wont submit the donation if we are missing a name or description
    if (!nameInput.val() || !descriptionInput.val()) {
      console.log('no name or description! try again');
      return;
    }
    // Constructing a newDonation object to hand to the database
    newDonation = {
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
      console.log(updating);

      console.log("donation ID = " + currentId);
      updateDonation(newDonation);
      console.log("we just updated");

    }
    else {
      submitDonation(newDonation);
      console.log('adding new donation');
    }
  
});
  //===========================END - Submit Form==========================



  // ===========================NEW DONATION==============================
  // Submit a new donation
  function submitDonation(Donation) {
    console.log("function submitDonation is running");
    $.post("/api/donations/" + 3, Donation, function() {
      console.log("donor ID " + donorUID);
      // call getDonations to print all user donations to DOM
      nameInput.val("");
      descriptionInput.val("");
      getDonations(donorUID);
    });
  }
  // ======================END - NEW DONATION========================



  //==========================UPDATE DONATION========================
  // figure out donation id we want to edit 
  function handleDonationEdit() {
    console.log("this is the itemID " + $(this).attr("data"));
    var editThisDonationId = $(this).attr("data")
    getDonationData(editThisDonationId);
     
  }

  // Gets donation data if we're editing
  function getDonationData(id) {
    console.log("Updating ID # " + id);
    $.get("/api/donations/id/" + id, function(data) {
      if (data) {
        console.log(data);
        
        //If this donation exists, prefill our forms with its data
        console.log(data );
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

  // Update a given donation, then re-load all donations
  function updateDonation(item) {
    console.log("ITEM is below");
    console.log(item);
    console.log("this is the donation id " + item.id);
    $.ajax({
      method: "PUT",
      url: "/api/donations/id/" + item.id,
      data: item
    })
    .then(function() {
      getDonations(donorUID);
      nameInput.val("");
      descriptionInput.val("");
      currentId = null;
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
        getDonations(donorUID);
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