var countDownDates = [];

if(checkCookie("timers")){
    beenHereBefore();
} else {
    firstTimeVisit();
}

console.log(getCookie("timers"));

createCountDownDates();
let currentIntervals = createIntervals();

/**
 * Function firstTimeVisit
 * Goal:    sets the cookie for the first time someone's here
 */
function firstTimeVisit() {
    let now = new Date();
    if (now.getMonth() === 11) {
        var current = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    console.log("initial" + countDownDates);
    countDownDates.push({
        key: "Until Next Month",
        val: current.getTime()
    });
    setCookie("timers", JSON.stringify(countDownDates), 42000);

}

/**
 * Function beenHereBefore
 * Goal:    to set the countDownDates from the cookie data
 */
function beenHereBefore(){
    console.log("loadingCookies");
    let timers = getCookie("timers");
    countDownDates = JSON.parse(timers);
    console.log(countDownDates);
}

/**
 * Function createCountDownDates
 * Goal:    to create the divs to host the countDownDates
 */
function createCountDownDates() {
    for (var i = 0; i < countDownDates.length; i++) {
        let currentTimer = "timer-" + i;
        $(document.body).append(
            `<div class="jumbotron countdown-box">
                <h1 class="display-4 " id="${currentTimer}"></h1>
                <p class="lead"> ${countDownDates[i].key} </p>
            </div>`);
   }
}

/**
 * Function createIntervals
 * Goal:    to setInterval of the second-by-second computation of time left
 * @returns {number}
 */
function createIntervals(){
    return setInterval(function(){
        let now = new Date().getTime();
        console.log("setting interval");
        for(var i = 0; i < countDownDates.length; i++) {
            let distance = countDownDates[i].val - now;

            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            var htmlstring = "";
            if (distance < 0) {
                days *= -1;
                hours *= -1;
                minutes *= -1;
                seconds *= -1;
                htmlstring = days + "d " + hours + "h " + minutes + "m " + seconds + "s  (Since)";
            } else {
                htmlstring = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            }


            let currentTimer = "#timer-"+i;
            let $timer = $(currentTimer);

            $timer.html(htmlstring);
        }


    }, 1000);
}

/**
 * Displays the add div
 */
$("#add-one").on("click", function(event){
    //make sure form  doesn't  submit
    event.preventDefault();

    $("#add-new-timer").toggle(function () {
        $("#add-new-timer").css({display:"block"});
    }, function () {
        $("#add-new-timer").css({display:"none"});
    });

});

/**
 * Handles adding timers
 */
$("#add-new-timer").submit(function(event){
    event.preventDefault();
    countDownDates.push({
        key: $("#timer-title").val(),
        val: new Date($("#timer-date").val()).getTime()});
    console.log(countDownDates.length -1);

    var currentTimer = `timer-${countDownDates.length-1}`;
    console.log(currentTimer);
    $(document.body).append(
        `<div class="jumbotron">
            <h1 class="display-4" id="${currentTimer}"></h1>
            <p class="lead"> ${countDownDates[countDownDates.length-1].key}</p>
        </div>`);

    clearInterval(currentIntervals);
    currentIntervals = createIntervals();
    setCookie("timers", JSON.stringify(countDownDates), 42000);
    $("#add-new-timer").css({display:"none"});


});

/**
 * handles the close button
 */
$("#close-form").on("click", function(event){
    event.preventDefault();
    $("#add-new-timer").css({display:"none"});
});

//COOKIE HANDLING
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


/**
 * Function checkCookie
 * Goal:    checks the status of a cookie
 * @param cookieName
 * @returns {boolean}
 */
function checkCookie(cookieName) {
    return getCookie(cookieName) !== "" && getCookie(cookieName) !== "[]";
}

$(".countdown-box").on("click", function(event){
   event.preventDefault();
   removeElement($(this).find(".lead").html().trim());
   $(this).remove();
});

function removeElement(lead){
    for(var i = 0; i < countDownDates.length; i++){
        console.log(countDownDates[i].key.trim());
        if(lead === countDownDates[i].key){
            countDownDates.splice(i,1);
            setCookie("timers", JSON.stringify(countDownDates),40000);
            return;
        }
    }

}

