$(document).ready(function()    {
    //Getting references to our form and input
    var signUpForm = $("form.signup");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var userData;

    //When the signup button is clicked, we validate that the email and password are not blank

    signUpForm.on("submit", function(event) {
        console.log("this button has been clicked");
        event.preventDefault();
        userData = {
            email: emailInput.val(),
            password: passwordInput.val()
        };
        console.log(userData);
        if (!userData.email || !userData.password)  {
            return;
        }

        //If we have an email address and password, run the signUpUser function
        signUpUser(userData.email, userData.password);
        emailInput.val("");
        passwordInput.val("");
    });

    //Does a post to the signup route. If successful, we are redirected to the members page
    //Otherwise we log any errors
    function signUpUser(email, password)    {
        $.post("/api/signup", {
            email: email,
            password: password
        }).then(function(data)  {
            window.location.replace(data);
            //If there's an error, handle it by throwing up an alert
        }).catch(handleLoginErr);
    }

    function handleLoginErr(err)    {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }
});