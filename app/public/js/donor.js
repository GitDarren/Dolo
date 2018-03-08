$(document).ready(function () {

  //This file just does a GET request to figure out which user is logged in
  //and updates the HTML on the page

  $.get("/api/user_data").then(function (data) {
    $(".user-name").text(data.name);
    $(".user-city").text(data.city);
    console.log("The user data is: ", data);
  });

  // $.get("/api/user_data").then(function (data) {
  //   $(".user-city").text(data.city);
  //   console.log("The user city is: ", data);
  // });


  //=======These are our 2 main HTML containers to display a list of donations or requests=========
  //===============================================================================================
  // myDonationsContainer holds all of our donated items
  var myDonationsContainer = $(".donations-container");
  // orgRequestsContainer holds all of Org's requests
  var orgRequestsContainer = $(".requests-container");
  
  // click event for adding new donation - handleNewDonation will fire modal form
  $(document).on("click", "button.newDonation", handleNewDonation);

  // Org category user selects from dropdown
  var orgCategorySelect = $("#category");

  // Click events for donation edit and delete buttons -call edit/deleted functions
  $(document).on("click", "button.delete", handleDonationDelete);
  // ***clicking edit will fire modal form
  $(document).on("click", "button.edit", handleDonationEdit);

  // call function handleOrgCategoryChange on category change
  orgCategorySelect.on("change", handleOrgCategoryChange);

  // hold individual items
  var donations;
  var requests;

  // Sets a flag for whether or not we're updating a donation to be false initially
  var updating = false;

  // grabs donations from the database and updates the view
  // if there are none, call displayEmptyDonations to show message to user
  function getDonations() {
    $.get("/api/donations", function (data) {
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

    // This function handles reloading new requests/needs when Org category changes
    function handleOrgCategoryChange() {
      var newOrgCategory = $(this).val();
      getRequests(newOrgCategory);
    }
  });

  // grabs Org requests/needs by category from database and updates the view
  //***Needs to be by catergoryID***
  // if there are none, call displayEmptyRequests to show message to user
  function getRequests(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/requests" + categoryString, function (data) {
      console.log("Requests", data);
      requests = data;
      if (!requests || !requests.length) {
        displayEmptyRequests();
      }
      else {
        initializeRequestsRows();
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

  // initializeRequestsRows handles appending all of our constructed requests/needs HTML inside
  // orgNeedsContainer
  function initializeRequestsRows() {
    orgNeedsContainer.empty();
    var requestsToAdd = [];
    for (var i = 0; i < requests.length; i++) {
      requestsToAdd.push(createNewRequestRow(requests[i]));
    }
    orgNeedsContainer.append(requestsToAdd);
  }

  //============BUILD OUT INDIVIDUAL DONATIONS INTO .donations-container==========
  // construct a donation's HTML
  // need to work in image thumbnail
  //===========================================
  function createNewDonationRow(item) {
    var newDonationPanel = $("<div>");
    newDonationPanel.addClass("panel panel-default");
    var newDonationPanelHeading = $("<div>");
    newDonationPanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newDonationName = $("<h2>");
    var newDonationDate = $("<small>");
    
    newDonationName.text(donation.name + " ");
    var formattedDate = new Date(donation.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newDonationDate.text(formattedDate);
    newDonationName.append(newDonationDate);
    newDonationPanelHeading.append(deleteBtn);
    newDonationPanelHeading.append(editBtn);
    newDonationPanelHeading.append(newDonationName);
    newDonationPanel.append(newDonationPanelHeading);
    newDonationPanel.data("donation", donation);
    return newDonationPanel;
  }

  //============BUILD OUT INDIVIDUAL REQUETS INTO .requests-container==========
  // construct a request's HTML
  // need to work in image thumbnail
  // Need 'Claim It!' button
  //===========================================
  function createNewRequestRow(item) {
    var newRequestPanel = $("<div>");
    newRequestPanel.addClass("panel panel-default");
    var newRequestPanelHeading = $("<div>");
    newRequestPanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newRequestName = $("<h2>");
    var newRequestDate = $("<small>");
    var newRequestCategory = $("<h5>");
    newRequestCategory.text("Category: " + request.category);
    newRequestCategory.css({
      float: "right",
      "font-weight": "700",
      "margin-top":
        "-15px"
    });
    var newRequestPanelBody = $("<div>");
    newRequestPanelBody.addClass("panel-body");
    var newRequestDesc = $("<p>");
    newRequestName.text(request.name + " ");
    newRequestDesc.text(request.desc);
    var formattedDate = new Date(request.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newRequestDate.text(formattedDate);
    newRequestName.append(newRequestDate);
    newRequestPanelHeading.append(deleteBtn);
    newRequestPanelHeading.append(editBtn);
    newRequestPanelHeading.append(newRequestName);
    newRequestPanelHeading.append(newCategory);
    newRequestPanelBody.append(newRequestDesc);
    newRequestPanel.append(newRequestPanelHeading);
    newRequestPanel.append(newRequestPanelBody);
    newRequestPanel.data("request", request);
    return newRequestPanel;
  }

  //===============================================================================
  //===============================IN THE MODAL NOW================================
  //=============Modal fires for 'Post New Donation' & for Edit Donation===========
  //===============================================================================

  // Getting jQuery references to the name, description, image, form, and category select
  var nameInput = $("#donation-name");
  var descInput = $("#desc");
  var imgUpload = $("donation-image");
  var donationForm = $("#donation-form");
  var donationCategorySelect = $("#donation-category");
  var updating = false;

  // Giving the donationCategorySelect a default value
  donationCategorySelect.val("What is our default category?");

  //===========================Click Event - Submit Modal Form==========================
  // click event for submit modal form
  // contains logic for new donation and update existing donation
  $(donationForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the donation if we are missing a name or description
    if (!nameInput.val().trim() || !descInput.val().trim()) {
      return;
    }
    // Constructing a newDonation object to hand to the database
    var newDonation = {
      name: donationNameInput.val().trim(),
      desc: descInput.val().trim(),
      category: donationCategorySelect.val(),
      image: imgUpload //??????????????????????????
    };

    console.log(newDonation);

    // If we're updating a donation run updateDonation
    // Otherwise run submitDonation to create a new donation
    if (updating) {
      newDonation.id = id;
      updateDonation(newDonation);
    }
    else {
      submitDonation(newDonation);
    }
  });
  //===========================END - Submit Modal Form==========================



  // ==============================NEW DONATION=================================
   // add new donation
   function handleNewDonation() {
    //modal toggles on
  }

  // Submits a new donation and closes modal
  function submitDonation(Donation) {
    $.post("/api/donations/", Donation, function() {
      //not changing pages here - just close modal
      //but this will reload page and display new donation
      window.location.href = "/donations";
    });
  }
  // ======================END - NEW DONATION========================



  //==========================UPDATE DONATION========================
  // figure out donation id we want to edit 
  function handleDonationEdit() {
    // fire modal ???
    var currentDonation = $(this)
      .parent()
      .parent()
      .data("donation");
      getDonationData(currentDonation.id);
      //window.location.href = "#";
      //not sending to a new window - we're firing the modal form
      //window.location.href = "/cms?item_id=" + currentItem.id;
  }

  // Gets donation data if we're editing
  function getDonationData(id) {
    $.get("/api/donations/" + id, function(data) {
      if (data) {
        // If this post exists, prefill our modal forms with its data
        donationNameInput.val(data.name);
        descInput.val(data.desc);
        donationCategorySelect.val(data.category);
        imgUpload //??????????????????????????
        // If we have a donation with this id, set a flag for us to know to update
        // when we hit submit
        updating = true;
      }
    });
  }

  // Update a given donation, bring user to the donations page when done
  function updateDonation(item) {
    $.ajax({
      method: "PUT",
      url: "/api/donations",
      data: item
    })
    .then(function() {
      window.location.href = "/donations";
    });
  }
  //========================== END - UPDATE DONATION========================


  //============================================================================
  //===============================END MODAL NOW================================
  //============================================================================
 

  //==============================DELETE DONATION============================
  // figure out which donation we want to delete and then calls
  // deleteDonation
  function handleDonationDelete() {
    var currentDonation = $(this)
      .parent()
      .parent()
      .data("donation");
    deleteDonation(currentDonation.id);
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
  //==============================END - DELETE DONATION============================


  // displays a message when there are no donations to list on the DOM
  function displayEmptyDonations() {
    myDonationsContainer.empty();
    var messageDonor = $("<h2>");
    messageDonor.css({ "text-align": "center", "margin-top": "50px" });
    messageDonor.html("Local organizations are in need!, click <a href='#'>here (fire 'add-item' modal) </a> to post a donation.");
    myDonationsContainer.append(messageDonor);
  }

  // displays a message when there are no requests/needs to list on the DOM
  function displayEmptyRequests() {
    orgRequestsContainer.empty();
    var messageOrg = $("<h2>");
    messageOrg.css({ "text-align": "center", "margin-top": "50px" });
    messageOrg.html("Find a local organization in need. Search by category above.");
    orgRequestsContainer.append(messageOrg);
  }


