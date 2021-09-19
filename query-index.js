/**
 * This hooks together all the CampusExplorer methods and binds them to clicks on the submit button in the UI.
 *
 * The sequence is as follows:
 * 1.) Click on submit button in the reference UI
 * 2.) Query object is extracted from UI using global document object (CampusExplorer.buildQuery)
 * 3.) Query object is sent to the POST /query endpoint using global XMLHttpRequest object (CampusExplorer.sendQuery)
 * 4.) Result is rendered in the reference UI by calling CampusExplorer.renderResult with the response from the endpoint as argument
 */

// TODO: implement!
// control + click this link to open localhost:
// http://localhost:4321/

let query;
const submitButton = document.getElementById("submit-button");

submitButton.onclick = function () {
    query = CampusExplorer.buildQuery();
    // console.log("the new query is: " + query);
    // testingScope();

    const sendQuery = CampusExplorer.sendQuery(String(query));

    sendQuery.then((result) => {
/*         let apple = {
            "responseText": result.responseText
         } */

        // console.log(`This is APPLE: ${JSON.stringify(apple)}`);
        // console.log(`testing the result: ${result}`);
        // console.log(`result of sendQuery.then: ${result.responseText}`);
        CampusExplorer.renderResult(result);
        // expected output: "Success!"
    });
};

const testingScope = function () {
    // console.log("the query here should be the same: " + query);
};
