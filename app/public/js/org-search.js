$(document).ready(function () {

  //This file just does a GET request to figure out which user is logged in
  //and updates the HTML on the page

  $.get("/api/user_data").then(function (data) {
    $(".user-name").text(data.name);
    console.log("The user name is: ", data);
  });

  //========================DONOR SEARCHES FOR ORGS HERE - SEARCH BY CATEGORY======================
  //===============================================================================================

  // orgRequestsContainer holds all of Org's requests
  var orgRequestsContainer = $(".requests-container");
  //console.log("Donations", data);
  // Org category user selects from dropdown
  var orgCategorySelect = $("#org-category");

  // call function handleOrgCategoryChange on category change
  orgCategorySelect.on("change", handleOrgCategoryChange);

  // hold individual items
  var requests;

  // This function handles reloading new requests/needs when Org category changes
    function handleOrgCategoryChange() {
      console.log("is this a category? " + parseInt(($(this).val())));
      var newOrgCategory = parseInt(($(this).val()));
      console.log(newOrgCategory);
      getRequests(newOrgCategory);
    }
  });

  // grabs Org requests/needs by category from database and updates the view
  //***Needs to be by catergoryID***
  // if there are none, call displayEmptyRequests to show message to user
  function getRequests(categoryID) {
    $.get("/api/requests/" + categoryID, function (data) {
      console.log("Requests: ", data);
      requests = data;
      console.log(requests);

      if (!requests || !requests.length) {
        displayEmptyRequests();
      }
      else {
        initializeRequestsRows();
      }
    });
  }

  // initializeRequestsRows handles appending all of our constructed requests/needs HTML inside
  function initializeRequestsRows() {
    orgRequestsContainer.empty();
    var requestsToAdd = [];
    for (var i = 0; i < requests.length; i++) {
      requestsToAdd.push(createNewRequestRow(requests[i]));
    }
    orgRequestsContainer.append(requestsToAdd);
  }

  //============BUILD OUT INDIVIDUAL REQUETS INTO .requests-container==========
  // construct a request's HTML
  // need to work in image thumbnail
  // Need 'Claim It!' button
  //===========================================
  function createNewRequestRow(request) {
  
    console.log("donation object " + request);
    console.log("donation id " + request.id);

     var $newRequestRow =  $('.requests-container').append(`
    
     <div class="column">
     <div class="card">
        <header class="card-header">
           <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
                 <i class="fa fa-angle-down" aria-hidden="true"></i>
              </span>
          </a>
       </header>
          <div class="card-image">
              <figure class="image">
                <img src="assets/img/habitat.jpg" alt="">
              </figure>
          </div>
          <div class="card-content">
            <div class="content">
                <h2 class="org-name">Austin Habitat For Humanity</h2>
                   <strong class="is left">Requested Item: </strong>
                   <p>${request.name}</p>
                      </div>
                     </div>
                  <footer class="card-footer">
                   <a class="card-footer-item">Respond</a>
                  </footer>
                  </div>  
      </div>
    <!--     
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
                <div class="level-right">
                   <a class="button is-small is-info" id="request-category" href="#">Contact</a>
                 </div>
            </nav>

          </div>
        </article>  -->
      `); 
    
      return $newRequestRow;
  };


  // displays a message when there are no requests/needs to list on the DOM
  function displayEmptyRequests() {
    orgRequestsContainer.empty();
    var messageOrg = $("<h2>");
    messageOrg.css({ "text-align": "center", "margin-top": "50px" });
    messageDonor.html("Sorry, there are no requests available in this category. Choose another!");
    orgRequestsContainer.append(messageOrg);
  }


