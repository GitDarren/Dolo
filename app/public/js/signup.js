$(document).ready(function()    {
    //Getting references to our form and input
    var signUpForm = $("form#signup");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var nameInput = $("input#name-input");
    var phoneInput = $("input#phone-input");
    var streetInput = $("input#street-input");
    var cityInput = $("input#city-input");
    var stateInput = $("input#state-input");
    var zipInput = $("input#zip-input");
    var userData;

    //When the signup button is clicked, we validate that the email and password are not blank

    signUpForm.on("submit", function(event) {
        console.log("this button has been clicked");
        event.preventDefault();
        userData = {
            email: emailInput.val(),
            password: passwordInput.val(),
            name: nameInput.val(),
            phone: phoneInput.val(),
            street: streetInput.val(),
            city: cityInput.val(),
            state: stateInput.val(),
            zip: zipInput.val()
        };
        console.log(userData);
        if (!userData.email || !userData.password)  {
            return;
        }

        //If we have an email address and password, run the signUpUser function
        signUpUser(userData);
        emailInput.val("");
        passwordInput.val("");
        nameInput.val("");
        phoneInput.val("");
        streetInput.val("");
        cityInput.val("");
        stateInput.val("");
        zipInput.val("");
    });

    //Does a post to the signup route. If successful, we are redirected to the login page
    //Otherwise we log any errors
    function signUpUser(userData)    {
        $.post("/api/users", {
            email: userData.email,
            password: userData.password,
            name: userData.name,
            phone: userData.phone,
            street: userData.street,
            city: userData.city,
            state: userData.state,
            zip: userData.zip
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