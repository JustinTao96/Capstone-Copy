/**
 * Builds a query object using the current document object model (DOM).
 * Must use the browser's global document object {@link https://developer.mozilla.org/en-US/docs/Web/API/Document}
 * to read DOM information.
 *
 * @returns query object adhering to the query EBNF
 */
CampusExplorer.buildQuery = () => {
    let query = {};
    // TODO: implement!
    // console.log("------------------------------------------------");

    // template for COURSES ID
    const auditID = "courses-groups-field-audit";

    // template for ROOMS ID.
    const addressID = "rooms-groups-field-address";

    const groupPrefixRooms = "rooms-groups-field-";
    const groupPrefixCourses = "courses-groups-field-";


    // get either courses or rooms
    const currentKind = document.getElementsByClassName("nav-item tab active")[0].innerHTML;
    // console.log("current kind is: " + currentKind);

    const kind = String(currentKind.toLowerCase());
    // console.log("the modified kind for query is: " + kind);

    let activeTab;

    if (kind === "courses") {
        activeTab = document.getElementById("tab-courses");

    } else if (kind === "rooms") {
        activeTab = document.getElementById("tab-rooms");
    }


    // Create helper functions:
    const GetGroupedString = function (arr) {
        let currentString = ``;

        for (let i = 0; i < arr.length; i++) {

            const currentValue = arr[i];

            if ((arr.length - i) >= 3) {
                // if there are 3+ words remaining, use commas in between
                currentString += `${currentValue}, `;
            }

            if ((arr.length - i) === 2) {
                // if there are 2 words remaining, use KEY and KEY
                currentString += `${currentValue} and `;
            }

            if ((arr.length - i) === 1) {
                // if there is 1 word remaining, leave no spaces after "KEY"
                currentString += `${currentValue}`;
            }
        }

        return currentString;
    }

    const InputKeyToResultKey = function (key) {
        switch (key) {
            case "title": {
                return "Title";
            }
            case "uuid": {
                return "UUID";
            }
            case "instructor": {
                return "Instructor";
            }
            case "audit": {
                return "Audit";
            }
            case "year": {
                return "Year";
            }
            case "id": {
                return "ID";
            }
            case "pass": {
                return "Pass";
            }
            case "fail": {
                return "Fail";
            }
            case "avg": {
                return "Average";
            }
            case "dept": {
                return "Department";
            }
            case "section": {
                return "Section";
            }
            case "lat": {
                return "Latitude";
            }
            case "lon": {
                return "Longitude";
            }
            case "seats": {
                return "Seats";
            }
            case "fullname": {
                return "Full Name";
            }
            case "shortname": {
                return "Short Name";
            }
            case "number": {
                return "Number";
            }
            case "name": {
                return "Name";
            }
            case "address": {
                return "Address";
            }
            case "type": {
                return "Type";
            }
            case "furniture": {
                return "Furniture";
            }
            case "href": {
                return "Link";
            }
        }
    };

    const CoursesGroupNames = [
        "audit",
        "avg",
        "dept",
        "fail",
        "id",
        "instructor",
        "pass",
        "title",
        "uuid",
        "year",
    ];


    const RoomsGroupNames = [
        "address",
        "fullname",
        "furniture",
        "href",
        "lat",
        "lon",
        "name",
        "number",
        "seats",
        "shortname",
        "type",
    ];

    const GetDatasetKey = function () {
/*         console.log(
            `----------------------------------------
                        DATASET KEY:
            -----------------------------------------`) */

        let datasetKey = "";
        query = "in courses dataset baby";

        // get the corresponding dataset for KIND (dataset name always = kind)
        const datasetID = kind;
        const checkedGroups = [];

        // POPULATING THE CHECKED GROUPS ARRAY:::
        let checkBoxArray = [];
        let groupPrefix;

        // check the checkboxes that matches the KIND.
        if (kind === "courses") {
            checkBoxArray = CoursesGroupNames;
            groupPrefix = groupPrefixCourses;

        } else if (kind === "rooms") {
            checkBoxArray = RoomsGroupNames;
            groupPrefix = groupPrefixRooms;
        }

        for (i = 0; i < checkBoxArray.length; i++) {

            const currentCheckBox = document.getElementById(`${groupPrefix}${checkBoxArray[i]}`);
            // console.log("the current Checkbox: " + currentCheckBox);
            // console.log("the current Checkbox value : " + currentCheckBox.value);
            // console.log("is the current Checkbox checked : " + currentCheckBox.checked);

            if (currentCheckBox.checked) {
                // console.log("pushing current value: " + currentCheckBox.value);
                checkedGroups.push(InputKeyToResultKey(currentCheckBox.value));
                // console.log("checkedGroups now has: " + checkedGroups);
            } else {
                // console.log("current checkbox: " + currentCheckBox.value + "is not checked!")
            }
        }

        // console.log("checked groups is: " + checkedGroups);
        // :::FINISHED POPULATING THE CHECKED GROUPS ARRAY

        datasetKey = `In ${kind} dataset ${datasetID} `;

        if (checkedGroups.length === 0) {
            // there is nothing to group by
            datasetKey = `In ${kind} dataset ${datasetID}, `;

        } else {
            // get the groupedBy and then
            datasetKey += "grouped by ";
            datasetKey += GetGroupedString(checkedGroups);
            datasetKey += `, `;
        }

        // console.log("checkbox array.length is : " + checkBoxArray.length);
        // console.log("dataset key: " + datasetKey);
        return datasetKey;
    }

    const GetFilterKey = function() {
        // an example of how to access a single checkbox
/*         console.log(
            `----------------------------------------
                        FILTER KEY:
            -----------------------------------------`) */
        let filterKey = "";
        let option; // option = all, any, none.
        let Key = "";
        let Condition = "";
        let Comparison = "";

        // figure out which option is checked.
        if (document.getElementById(`${kind}-conditiontype-all`).checked) {
            option = "all";

        } else if (document.getElementById(`${kind}-conditiontype-any`).checked) {
            option = "any";

        } else if (document.getElementById(`${kind}-conditiontype-none`).checked) {
            option = "none";
        }
        // console.log("the current option is : " + option);


        // Getting all the conditions.
        const conditionsBox = activeTab.getElementsByClassName("form-group conditions")[0];
        // console.log("form-group conditions[0] : " + conditionsBox.innerHTML);

        const conditionsContainer = conditionsBox.getElementsByClassName("conditions-container")[0];
        // console.log("conditions-container: " + conditionsContainer.innerHTML);

        const conditionsList = conditionsBox.getElementsByClassName("control-group condition");
        // console.log("conditions list current has : " + conditionsList.length + " conditions");

        // if there are no conditions, find all entires.
        if (conditionsList.length === 0) {
            return "find all entries; ";
        } else {
            filterKey = `find entries whose `;
        }

        // for each condition in the condition list:
        for (let count = 0; count < conditionsList.length; count++) {
/*             console.log(`
            -----------------------------------------
                        Condition #${count}:
            ----------------------------------------`) */
            // append the current condition as a filter key to the string.
            let currentKey = ``;
            let currentCondition = conditionsList[count];
            let not = false;

            // console.log("Current Condition currently points to: " + currentCondition.innerHTML);

            // finding NOT
            const notContainer = currentCondition.getElementsByClassName(`control not`)[0];
            // console.log("not Container currently points to: " + notContainer.innerHTML);

            // notCheckBox doesnt have innerHTML. its just this bool basically.
            const notCheckBox = notContainer.getElementsByTagName("input")[0];
            // console.log("not CheckBox.checked is currently : " + notCheckBox.checked);

            // Setting NOT to equal checked.
            not = notCheckBox.checked;

            // if the option is "none", flip the truth value of not.
            if (option === "none") {
                if (not === true) {not = false;}
                    else {not = true;}
            }

            // if not === true, find entires that do not match the condition. (average is not equal to 40)
            // if not === false, find entries that do match the condition. (average is equal to 50)
            // console.log("not is equal to :" + not);

            // Finding KEY:
            const keySelectionBox = conditionsBox.getElementsByClassName("control fields")[count];
            // console.log("keySelectionBox Contains :" + keySelectionBox.innerHTML);

            const keySelectionOptions = keySelectionBox.getElementsByTagName("option");

            for (let i = 0; i < keySelectionOptions.length; i++) {
/*                 console.log(`keyselection options #${i} --
                value: ${keySelectionOptions[i].value}
                selected: ${keySelectionOptions[i].selected}`); */

                const currentValue = keySelectionOptions[i];

                if (currentValue.selected) {
                    // console.log(`${currentValue.value} is selected...`);
                    currentKey = InputKeyToResultKey(currentValue.value);
                }
            }
            // console.log(`currentKey is now: ${currentKey}.`);
            filterKey += `${currentKey} `;


            // Finding the Operator:
            // find entries whose Average is greater than 97
            const OpSelectionBox = conditionsBox.getElementsByClassName("control operators")[count];
            const OpList = OpSelectionBox.getElementsByTagName("option");
            let selectedOP = "";

            for (let i = 0; i < OpList.length; i++) {
                const currentSelection = OpList[i];

                if (currentSelection.selected) {
                    // console.log(`${currentSelection.value} is selected...`);
                    selectedOP = currentSelection.value;
                }
            }

            // Finding the Comparison:
            const comparisonHolder = conditionsBox.getElementsByClassName("control term")[count];
            const comparisonTextBox = comparisonHolder.getElementsByTagName("input")[0];
            let comparisonString = String(comparisonTextBox.value);

            // console.log(`The comparison String is: ${comparisonString}`);
            // console.log(` the last value of the comparison is: ` + comparisonString.charAt(comparisonString.length - 1));
            // console.log(`split comparison: ${comparisonString.split('')}`);


/*         const values: string[] = [
        "find", "entries", "whose", "Average", "is", "greater", "than", "90", "and",
        "Department", "is", "\"adhe\"", "or", "Average", "is", "equal", "to", "95"]; */

            let suffix;

            // adding the last words onto the FILTER KEY based on remaining conditions.
            if ((conditionsList.length - count) >= 2) {
                // if there are 2 or more words remaining, use AND / OR.
                if (option === "all" || option === "none") {
                    suffix = ` and `;
                } else {
                    suffix = ` or `;
                }
            }

            if ((conditionsList.length - count) === 1) {
                // if there is 1 word remaining, use ;
                suffix = `; `;
            }

            switch (selectedOP) {
                case "EQ": {
                    if (not === false) {
                        filterKey += `is equal to ${comparisonString}${suffix}`;
                    } else {
                        filterKey += `is not equal to ${comparisonString}${suffix}`;
                    }
                    break;
                }
                case "GT": {
                    if (not === false) {
                        filterKey += `is greater than ${comparisonString}${suffix}`;
                    } else {
                        filterKey += `is not greater than ${comparisonString}${suffix}`;
                    }
                    break;
                }
                case "LT": {
                    if (not === false) {
                        filterKey += `is less than ${comparisonString}${suffix}`;
                    } else {
                        filterKey += `is not less than ${comparisonString}${suffix}`;
                    }
                    break;
                }
                case "IS": {
                    // str.charAt(0) str.charAt(-1)  get index
                    // Includes OP
                    if (comparisonString.charAt(0) === "*" &&
                        comparisonString.charAt(comparisonString.length - 1) === "*") {

                        comparisonString = comparisonString.substring(1);
                        comparisonString = comparisonString.substring(0, comparisonString.length - 1);
                        comparisonString = `\"${comparisonString}\"`;

                        if (not === false) {
                            filterKey += `includes ${comparisonString}${suffix}`;
                        } else {
                            filterKey += `does not include ${comparisonString}${suffix}`;
                        }
                    }

                    // begins with OP
                    else if (comparisonString.charAt(comparisonString.length - 1) === "*") {
                        comparisonString = comparisonString.substring(0, comparisonString.length - 1);
                        comparisonString = `\"${comparisonString}\"`;

                        if (not === false) {
                            filterKey += `begins with ${comparisonString}${suffix}`;
                        } else {
                            filterKey += `does not begin with ${comparisonString}${suffix}`;
                        }
                    }

                    // Ends With OP
                    else if (comparisonString.charAt(0) === "*") {
                        comparisonString = comparisonString.substring(1);
                        comparisonString = `\"${comparisonString}\"`;

                        if (not === false) {
                            filterKey += `ends with ${comparisonString}${suffix}`;
                        } else {
                            filterKey += `does not end with ${comparisonString}${suffix}`;
                        }
                    }

                    // IS OP.
                    else {
                        comparisonString = `\"${comparisonString}\"`;
                        if (not === false) {
                            filterKey += `is ${comparisonString}${suffix}`;
                        } else {
                            filterKey += `is not ${comparisonString}${suffix}`;
                        }
                    }
                    break;
                }
            }
        }

        return filterKey;
    }

    const GetDisplayKey = function() {
        // an example of how to access a single checkbox
/*         console.log(
        `----------------------------------------
                    DISPLAY KEY:
        -----------------------------------------`) */

        let displayKey = "show ";
        const columns = [];
        const transformations = [];

        // Getting the Collumns Holder
        const conditionsHolder = activeTab.getElementsByClassName("form-group columns")[0];
        const conditionsParent = conditionsHolder.getElementsByClassName("control-group")[0];
        let conditionsList = conditionsParent.getElementsByClassName("control field");
        const transConditionsList = conditionsParent.getElementsByClassName("control transformation");

        // console.log("Found " + conditionsList.length + " column checkboxes");

        for (let i = 0; i < conditionsList.length; i++) {
            const currentCheckBox = conditionsList[i].getElementsByTagName("input")[0];

            if (currentCheckBox.checked) {
                // console.log(`The ${InputKeyToResultKey(currentCheckBox.value)} box is checked!!!`);
                columns.push(InputKeyToResultKey(currentCheckBox.value));
            }
        }

        for (let i = 0; i < transConditionsList.length; i++) {
            const currentCheckBox = transConditionsList[i].getElementsByTagName("input")[0];

            if (currentCheckBox.checked) {
                // console.log(`The ${currentCheckBox.value} box is checked!!!`);
                columns.push(currentCheckBox.value);
            }
        }
        // console.log("currently the columns are: " + columns);

        //  const GetGroupedString = function (arr) {

        displayKey += GetGroupedString(columns);
        // console.log("currently the display key is : " + displayKey);

        // Getting the Transformations Holder
        const transformationsHolder = activeTab.getElementsByClassName("form-group transformations")[0];
        const transformationsParent = transformationsHolder.getElementsByClassName("transformations-container")[0];
        const transformationsList = transformationsParent.getElementsByClassName("control-group transformation");

        // console.log("there are currently " + transformationsList.length + " transformations.");

        for (let i = 0; i < transformationsList.length; i++) {
            const currentTrans = transformationsList[i];
            const controlTerm = currentTrans.getElementsByClassName("control term")[0];
            const controlOperators = currentTrans.getElementsByClassName("control operators")[0];
            const controlFields = currentTrans.getElementsByClassName("control fields")[0];

            // get custom name
            const customName = controlTerm.getElementsByTagName("input")[0].value;
            // console.log("current custom name is: " + customName);

            // get aggOP
            let aggOP;
            const aggOPHolder = controlOperators.getElementsByTagName("select")[0];
            const aggOPList = aggOPHolder.getElementsByTagName("option");

            for (let y = 0; y < aggOPList.length; y++) {
                if (aggOPList[y].selected) {
                    // console.log(`the Aggregate Op: ${aggOPList[y].value} is selected`);
                    aggOP = aggOPList[y].value;
                }
            }

            // get aggTarget
            let aggTarget;
            const aggTargetWrapper = controlFields.getElementsByTagName("select")[0];
            const aggTargetList = aggTargetWrapper.getElementsByTagName("option");
            // console.log("the agg target list has " + aggTargetList.length + " values");

            for (let z = 0; z < aggTargetList.length; z++) {
                if (aggTargetList[z].selected) {
                    // console.log(`the agg target is : ${InputKeyToResultKey(aggTargetList[z].value)}`)
                    aggTarget = InputKeyToResultKey(aggTargetList[z].value);
                }
            }

            if (customName !== "") { // if nothing is stored in value, customName = "";
                // console.log(`transformation ${i} : ${customName} , ${aggOP} , ${aggTarget}`);
            }

            const currentTransformation = {
                name: customName,
                op: aggOP,
                target: aggTarget,
            };

            transformations.push(currentTransformation);
        }
        // console.log(`Transformations currently has: \n ${JSON.stringify(transformations)}`);

        // turning the transformations into strings.
        // show Department and avgGrade, where avgGrade is the AVG of Average.
        if (transformations.length > 0) {
            displayKey += `, where `;
        }

        for (let i = 0; i < transformations.length; i++) {
            const tName = transformations[i].name;
            const tOp = transformations[i].op;
            const tTarget = transformations[i].target;

            if ((transformations.length - i) >= 3) {
                // if there are 3+ words remaining, use commas in between
                displayKey += `${tName} is the ${tOp} of ${tTarget}, `;
            }

            if ((transformations.length - i) === 2) {
                // if there are 2 words remaining, use KEY and KEY
                displayKey += `${tName} is the ${tOp} of ${tTarget} and `;
            }

            if ((transformations.length - i) === 1) {
                // if there is 1 word remaining, leave no spaces after "KEY"
                displayKey += `${tName} is the ${tOp} of ${tTarget}`;
            }
        }

        // console.log(`The Display Key is : ${displayKey}`);

        return displayKey;
    }

    const GetOrderKey = function() {
        // ; sort in ascending order by Seats.
        let orderKey = "; sort in ";
        let direction = 'ascending';
        let orderTarget = '';

        // Getting the Order Holder
        const orderHolder = activeTab.getElementsByClassName("form-group order")[0];
        const orderGroup = orderHolder.getElementsByClassName("control-group")[0];

        // getting the order list
        const orderParent = orderGroup.getElementsByClassName("control order fields")[0];
        const orderList = orderParent.getElementsByTagName("option");

        // getting ascending/decending
        const descendingHolder = orderGroup.getElementsByClassName("control descending")[0];
        const descendingCheckBox = descendingHolder.getElementsByTagName("input");

        if (descendingCheckBox[0].checked) {
            direction = `descending`;
        }

        // console.log("order list has " + orderList.length + " options.");
        // console.log(`the direction is : ${direction}`);


        for (let i = 0; i < orderList.length; i++) {
            const currentOption = orderList[i];

            if (currentOption.selected && currentOption.className === "transformation") {
                // console.log(`The ${InputKeyToResultKey(currentOption.value)} option is selected!!!`);
                orderTarget = currentOption.value;

            } else if (currentOption.selected) {
                orderTarget = InputKeyToResultKey(currentOption.value);
            }
        }

        if (orderTarget === ``) {
            return ``;

        } else {
            displayKey = `; sort in ${direction} order by ${orderTarget}`;
            return displayKey;
        }
    }


    // Begin MAIN function:

    let dataset;
    let filter;
    let display;
    let order;

    dataset = GetDatasetKey();
    filter = GetFilterKey();
    display = GetDisplayKey();
    order = GetOrderKey();



/*     console.log(`
    ------------------------------------
                Results:
    ------------------------------------`)
    console.log("Dataset key: " + dataset);
    console.log("Filter key: " + filter);
    console.log("Display key: " + display);
    console.log("Order key: " + order); */


    query = dataset + filter + display + order + ".";
    return String(query);
};
