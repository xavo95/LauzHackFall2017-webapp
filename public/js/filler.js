$(document).ready(function () {
    fillCompanies();
    fillSectors();
});

var companiesArray;
var sectorsArray;

function fillSectors() {
    var url = "api/sectors/short";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json"
    }).done(function (data) {
        sectorsArray = data;
        var include = '';
        for (var i = 0; i < data.length; i++) {
            // include += '<li><a onclick=selectSector("' + i + '")>' + data[i]["SECTOR_NAME"] + "/" + data[i]["INDUSTRY_NAME"] + '</a></li>';
            include += '<li><a onclick=selectSector("' + i + '")>' + data[i]["SECTOR_NAME"] + '</a></li>';
        }
        $('#sector-dropdown').append(include);
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

function selectSector(index) {
    var url = "api/prices/sector/" + sectorsArray[index]["SECTOR"];
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json"
    }).done(function (data) {
        plotCompanyTimeSeriesMultiple(data);
        plotCompanyCandleStickMultiple(data);
        plotCompanyTimeSeriesVolumeMultiple(data);
        plotCompanyTimeSeriesSpendMoneyMultiple(data);
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
        var volumeArray = [];
        var spendMoneyArray = [];
        for(var i = 0; i < data.length; i++) {
            timestampArray.push(data[i]["TIMESTAMP"]);
            openArray.push(data[i]["OPEN"]);
            closeArray.push(data[i]["CLOSE"]);
            volumeArray.push(data[i]["VOL"]);
            spendMoneyArray.push(data[i]["SPENDMONEY"]);
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
        plotCompanyTimeSeriesVolume(timestampArray, volumeArray, companiesArray[index]["NAME"]);
        plotCompanyTimeSeriesSpendMoney(timestampArray, spendMoneyArray, companiesArray[index]["NAME"]);
    }).fail(function (data) {
        console.log(data);
    });
}

function plotCompanyCandleStick(timestampArray, openArray, closeArray, maxArray, minArray, absMax, absMin, company_name) {
    var trace1 = {
        name: company_name,
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
        showlegend: true,
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

function plotCompanyTimeSeriesVolume(timestampArray, volume, company_name) {
    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: company_name,
        x: timestampArray,
        y: volume,
        line: {color: '#17BECF'}
    };

    var data = [trace1];

    var layout = {
        title: 'Volume of transaction for: ' + company_name
    };

    Plotly.purge('plotly-div-company-time-volume');
    Plotly.plot('plotly-div-company-time-volume', data, layout);
}

function plotCompanyTimeSeriesSpendMoney(timestampArray, spendmoney, company_name) {
    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: company_name,
        x: timestampArray,
        y: spendmoney,
        line: {color: '#17BECF'}
    };

    var data = [trace1];

    var layout = {
        title: 'Volume of transaction for: ' + company_name
    };

    Plotly.purge('plotly-div-company-time-spendmoney');
    Plotly.plot('plotly-div-company-time-spendmoney', data, layout);
}

function plotCompanyCandleStickMultiple(company_array) {
    var data = [];
    var timestampFN = [];

    for(var j = 0; j < company_array.length; j++) {
        var data_val = company_array[j];
        var timestampArray = [];
        var openArray = [];
        var closeArray = [];
        var maxArray = [];
        var minArray = [];
        var absMax = data_val[0]["MAX"];
        var absMin = data_val[0]["MIN"];
        var volumeArray = [];
        for(var i = 0; i < data_val.length; i++) {
            timestampArray.push(data_val[i]["TIMESTAMP"]);
            openArray.push(data_val[i]["OPEN"]);
            closeArray.push(data_val[i]["CLOSE"]);
            volumeArray.push(data_val[i]["VOL"]);
            maxArray.push(data_val[i]["MAX"]);
            minArray.push(data_val[i]["MIN"]);
            if (absMax < data_val[i]["MAX"]) {
                absMax = data_val[i]["MAX"];
            } else if (absMin > data_val[i]["MIN"]) {
                absMin = data_val[i]["MIN"];
            }
        }
        var trace1 = {
            name: data_val[0]["NAME"],
            x: timestampArray,
            close: closeArray,
            decreasing: {line: {color: getRandomColor()}},
            high: maxArray,
            increasing: {line: {color: getRandomColor()}},
            line: {color: 'rgba(31,119,180,1)'},
            low: minArray,
            open: openArray,
            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y'
        };

        data.push(trace1);
        timestampFN = timestampArray;
    }

    var layout = {
        dragmode: 'zoom',
        height: 1000,
        margin: {
            r: 10,
            t: 25,
            b: 40,
            l: 60
        },
        showlegend: true,
        xaxis: {
            autorange: true,
            domain: [0, 1],
            range: [timestampFN[0], timestampFN[timestampFN.length - 1]],
            rangeslider: {range: [timestampFN[0], timestampFN[timestampFN.length - 1]]},
            title: 'Date',
            type: 'date'
        },
        yaxis: {
            autorange: true,
            domain: [0, 1],
            range: [0, 5000],
            type: 'linear'
        },
        title: 'Basic CandleStick of: '
    };
    Plotly.purge('plotly-div-sector-candle');
    Plotly.plot('plotly-div-sector-candle', data, layout);
}

function plotCompanyTimeSeriesMultiple(company_array) {
    var data = [];

    for(var j = 0; j < company_array.length; j++) {
        var data_val = company_array[j];
        var timestampArray = [];
        var openArray = [];
        var closeArray = [];
        var maxArray = [];
        var minArray = [];
        var absMax = data_val[0]["MAX"];
        var absMin = data_val[0]["MIN"];
        var volumeArray = [];
        for(var i = 0; i < data_val.length; i++) {
            timestampArray.push(data_val[i]["TIMESTAMP"]);
            openArray.push(data_val[i]["OPEN"]);
            closeArray.push(data_val[i]["CLOSE"]);
            volumeArray.push(data_val[i]["VOL"]);
            maxArray.push(data_val[i]["MAX"]);
            minArray.push(data_val[i]["MIN"]);
            if (absMax < data_val[i]["MAX"]) {
                absMax = data_val[i]["MAX"];
            } else if (absMin > data_val[i]["MIN"]) {
                absMin = data_val[i]["MIN"];
            }
        }
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: data_val[0]["NAME"] + ' High',
            x: timestampArray,
            y: maxArray,
            line: {color: getRandomColor()}
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: data_val[0]["NAME"] + ' Low',
            x: timestampArray,
            y: minArray,
            line: {color: getRandomColor()}
        };
        data.push(trace1);
        data.push(trace2);
    }

    var layout = {
        title: 'Basic Time Series of: ',
        height: 1000
    };

    Plotly.purge('plotly-div-sector-time');
    Plotly.plot('plotly-div-sector-time', data, layout);
}

function plotCompanyTimeSeriesVolumeMultiple(company_array) {
    var data = [];

    for(var j = 0; j < company_array.length; j++) {
        var data_val = company_array[j];
        var timestampArray = [];
        var openArray = [];
        var closeArray = [];
        var maxArray = [];
        var minArray = [];
        var absMax = data_val[0]["MAX"];
        var absMin = data_val[0]["MIN"];
        var volumeArray = [];
        for(var i = 0; i < data_val.length; i++) {
            timestampArray.push(data_val[i]["TIMESTAMP"]);
            openArray.push(data_val[i]["OPEN"]);
            closeArray.push(data_val[i]["CLOSE"]);
            volumeArray.push(data_val[i]["VOL"]);
            maxArray.push(data_val[i]["MAX"]);
            minArray.push(data_val[i]["MIN"]);
            if (absMax < data_val[i]["MAX"]) {
                absMax = data_val[i]["MAX"];
            } else if (absMin > data_val[i]["MIN"]) {
                absMin = data_val[i]["MIN"];
            }
        }
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: data_val[0]["NAME"],
            x: timestampArray,
            y: volumeArray,
            line: {color: getRandomColor()}
        };

        data.push(trace1);
    }

    var layout = {
        title: 'Volume of transaction for: ',
        height: 1000
    };

    Plotly.purge('plotly-div-sector-time-volume');
    Plotly.plot('plotly-div-sector-time-volume', data, layout);
}

function plotCompanyTimeSeriesSpendMoneyMultiple(company_array) {
    var data = [];

    for(var j = 0; j < company_array.length; j++) {
        var data_val = company_array[j];
        var timestampArray = [];
        var spendMoneyArray = [];
        var openArray = [];
        var closeArray = [];
        var maxArray = [];
        var minArray = [];
        var absMax = data_val[0]["MAX"];
        var absMin = data_val[0]["MIN"];
        var volumeArray = [];
        for(var i = 0; i < data_val.length; i++) {
            timestampArray.push(data_val[i]["TIMESTAMP"]);
            openArray.push(data_val[i]["OPEN"]);
            closeArray.push(data_val[i]["CLOSE"]);
            volumeArray.push(data_val[i]["VOL"]);
            spendMoneyArray.push(data_val[i]["SPENDMONEY"]);
            maxArray.push(data_val[i]["MAX"]);
            minArray.push(data_val[i]["MIN"]);
            if (absMax < data_val[i]["MAX"]) {
                absMax = data_val[i]["MAX"];
            } else if (absMin > data_val[i]["MIN"]) {
                absMin = data_val[i]["MIN"];
            }
        }
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: data_val[0]["NAME"],
            x: timestampArray,
            y: spendMoneyArray,
            line: {color: getRandomColor()}
        };

        data.push(trace1);
    }

    var layout = {
        title: 'Volume of transaction for: ',
        height: 1000
    };

    Plotly.purge('plotly-div-sector-time-spendmoney');
    Plotly.plot('plotly-div-sector-time-spendmoney', data, layout);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}