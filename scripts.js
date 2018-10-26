let countDownDates = [];


!checkCookie("timers") ? beenHereBefore() : firstTimeVisit();

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
    setCookie("timers", JSON.stringify(countDownDates));

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
            `<div class="jumbotron">
                <h1 class="display-4" id="${currentTimer}"></h1>
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

            //htmlstring
            let htmlstring = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            let currentTimer = "#timer-"+i;
            let $timer = $(currentTimer);

            $timer.html(htmlstring);
        }


    }, 1000);
}

$("#add-one").on("click", function(event){
    //make sure form  doesn't  submit
    event.preventDefault();

    $("#add-new-timer").toggle(function () {
        $("#add-new-timer").css({display:"block"});
    }, function () {
        $("#add-new-timer").css({display:"none"});
    });

});

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
    setCookie("timers", JSON.stringify(countDownDates));


});

$("#close-form").on("click", function(event){
    event.preventDefault();
    $("#add-new-timer").css({display:"none"});
});

//COOKIE HANDLING
function setCookie(cname, cvalue, ) {
    document.cookie = cname + "=" + cvalue + ";" + "path=/";
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

function checkCookie(cookieName) {
    return getCookie(cookieName) !== "";


}

