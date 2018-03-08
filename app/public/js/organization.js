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



  //================ORG PROFILE PAGE - WE HAVE OUR requestS & A FORM TO ADD MORE================
  //===============================================================================================
  // myrequestsContainer holds all of our donated items
  var myRequestsContainer = $(".requests-container");
  
  // Click events for request edit and delete buttons -call edit/deleted functions
  $(document).on("click", "a.requestDelete", handleRequestDelete);

  // $(document).on("click", "a.requestEdit", handlerequestEdit);
 $(document).on("click", "a.requestEdit", handleRequestEdit);

  // hold individual items
  var requests;
  //fix later TODO
  var currentId;

  // Sets a flag for whether or not we're updating a request to be false initially
  var updating = false;

    // for testing: set uid to 3
    var donorUID = 2;

  // grabs requests from the database and updates the view
  // if there are none, call displayEmptyrequests to show message to user
  function getRequests() {
    $.get("/api/requests/" + donorUID, function (data) {
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

  // Getting the list of user's requests
  //=====================================
  getRequests();

  // initializerequestsRows handles appending all of our constructed request HTML inside
  // myrequestsContainer
  function initializeRequestsRows() {
    myRequestsContainer.empty();
    var requestToAdd = [];
    for (var i = 0; i < requests.length; i++) {
      requestToAdd.push(createNewRequestRow(requests[i]));
    }
    myRequestsContainer.append(requestToAdd);
  }

  //============BUILD OUT INDIVIDUAL requestS INTO .requests-container==========
  // construct a request's HTML
  // need to work in image thumbnail
  //===========================================
  function createNewRequestRow(request) {
    console.log("request object " + request);
    console.log("request id " + request.id);

     var $newRequestRow =  $('.requests-container').append(`
          <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img src="http://placehold.it/128x128" alt="Image">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Item:</strong> <small>${request.name}</small><small style="float:right;">1m</small>
                <br>
                <small>${request.description}</small>
              </p>
            </div>
            <nav class="level">
              <div class="level-left">
                <a class="level-item requestEdit" data="${request.id}">
                  <span class="icon is-small"><i class="edit fa fa-edit" ></i></span>Edit
                </a>
                <!-- <p>Edit</p> -->
              </div>
              <div class="level-right">
              <a class="level-item requestDelete" data="${request.id}">
                <span class="icon is-small"><i class="fa fa-trash"></i></span>Delete
              </a>
            </div>
            </nav>
          </div>
        </article>
      `); 
      // $newrequestRow.find("a.requestDelete").data("id", request.id);
      
      // $newrequestRow.find("a.requestEdit").data("id", request.id);
      return $newRequestRow;
  };

  // Getting jQuery references to the name, description, image, form, and category select
  var nameInput = $("input#request-name");
  var descriptionInput = $("textarea#request-description");
  var imgUpload = $("request-image");
  var requestForm = $("#request-form");
  var requestCategorySelect = $("select#request-category");
  var updating = false;

  //===========================Click Event - Submit Form==========================
  // contains logic for new request and update existing request
  requestForm.on("submit", function handleFormSubmit(event) {
    console.log('clicked form submit');
    console.log("name " + nameInput.val() );
    console.log("desc " + descriptionInput.val() );
    console.log("category id " + requestCategorySelect.val() );

    event.preventDefault();
    // Wont submit the request if we are missing a name or description
    if (!nameInput.val() || !descriptionInput.val()) {
      console.log('no name or description! try again');
      return;
    }
    // Constructing a newrequest object to hand to the database
    var newRequest = {
      name: nameInput.val(),
      description: descriptionInput.val(),
      item_categoryID: parseInt(requestCategorySelect.val()),
      type: "material",
      id: currentId
      //image: imgUpload //??????????????????????????
    };

    console.log("new request is below");
    console.log(newRequest);

    // If we're updating a request run updaterequest
    // Otherwise run submitrequest to create a new request
    if (updating) {

      console.log("request ID = " + currentId);
      updateRequest(newRequest);
    }
    else {
      submitRequest(newRequest);
    }
  
});
  //===========================END - Submit Form==========================



  // ===========================NEW request==============================
  // Submit a new request
  function submitRequest(Request) {
    console.log("function submitRequest is running");
    $.post("/api/requests", Request, function() {
      // call getrequests to print all user requests to DOM
      getRequests();
      nameInput.val("");
      descriptionInput.val("");
    });
  }
  // ======================END - NEW request========================



  //==========================UPDATE request========================
  // figure out request id we want to edit 
  function handleRequestEdit() {
    console.log($(this).attr("data"));
 
    var editThisRequestId = $(this).attr("data")
    getRequestdata(editThisRequestId);
     
  }

  // Gets request data if we're editing
  function getRequestdata(id) {
    console.log("Updating ID # id " + id);
    $.get("/api/requests/" + id, function(data) {
      if (data) {
        console.log("this is the request to update" + data);
        // If this request exists, prefill our forms with its data
        nameInput.val(data.name);
        descriptionInput.val(data.description);
        requestCategorySelect.val(data.item_categoryID);
        //requestID from backend get request
        currentId = id;
        //imgUpload //??????????????????????????
       
        updating = true;
      }
    });
  }

  // Update a given request, bring user to the requests page when done
  function updateRequest(item) {
    console.log("ITEM is below");
    console.log(item);
    $.ajax({
      method: "PUT",
      url: "/api/requests/:" + item.currentId,
      data: item
    })
    .then(function() {
      getRequests();
      nameInput.val("");
      descriptionInput.val("");
    });
  }
  //========================== END - UPDATE request========================
 

  //==============================DELETE request============================
  // figure out which request we want to delete and then calls
  // deleterequest
  function handleRequestDelete() {
    // console.log(this);
    console.log($(this).attr("data"));
    var deleteThisRequestId = $(this).attr("data");
    
    deleteRequest(deleteThisRequestId);
  }

  // This function does an API call to delete request
  // then calls function getrequests to re-write all remaining requests to DOM
  function deleteRequest(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/requests/" + id
    })
      .then(function () {
        getRequests();
      });
  }
  //==============================END - DELETE request========================


  // displays a message when there are no requests to list on the DOM
  function displayEmptyRequests() {
    console.log("Requests do not exist");
    myRequestsContainer.empty();
    var messageDonor = $("<h2>");
    messageDonor.css({ "text-align": "center", "margin-top": "50px" });
    messageDonor.html("Local donors have the items you need! Post a request.");
    myRequestsContainer.append(messageDonor);
  }


});