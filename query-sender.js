/**
 * Receives a query object as parameter and sends it as Ajax request to the POST /query REST endpoint.
 *
 * @param query The query object
 * @returns {Promise} Promise that must be fulfilled if the Ajax request is successful and be rejected otherwise.
 */
CampusExplorer.sendQuery = (query) => {
    return new Promise((resolve, reject) => {
        // console.log("in send query");
        var xmlhttp = new XMLHttpRequest();
        // console.log(xmlhttp);
        // console.log("after zmlhttp.open");
        // console.log(query);
        // console.log(xmlhttp.status);

        try {
            xmlhttp.open("POST", "http://localhost:4321/query", true);

            xmlhttp.onload = () => {
                var status = xmlhttp.status;

                // console.log("in ready state change");
                // console.log("this is the readystate: " + xmlhttp.readyState);
                // console.log("This is the status: " + status);
                // Process the response
                if (status === 200) {
                    // console.log("great success");
                    // console.log("The request has been completed successfully");
                    // console.log("query-sender:: the xmlhttp response is: " + xmlhttp.response);
                    // console.log("query-sender:: the xml response text: " + JSON.stringify(xmlhttp.responseText));
                    resolve(xmlhttp.response);
                } else {
                    console.log("Oh no! There has been an error with the request!");
                    alert(`Error ${xmlhttp.status}: ${xmlhttp.statusText}`);
                    reject();
                }
            };
            // console.log("sending the query: " + query);
            xmlhttp.send(String(query));

        } catch {
            // console.log("caught an error opening/sending xml http request!");
            alert(`Error opening/sending xml http request failed`);
            reject();
        }
    }).catch(() => { console.log("at final catch"); });
};

