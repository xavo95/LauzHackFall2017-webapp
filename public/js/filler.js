$(document).ready(function () {
    fillCompanies();
});

var companiesArray;
var sectorsArray;

function fillSectors() {
    var url = "api/sectors";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json"
    }).done(function (data) {
        // include += '<li><a>' + data[i]["SECTOR_NAME"] + "/" + data[i]["INDUSTRY_NAME"] + '</a></li>';
    }).fail(function (data) {
        console.log(data);
    });
}

function fillCompanies() {
    var url = "api/companies";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json"
    }).done(function (data) {
        companiesArray = data;
        var include = '';
        for (var i = 0; i < data.length; i++) {
            include += '<li><a onclick=selectCompany("' + i + '")>' + data[i]["NAME"] + '</a></li>';
        }
        $('#company-dropdown').append(include);
    }).fail(function (data) {
        console.log(data);
    });
}

function selectCompany(index) {
    var url = "api/prices/" + companiesArray[index]["ISIN_CODE"];
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json"
    }).done(function (data) {
        var timestampArray = [];
        var openArray = [];
        var closeArray = [];
        var maxArray = [];
        var minArray = [];
        var absMax = data[0]["MAX"];
        var absMin = data[0]["MIN"];
        for(var i = 0; i < data.length; i++) {
            timestampArray.push(data[i]["TIMESTAMP"]);
            openArray.push(data[i]["OPEN"]);
            closeArray.push(data[i]["CLOSE"]);
            maxArray.push(data[i]["MAX"]);
            minArray.push(data[i]["MIN"]);
            if (absMax < data[i]["MAX"]) {
                absMax = data[i]["MAX"];
            } else if (absMin > data[i]["MIN"]) {
                absMin = data[i]["MIN"];
            }
        }
        plotCompanyTimeSeries(timestampArray, maxArray, minArray, companiesArray[index]["NAME"]);
        plotCompanyCandleStick(timestampArray, openArray, closeArray, maxArray, minArray, absMax, absMin, companiesArray[index]["NAME"]);
    }).fail(function (data) {
        console.log(data);
    });
}

function plotCompanyCandleStick(timestampArray, openArray, closeArray, maxArray, minArray, absMax, absMin, company_name) {
    var trace1 = {
        x: timestampArray,
        close: closeArray,
        decreasing: {line: {color: '#7F7F7F'}},
        high: maxArray,
        increasing: {line: {color: '#17BECF'}},
        line: {color: 'rgba(31,119,180,1)'},
        low: minArray,
        open: openArray,
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y'
    };

    var data = [trace1];

    var layout = {
        dragmode: 'zoom',
        margin: {
            r: 10,
            t: 25,
            b: 40,
            l: 60
        },
        showlegend: false,
        xaxis: {
            autorange: true,
            domain: [0, 1],
            range: [timestampArray[0], timestampArray[timestampArray.length - 1]],
            rangeslider: {range: [timestampArray[0], timestampArray[timestampArray.length - 1]]},
            title: 'Date',
            type: 'date'
        },
        yaxis: {
            autorange: true,
            domain: [0, 1],
            range: [absMin, absMax],
            type: 'linear'
        },
        title: 'Basic CandleStick of: ' + company_name
    };
    Plotly.purge('plotly-div-company-candle');
    Plotly.plot('plotly-div-company-candle', data, layout);
}

function plotCompanyTimeSeries(timestampArray, maxArray, minArray, company_name) {
    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: company_name + ' High',
        x: timestampArray,
        y: maxArray,
        line: {color: '#17BECF'}
    };

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: company_name + ' Low',
        x: timestampArray,
        y: minArray,
        line: {color: '#7F7F7F'}
    };

    var data = [trace1,trace2];

    var layout = {
        title: 'Basic Time Series of: ' + company_name
    };

    Plotly.purge('plotly-div-company-time');
    Plotly.plot('plotly-div-company-time', data, layout);
}