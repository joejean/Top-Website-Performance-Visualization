
var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
//PageSpeed API key:
var API_KEY = 'AIzaSyDjGFiLuWMaXN6usMdpSqocr79la6gXpYU';
// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

var URL_DATA = [
    "Souqalmal.com",
    "emaratyah.ae",
    "Jadopado.com",
    "Timeoutdubai.com",
    "Carrefouruae.com",
    "Expatwoman.com",
    "Namshi.com",
    "omniyat.net",
    "emiratesislamic.ae",
    "layalina.com",
    "Talabat.com",
    "dubaitrade.ae",
    "dib.ae",
    "Dubaipolice.gov.ae",
    "ae.pricena.com",
    "Adib.ae",
    "Nbad.com",
    "Dm.gov.ae",
    "Hct.ac.ae",
    "Dubizzle.com",
    "albayan.ae",
    "Gulftalent.com",
    "monstergulf.com",
    "Desertcart.ae",
    "Propertyfinder.ae",
    "Zomato.com",
    "Gulfnews.com",
    "Khaleejtimes.com",
    "Etisalat.ae",
    "Uaewomen.net",
    "Awok.com",
    "Emirates247.com",
    "Cleartrip.ae",
    "Starzplay.com",
    "Airarabia.com",
    "Naukrigulf.com",
    "Du.ae",
    "cbd.ae",
    "fgbgroup.com",
    "Bayut.com",
    "tajawal.ae",
    "Voxcinemas.com",
    "Mol.gov.ae",
    "Adec.ac.ae",
    "Alldubai.ae",
    "Sharafdg.com",
    "Rta.ae",
    "Mashreqbank.com",
    "Thenational.ae",
    "Adcb.com",
    "Flydubai.com",
    "Rakbankonline.ae",
    "Cobone.com",
    "Emaratalyoum.com",
    "mohre.gov.ae",
    "Etihad.com",
    "drivearabia.com",
    "Hsbc.ae",
]

// Object that will hold the callbacks that process results from the
// PageSpeed Insights API.
var callbacks = {}
var mobileSpeedData = [];
var usabilityData = []; 
var desktopSpeedData = [];


// Invokes the PageSpeed Insights API. The response will contain
// JavaScript that invokes our callback with the PageSpeed results.

function runPagespeedMobile(website) {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  var query = [
    'url=' + 'http://'+website,
    'callback=runPagespeedCallbacks',
    'key=' + API_KEY,
    'strategy=mobile'
  ].join('&');
  s.src = API_URL + query;
  document.head.insertBefore(s, null);
}

function runPagespeedDesktop(website) {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  var query = [
    'url=' + 'http://'+website,
    'callback=runPagespeedCallbacks',
    'key=' + API_KEY,
    'strategy=desktop'
  ].join('&');
  s.src = API_URL + query;
  document.head.insertBefore(s, null);
}

// Our JSONP callback. Checks for errors, then invokes our callback handlers.
function runPagespeedCallbacks(result) {
  if (result.error) {
    var errors = result.error.errors;
    for (var i = 0, len = errors.length; i < len; ++i) {
      if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
        console.log('Please specify your Google API key in the API_KEY variable.');
      } else {
        // NOTE: your real production app should use a better
        // mechanism than alert() to communicate the error to the user.
        console.log(errors[i].reason+":"+errors[i].message);
      }
    }
    return;
  }
  // Dispatch to each function on the callbacks object.
  for (var fn in callbacks) {
    var f = callbacks[fn];
    if (typeof f == 'function') {
      callbacks[fn](result);
    }
  }
}
function getWebSiteDomain(websiteUrl){
  var url = document.createElement('a');
  url.href = websiteUrl;
  var result = url.hostname;
  if(result.indexOf("www.") == 0){
    result = result.slice("4");
  }
  return result;
}

callbacks.processResults = function(result){
  var website_name = getWebSiteDomain(result.id);
  if (result.ruleGroups.USABILITY){
      mobileSpeedData.push([website_name, result.ruleGroups.SPEED.score]);
      mobileSpeedData.sort(function(a,b){return b[1]- a[1]});
      usabilityData.push([website_name, result.ruleGroups.USABILITY.score]);
      usabilityData.sort(function(a,b){return b[1]- a[1]});

      // Set a callback to run when the Google Visualization API is loaded.
      /*google.charts.setOnLoadCallback(*/
      google.charts.setOnLoadCallback(drawMobileChart(mobileSpeedData, usabilityData));
  } else{

      desktopSpeedData.push([website_name, result.ruleGroups.SPEED.score]);
      desktopSpeedData.sort(function(a,b){return b[1]- a[1]});
       // Set a callback to run when the Google Visualization API is loaded.*/
      google.charts.setOnLoadCallback(drawDesktopSpeedChart(desktopSpeedData));
  }
  

}
// Invoke the callback that fetches results. Async here so we're sure
// to discover any callbacks registered below, but this can be
// synchronous in your code.
  

var i = 1;                     //  set your counter to 1
var j= 0;

function myLoop () {           //  create a loop function
   setTimeout(function () { //  call a 3s setTimeout when the loop is called
      runPagespeedMobile(URL_DATA[j]);          //  your code here
      runPagespeedDesktop(URL_DATA[j]); 
      j++;
      i++;                     //  increment the counter
      if (i < URL_DATA.length) {            //  if the counter < 10, call the loop function
         myLoop();             //  ..  again which will trigger another 
      }                        //  ..  setTimeout()
   }, 1000)
}

myLoop();                      //  start the loop


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawMobileChart(mobileSpeed, usabilityScores){
  // Create the data table.
  var desktopSpeedData = new google.visualization.DataTable();
  var mobileSpeedData = new google.visualization.DataTable();
  var usabilityData = new google.visualization.DataTable();

  mobileSpeedData.addColumn('string', 'Website');
  mobileSpeedData.addColumn('number', 'Speed Score');
  
  for(var i =0; i< mobileSpeed.length; i++){
    mobileSpeedData.addRows([mobileSpeed[i]]);
  }

  usabilityData.addColumn('string', 'Website');
  usabilityData.addColumn('number', 'Usability Score');

  for(var i =0; i< usabilityScores.length; i++){
    usabilityData.addRows([usabilityScores[i]]);
  }

  // Set chart options
  var usabilityOptions = {'title':'Usability Scores For UAE Websites',
                 'width':800,
                 'height':2000};
  var mobileOptions = {'title':'Speed Scores on Mobile For UAE Websites',
                 'width':800,
                 'height':2000};

  // Instantiate and draw our chart, passing in some options.
  var mobileSpeedChart = new google.visualization.BarChart(document.getElementById('mobile_speed_usability_chart'));
  mobileSpeedChart.draw(mobileSpeedData, mobileOptions);

  var usabilityChart = new google.visualization.BarChart(document.getElementById('usability'));
  usabilityChart.draw(usabilityData, usabilityOptions);
}

function drawDesktopSpeedChart(desktopSpeed){
  // Create the data table.
  var desktopSpeedData = new google.visualization.DataTable();
 
  desktopSpeedData.addColumn('string', 'Website Name');
  desktopSpeedData.addColumn('number', 'Speed Score on Desktop');
  
  for(var i =0; i< desktopSpeed.length; i++){
    desktopSpeedData.addRows([desktopSpeed[i]]);
  }

  // Set chart options
  var options = {'title':'Speed Scores On Desktop For UAE Websites',
                 'width':800,
                 'height':2000};
  
  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.BarChart(document.getElementById('desktop_speed_chart'));
  chart.draw(desktopSpeedData, options);
}
