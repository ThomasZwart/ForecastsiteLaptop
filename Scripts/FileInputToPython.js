$(document).ready(function () {
    var $files = $('#files');
    var fileAmount = 0;
    var totalFileSize = 0;
    var chunks = 0, rows = 0;
    var start, end;
    var result = [];
    var filesHandled = 0;
    var error = false;
    var chunking = false;




    // Get an array of files from the select file input button
    $files.on("input",
        function () {
            var fileList = $files[0].files;
            fileAmount = fileList.length;
            totalFileSize = 0;

            // Determine the total size of all files
            var string = "";
            for (var i = 0; i < fileList.length; i++) {
                string = string + fileList[i].name + ", ";
                totalFileSize += fileList[i].size;
            }
            // Set the html text of the box to the name of the files
            if (fileList.length == 0) $("#fileLabel").html("Select File")
            else $("#fileLabel").html(string);

        });

    $('#read-file').click(function () {
        error = false;
        filesHandled = 0;
        result = [];
        chunks = 0;
        // Return if there are no files selected
        if (fileAmount == 0) {
            return
        }
        // Build the config for the parser
        // chunking and worker needs to be set before the config is build.
        var config = buildConfig();

        // Start timer
        start = performance.now();
        $files.parse({
            config: config,
            before: function (file, inputElem) {
                console.log("Parsing file:", file);
            },
            complete: function () {
                end = performance.now();
                console.log("Time spend parsing: ", end - start)
                // Logging the request in forecast API
                /*$.ajax({
                    url: "/api/log",
                    method: "POST",
                    data: logFile
                });
                */
            }
        });
    });

    // Build the parsing config file
    function buildConfig() {
        return {
            download: false,
            delimiter: "",
            newline: "",
            header: false,
            dynamicTyping: false,
            preview: 0,
            step: undefined,
            encoding: "",
            worker: false,
            comments: false,
            complete: completeFn,
            error: errorFn,
            download: false,
            fastMode: false,
            skipEmptyLines: true,
            chunk: setChunking() ? chunkFn : undefined,
            beforeFirstChunk: undefined,
        };
    }

    function errorFn(error, file) {
        console.log("ERROR:", error, file);
    }

    function completeFn(results) {
        // Error thrown by chunk function, because completefn will still be called if the chunk func throws a dimension error, so we handle that here
        if (error) {
            return;
        }
        // If there is no chunking keep the complete result
        // Else the result is the one formed in the chunk function
        if (!chunking) {
            // Skip the first file, because it determines the dimension, check for the others
            if (filesHandled >= 1) {
                // If multiple files get uploaded and they are not the same dimension
                if (result[0].length != results.data[0].length) {
                    alert("Data is not the same dimension");
                    return;
                }
            }
            // If there is no chunking get the result from this function and concat to the result already present (in case of multiple files)
            result = result.concat(results.data);
            // Else if there is chunking the result is formed in that function
        }
        filesHandled++;
        if (filesHandled >= fileAmount) {
            // temp
            console.log("Result: ", result);
            console.log("Chunks:", chunks);
            // Send the entire array to a python file on the server who handles the data analysis and recieve the data back from that same file.
            //ajaxArrayToPython(result);
            plotData(result);
            // location.reload();
        }
    }

    function chunkFn(results, streamer) {
        if (!results)
            return;
        // Skip the first file, because it determines the dimension, check for the others
        if (filesHandled >= 1) {
            // If multiple files get uploaded and they are not the same dimension
            if (result[0].length != results.data[0].length) {
                alert("Data is not the same dimension");
                error = true;
                streamer.abort();
                return;
            }
        }
        // Temp
        chunks++;

        // Concatenate each parsed chunk to the result array
        result = result.concat(results.data);
    }


    // Sets chunking to true or false based on the file sizes and determines the chunksize
    function setChunking() {
        // Big files should get chunked for the browser not to crash because of memory overflow
        if (totalFileSize >= 1000000 && totalFileSize < 100000000) {
            Papa.LocalChunkSize = totalFileSize / 10 + 1;
            chunking = true;
            return true;
        }
        // TODO: in chunks naar python
        else if (totalFileSize >= 100000000 && totalFileSize < 1000000000) {
            Papa.LocalChunkSize = totalFileSize / 1000 + 1;
            alert("Te grote file");
            return false;
        }
        else if (totalFileSize >= 1000000000 && totalFileSize < 10000000000) {
            Papa.LocalChunkSize = totalFileSize / 10000 + 1;
            alert("Te grote file");
            return false;
        }
        else if (totalFileSize >= 10000000000) {
            alert("Te grote file");
            return false;
        }
        return false;
    }
});

function plotData(array) {
    console.log(array)
    x2 = [];
    x3 = [];
    y2 = [];

    for (var i = 0; i < array.length; i++) {
        x2.push(array[i][0]);
        x3.push(array[i][1]);
        y2.push(array[i][3]);
    }

    var width = $("#chart").width();
    var height = $("#chart").height();

    var data = [{
        x: x2,
        y: y2,
        mode: 'markers',
        type: 'scatter'
    }, {
            x: x3,
            y: y2,
            mode: 'markers',
            type: 'scatter'
        }];
    var layout = {
        showlegend: false,
        type: 'scatter',
        autosize: true,
        width: width,
        height: height,
        dragmode: 'pan',
        margin: {
            l: 30,
            r: 0,
            b: 30,
            t: 20,
            pad: 10
        }
    };

    Plotly.newPlot('chart2', data, layout, {
        displaylogo: false, displayModeBar: false, scrollZoom: true, modeBarButtonsToRemove: ['hoverCompareCartesian', 'hoverClosestCartesian', 'resetScale2d', 'autoScale2d', 'zoomOut2d', 'zoomIn2d', 'lasso2d', 'select2d', 'sendDataToCloud', 'zoom2d']
    });

    Plotly.newPlot('chart', data, layout, {
        displaylogo: false, displayModeBar: false, scrollZoom: true, modeBarButtonsToRemove: ['hoverCompareCartesian', 'hoverClosestCartesian', 'resetScale2d', 'autoScale2d', 'zoomOut2d', 'zoomIn2d', 'lasso2d', 'select2d', 'sendDataToCloud', 'zoom2d']});
};

// Sends the data in an array to a external python script
function ajaxArrayToPython(array) {
    // temp
    var x = 0;
    $.ajax({
        data: JSON.stringify(array),
        type: 'POST',
        url: 'http://127.0.0.1:5000/process',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var d = new Date();
            x = d.getTime();
        },
        success: function (data) {
            console.log(data);
            var d = new Date();
            console.log("Time spend by sending to python and getting data back: ", d.getTime() - x, " ms");
        },
        error: function () {
            alert("Sending data to python went wrong (check python script for errors)");
        }
    });
}


