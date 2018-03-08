$(document).ready(function()    {
    //Getting references to our form and input
    var signUpForm = $("form#signup");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var phoneInput = $("input#phone-input");
    var streetInput = $("input#street-input");
    var cityInput = $("input#city-input");
    var stateInput = $("input#state-input");
    var zipInput = $("input#zip-input");
    var orgName = $("org-name-input");
    var orgDesc = $("org-desc-input");
    var orgCategory = $("org-category-input")
    var orgWeb = $("org-web-input");
    var orgDesc = $("org-desc-input");
    var orgData;

    //When the signup button is clicked, we validate that the email and password are not blank

    signUpForm.on("submit", function(event) {
        console.log("this button has been clicked");
        event.preventDefault();
        orgData = {
            name: orgName.val(),
            email: emailInput.val(),
            password: passwordInput.val(),
            phone: phoneInput.val(),
            street: streetInput.val(),
            city: cityInput.val(),
            state: stateInput.val(),
            zip: zipInput.val(),
            category: orgCategory.val(),
            website: orgWeb.val(),
            description: orgDesc.val()
        };
        console.log(orgData);
        if (!orgData.email || !orgData.password)  {
            return;
        }

        //If we have an email address and password, run the signUpOrg function
        signUpOrg(orgData);
        orgName.val("");
        emailInput.val("");
        passwordInput.val("");
        phoneInput.val("");
        streetInput.val("");
        cityInput.val("");
        stateInput.val("");
        zipInput.val("");
        orgCat.val("");
        orgWeb.val("");
        orgDesc.val("");

    });

    //Does a post to the signup route. If successful, we are redirected to the login page
    //Otherwise we log any errors
    function signUpOrg(orgData)    {
        $.post("/api/org", {
            email: orgData.email,
            password: orgData.password,
            name: orgData.name,
            phone: orgData.phone,
            street: orgData.street,
            city: orgData.city,
            state: orgData.state,
            zip: orgData.zip,
            Category: orgData.category,
            Website: orgData.web,
            Descrption: orgData.descrption

           // ========================= Organization data ========================//
        }).then(function(data)  {
            console.log("This is our use data", data);
            window.location.replace("/login");
            //If there's an error, handle it by throwing up an alert
        }).catch(handleLoginErr);
    }

    function handleLoginErr(err)    {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }
});