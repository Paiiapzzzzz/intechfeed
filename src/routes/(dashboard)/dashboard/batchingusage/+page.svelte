<script lang="ts">
    //Batching Summary
    import Paper, { Title, Content } from "@smui/paper";
    import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
    import { DatePicker, DatePickerInput } from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";
    import Button, { Group, Label } from "@smui/button";
    import { Search } from "carbon-components-svelte";
    // import data from "../../../data.json";
    import { DatePicker, DatePickerInput } from "carbon-components-svelte";
    import DataTable, {
        Head,
        Body,
        Row,
        Cell,
        Pagination,
    } from "@smui/data-table";
    import Select, { Option } from "@smui/select";
    import IconButton from "@smui/icon-button";
    import { Label } from "@smui/common";
    import { onMount } from "svelte";
    import { json } from "@sveltejs/kit";
    import { read, utils, writeFileXLSX } from "xlsx";
    import { URL } from '$lib/shared/stores/url';
    // const a = data;
    // let items = a;

    //let items = a;
    type Todo = {
        JobNo: string;
        JobStart: string;
        JobStop: string;
        OrderNo: string;
        RecipeId: string;
        RecipeName: string;
        BatchQty: string;
        BatchActual: string;
        JobStatus: number;
        BatchNumber: string;
        id: number;
        Process: string;
        Step: string;
        RawMatName: string;
        SiloName: string;
        DosingLine: string;
        StartTime: string;
        StopTime: string;
        Duration: string;
        WeightSP: string;
        WeightActual: string;
        SumWeightDif: string;
        Remark: string;
        SumWeightSP: number;
        SumWeightActual: number;
    };
    //state
    //let items: Todo[] = [];
    let items: Todo[] = [];
    let items_2: Todo[] = [];
    let items_3: Todo[] = [];
    let rowsPerPage2 = 50;
    let currentPage = 0;
    let currentPage_2 = 0;
    let toggle = false;
    let processingItems = true;
    let searchTerm = "";
    let searchTerm2 = ""; //for search bar first table
    let link: any;
    $: filteredItems = items.filter((item) => item.JobNo);
    $: start = currentPage * rowsPerPage2;
    $: end = Math.min(start + rowsPerPage2, items.length);
    $: slice = items.slice(start, end);
    $: lastPage = Math.max(Math.ceil(items.length / rowsPerPage2) - 1, 0);

    $: if (currentPage > lastPage) {
        currentPage = lastPage;
    }

    $: start_2 = currentPage_2 * rowsPerPage2;
    $: end_2 = Math.min(start_2 + rowsPerPage2, items_2.length);
    $: slice_2 = items_2.slice(start_2, end_2);
    $: lastPage_2 = Math.max(Math.ceil(items_2.length / rowsPerPage2) - 1, 0);

    $: if (currentPage_2 > lastPage_2) {
        currentPage_2 = lastPage_2;
    }
    $: uniqueItems_JobNo = removeDuplicates(items, "JobNo");
    $: uniqueItems_RawMat = removeDuplicates(items, "RawMatName");
    $: uniqueItems_Line = removeDuplicates(items, "DosingLine");
    $: uniqueItems_Recipe = removeDuplicates(items, "RecipeName");
    onMount(async function currentdata() {
        URL.subscribe(value => {
            link = value;
        });
        if (typeof fetch !== "undefined") {
            // const url01 = `${link}/Get/Batching/Summary/Detail_filter.php`;
            // fetch(url01) // Send a GET request to the specified URL
            //     .then((response) => response.json())
            //     .then((json) => (items = json.slice(0)));
            const url02 = `${link}/Get/Batching/Summary/Summary_fliter.php`;
            fetch(url02) // Send a GET request to the specified URL
                .then((response) => response.json())
                .then((json) => (items_2 = json.slice(0)));
        }
    });
    async function searching() {
        let start = document.getElementById("startdate").value;
        let stop = document.getElementById("stopdate").value;
        let S_line = document.getElementById("SelectLine").value;
        let S_JobNo = document.getElementById("SelectJobNo").value;
        let S_Raw = document.getElementById("SelectRaw").value;
        let S_Recipe = document.getElementById("SelectRecipe").value;
        console.log("Line=" + S_line);
        if (typeof fetch !== "undefined") {
            // Slice a few off the end to show how the
            // last page looks when it's not full.
            const url1 = `${link}/Get/Batching/Summary/Detail_filter.php?date_get1=${start}&&date_get2=${stop}&&
            JobNo_get=${S_JobNo}&&Recipe_get=${S_Recipe}&&Raw_get=${S_Raw}&&Dosing_get=${S_line}`;
            fetch(url1)
                .then((response) => response.json())
                .then((json) => (items = json.slice(0)));
            // console.log(items);
        }
    }
    async function summary() {
        let start = document.getElementById("startdate").value;
        let stop = document.getElementById("stopdate").value;
        let S_Raw = document.getElementById("SelectRaw").value;
        if (typeof fetch !== "undefined") {
            // Slice a few off the end to show how the
            // last page looks when it's not full.
            const url2 = `${link}/Get/Batching/Summary/Summary_fliter.php?date_get1=${start}&&date_get2=${stop}&&Raw_get=${S_Raw}`;
            fetch(url2)
                .then((response) => response.json())
                .then((json) => (items_2 = json.slice(0)));
        }
    }
    function removeDuplicates(array: any, key: any) {
        const uniqueObjects: any[] = [];
        const uniqueKeys = new Set();

        array.forEach((object: any) => {
            const keyValue = object[key];
            if (!uniqueKeys.has(keyValue)) {
                uniqueKeys.add(keyValue);
                uniqueObjects.push(object);
            }
        });
        // console.log(uniqueObjects);
        return uniqueObjects;
    }
    function exportFile() {
        let start = document.getElementById("startdate").value;
        let stop = document.getElementById("stopdate").value;
        let S_line = document.getElementById("SelectLine").value;
        let S_JobNo = document.getElementById("SelectJobNo").value;
        let S_Raw = document.getElementById("SelectRaw").value;
        let S_Recipe = document.getElementById("SelectRecipe").value;
        const wb = utils.book_new();
        const headersItemshead = [
            `Batching Material Usage Report Range= ${start} - ${stop} RawName=${S_Raw} Line Batch=${S_line} JobNo=${S_JobNo} Recipe=${S_Recipe}`,
        ];
        const headersItemsname = ["Batching Material Usage Summary"];
        const headersItems2 = [
            "Raw Name",
            "Weight SP",
            "Weight Actual",
            "Weight Diff",
        ];
        const headersItemsname2 = ["Batching Process Detail"];
        const headersItems = [
            "Job No.",
            "Recipe Name",
            "Line Batching",
            "Batch No.",
            "Raw Name",
            "Step No.",
            "Start DTM",
            "Stop DTM",
            "Weight SP",
            "Weight Actual",
            "Weight Diff",
            "Silo Name",
            "Remark",
        ];
        const combinedItems = [
            headersItemshead,
            headersItemsname,
            headersItems2,
            ...items_2.map(Object.values), // Extract values from objects in items_3
            headersItemsname2,
            headersItems,
            ...items.map(Object.values), // Extract values from objects in items_2
        ] as any[][]; // Type assertion to specify the array type

        const wsCombinedItems = utils.aoa_to_sheet(combinedItems);
            var t1 = 4 ;
            var t1_end = items_2.length + 3;
            // console.log(i2);
            for(t1=4; t1<=t1_end; t1++){
                // console.log(i2);
                if(wsCombinedItems[`B${t1}`] != null){
                    // console.log(wsCombinedItems[`F${i}`].v);
                    wsCombinedItems[`B${t1}`].t = 'n';
                    wsCombinedItems[`C${t1}`].t = 'n';
                    wsCombinedItems[`D${t1}`].t = 'n';
                }    
            }
            var t2 = t1_end + 3 ;
            var t2_end = items.length + (t2-1);
            for(t2; t2<=t2_end; t2++){
                if(wsCombinedItems[`I${t2}`] != null){
                    wsCombinedItems[`I${t2}`].t = 'n';
                    wsCombinedItems[`J${t2}`].t = 'n';
                    wsCombinedItems[`K${t2}`].t = 'n';
                }    
            }
        utils.book_append_sheet(wb, wsCombinedItems, "Combined Data");
        const columnWidths = [
            { wch: 12 }, // Width of "Job No." column
            { wch: 18 }, // Width of "Start DTM" column
            { wch: 18 }, // Width of "Stop DTM" column
            { wch: 12 }, // Width of "Recipe Name" column
            { wch: 12 }, // Width of "Batch Total" column
            { wch: 12 }, // Width of "Batch Actual" column
            { wch: 12 }, // Width of "Status" column
            { wch: 20 }, // width of "weight diff"
            { wch: 20 }, // width of "stop time"
            { wch: 12 }, // width of "total time"
            { wch: 12 }, // width of "weight Sp"
            { wch: 12 }, // width of "weight Ac"
            { wch: 12 }, // width of "weight Diff"
            { wch: 12 }, // width of "Remark"
            // ... and so on for other columns
        ];

        // Set column widths
        columnWidths.forEach((width, columnIndex) => {
            const colRef = utils.encode_col(columnIndex + 1); // Get the column reference (e.g., "A", "B", "C")
            wsCombinedItems["!cols"] = wsCombinedItems["!cols"] || [];
            wsCombinedItems["!cols"].push({
                ...width,
                ...{ min: columnIndex + 1, max: columnIndex + 1 },
            }); // Set width for the specific column
        });

        writeFileXLSX(wb, `Batching Material Usage Report ${S_JobNo}.xlsx`);
    }
</script>

<div class="paper-container">
    <div class="bar">
        <OverflowMenu style="background-color: #4b7e7b;" />
        <p class="namebar">
            เงื่อนไขการดึงข้อมูลรายงาน Batching Material Usage
        </p>
    </div>
    <Paper>
        <Content>
            <div class="">
                <div class="grid grid-cols-3 gap-8 mb-10 mt-10 ml-10">
                    <div>
                        <div
                            style="display: flex; align-items: center;"
                            class="flex flex-row justify-end"
                        >
                            <div
                                style="margin-right: 10px; font-size: initial;"
                            >
                                Range
                            </div>
                            <div style="width: 80%;" class="flex justify-start">
                                <DatePicker
                                    datePickerType="range"
                                    dateFormat="Y/m/d"
                                    on:change
                                >
                                    <DatePickerInput
                                        id="startdate"
                                        labelText="Start date"
                                        placeholder="yyyy/mm/dd"
                                        type="text"
                                    />
                                    <DatePickerInput
                                        id="stopdate"
                                        labelText="End date"
                                        placeholder="yyyy/mm/dd"
                                        type="text"
                                    />
                                </DatePicker>
                            </div>
                        </div>
                    </div>
                    <div
                        style="display: flex; align-items: center;"
                        class="flex justify-center"
                    >
                        <span style="margin-right: 10px; font-size: initial;"
                            >Recipe</span
                        >
                        <select
                            class=" barwidth bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="SelectRecipe"
                        >
                            <option selected>ALL</option>
                            {#each uniqueItems_Recipe as item (item.RecipeName)}
                                <option>{item.RecipeName}</option>
                            {/each}
                        </select>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: 10px; font-size: initial;"
                            >LineBatching</span
                        >
                        <select
                            class="barwidth bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="SelectLine"
                        >
                            <option selected>ALL</option>
                            {#each uniqueItems_Line as item (item.DosingLine)}
                                <option>{item.DosingLine}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <!-- newline -->
                <div class="flex flex-row w-full pl-10 pr-20">
                    <div
                        style="display: flex; align-items: center;"
                        class="flex w-full justify-start"
                    >
                        <span style="margin-right: 10px; font-size: initial;"
                            >Raw Material</span
                        >
                        <select
                            class="barwidth bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="SelectRaw"
                        >
                            <option selected>ALL</option>
                            {#each uniqueItems_RawMat as item (item.RawMatName)}
                                <option>{item.RawMatName}</option>
                            {/each}
                        </select>
                    </div>
                    <div
                        style="display: flex; align-items: center;"
                        class="flex w-full justify-start"
                    >
                        <span style="margin-right: 10px; font-size: initial;"
                            >Job No.</span
                        >
                        <select
                            class="barwidth bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="SelectJobNo"
                        >
                            <option selected>ALL</option>
                            {#each uniqueItems_JobNo as item (item.JobNo)}
                                <option>{item.JobNo}</option>
                            {/each}
                        </select>
                    </div>
                    <button
                        on:click={searching}
                        on:click={summary}
                        on:click={() => (toggle = true)}
                        type="button"
                        class="flex w-1/2 justify-center text-white bg-[#4b7e7b] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-3 py-1.5 text-center items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <svg
                            aria-hidden="true"
                            class="w-4 h-4 mr-1 -ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z"
                            />
                        </svg>
                        search
                    </button>
                </div>
            </div>
        </Content>
    </Paper>
</div>
<div class="mt-10">
    <!-- <button
        type="button"
        class="text-white bg-[#fbbd42] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
        <svg
            aria-hidden="true"
            class="w-4 h-4 mr-1 -ml-0.5"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
        >
            <path style="fill:#ffffff;stroke:none;" d="m 65,3 0,19 19,0 z" />
            <path
                style="fill:#EBEBDA;stroke:#777777;stroke-width:2;"
                d="m 65,3 0,19 19,0 0,74 -72,0 0,-93 53,0 19,19"
            />
            <path
                style="fill:none;stroke:#C01A1A;stroke-width:4;"
                d="m 49,56 c -17,4 -27,10 -29,14 -2,4 -1,9 6,4 7,-5 20,-32 23,-53 1,-7 -7,-11 -7,-2 0,12 6,34 30,41 9,2 10,-7 0,-7 -10,0 -23,3 -23,3 z"
            />
        </svg>
        Export PDF
    </button> -->

    <button
        on:click={exportFile}
        type="button"
        class="text-white bg-[#78cd51] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
        <svg
            aria-hidden="true"
            class="w-4 h-4 mr-1 -ml-0.5"
            viewBox="-4 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            ><path
                d="M5.112.006c-2.802 0-5.073 2.273-5.073 5.074v53.841c0 2.803 2.271 5.074 5.073 5.074h45.774c2.801 0 5.074-2.271 5.074-5.074v-38.605l-18.902-20.31h-31.946z"
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#45B058"
            /><path
                d="M19.429 53.938c-.216 0-.415-.09-.54-.27l-3.728-4.97-3.745 4.97c-.126.18-.324.27-.54.27-.396 0-.72-.306-.72-.72 0-.144.035-.306.144-.432l3.89-5.131-3.619-4.826c-.09-.126-.145-.27-.145-.414 0-.342.288-.72.721-.72.216 0 .432.108.576.288l3.438 4.628 3.438-4.646c.127-.18.324-.27.541-.27.378 0 .738.306.738.72 0 .144-.036.288-.127.414l-3.619 4.808 3.891 5.149c.09.126.125.27.125.414 0 .396-.324.738-.719.738zm9.989-.126h-5.455c-.595 0-1.081-.486-1.081-1.08v-10.317c0-.396.324-.72.774-.72.396 0 .721.324.721.72v10.065h5.041c.359 0 .648.288.648.648 0 .396-.289.684-.648.684zm6.982.216c-1.782 0-3.188-.594-4.213-1.495-.162-.144-.234-.342-.234-.54 0-.36.27-.756.702-.756.144 0 .306.036.433.144.828.738 1.98 1.314 3.367 1.314 2.143 0 2.826-1.152 2.826-2.071 0-3.097-7.111-1.386-7.111-5.672 0-1.98 1.764-3.331 4.123-3.331 1.548 0 2.881.468 3.853 1.278.162.144.253.342.253.54 0 .36-.307.72-.703.72-.145 0-.307-.054-.432-.162-.883-.72-1.98-1.044-3.079-1.044-1.44 0-2.467.774-2.467 1.909 0 2.701 7.112 1.152 7.112 5.636 0 1.748-1.188 3.53-4.43 3.53z"
                fill="#ffffff"
            /><path
                d="M55.953 20.352v1h-12.801s-6.312-1.26-6.127-6.707c0 0 .207 5.707 6.002 5.707h12.926z"
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#349C42"
            /><path
                d="M37.049 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.801l-18.905-20.352z"
                opacity=".5"
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="#ffffff"
            /></svg
        >
        Export Excel
    </button>
</div>
    <div class="table-wrapper mt-10">
        <div
            class="inline-flex"
            style="display: flex; justify-content: stretch;"
        >
            <button
                class="textclass bg-gray-500 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                style="width: 50%; flex-grow: 1; background-color: {processingItems
                    ? '#4b7e7b'
                    : undefined}; color: white;"
                on:click={() => (processingItems = true)}
            >
                Process Detail
            </button>
            <button
                class="textclass bg-gray-500 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                style="width: 50%; flex-grow: 1; background-color: {!processingItems
                    ? '#4b7e7b'
                    : undefined}; color: white;"
                on:click={() => (processingItems = false)}
            >
                Batching Material Usage Summary
            </button>
        </div>
        {#if processingItems === true}
            <DataTable table$aria-label="Todo list" style="width: 100%;">
                <Head>
                    <Row>
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Job No.</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">RecipeName</Cell
                        >
                        <Cell
                            style="padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Batch No.</Cell
                        >
                        <Cell
                            style="padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Raw Name</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Step No.</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Start DTM</Cell
                        >
                        <Cell
                            style="padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Stop DTM</Cell
                        >
                        <Cell
                            style=" width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Weight SP</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Weight AC</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Weight Diff</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">SiloName</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Line Batching</Cell
                        >
                        <Cell
                            style=" padding: 0;  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Remark</Cell
                        >
                    </Row>
                </Head>
                <Body>
                    {#each slice as item}
                        <Row style=" line-height: 1rem; height: 20px;">
                            <Cell
                                style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.JobNo}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.RecipeName}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.BatchNumber}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.RawMatName}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.Step}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.StartTime}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.StopTime}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.WeightSP == null
                                    ? ""
                                    : Number(item.WeightSP).toLocaleString(
                                          undefined,
                                          {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          }
                                      )}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.WeightActual == null
                                    ? ""
                                    : Number(item.WeightActual).toLocaleString(
                                          undefined,
                                          {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          }
                                      )}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.SumWeightDif == null
                                    ? ""
                                    : Number(item.SumWeightDif).toLocaleString(
                                          undefined,
                                          {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          }
                                      )}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.SiloName}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.DosingLine}</Cell
                            >
                            <Cell
                                style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                >{item.Remark}</Cell
                            >
                        </Row>
                    {/each}
                </Body>

                <Pagination slot="paginate">
                    <svelte:fragment slot="rowsPerPage">
                        <Label>Rows Per Page</Label>
                        <Select
                            variant="outlined"
                            bind:value={rowsPerPage2}
                            noLabel
                        >
                            <Option value={10}>10</Option>
                            <Option value={25}>25</Option>
                            <Option value={50}>50</Option>
                        </Select>
                    </svelte:fragment>
                    <svelte:fragment slot="total">
                        {start + 1}-{end} of {items.length}
                    </svelte:fragment>

                    <IconButton
                        class="material-icons"
                        action="first-page"
                        title="First page"
                        on:click={() => (currentPage = 0)}
                        disabled={currentPage === 0}>first_page</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        action="prev-page"
                        title="Prev page"
                        on:click={() => currentPage--}
                        disabled={currentPage === 0}>chevron_left</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        action="next-page"
                        title="Next page"
                        on:click={() => currentPage++}
                        disabled={currentPage === lastPage}
                        >chevron_right</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        action="last-page"
                        title="Last page"
                        on:click={() => (currentPage = lastPage)}
                        disabled={currentPage === lastPage}
                        >last_page</IconButton
                    >
                </Pagination>
            </DataTable>
        {:else}
            <DataTable table$aria-label="Todo list" style="width: 100%;">
                <Head>
                    <Row>
                        <Cell
                            style="padding: 0; width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
        line-height: 1.75rem;">Raw Name</Cell
                        >
                        <Cell
                            style="padding: 0; width: 2%; text-align: center; vertical-align: middle; font-size: 1.125rem; 
        line-height: 1.75rem;">SumWeightSP</Cell
                        >
                        <Cell
                            style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
        line-height: 1.75rem;">SumWeightAc</Cell
                        >
                        <Cell
                            style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
        line-height: 1.75rem;">SumWeightDiff</Cell
                        >
                    </Row>
                </Head>
                <Body>
                    {#each slice_2 as item_2 (item_2.RawMatName)}
                        <Row style=" line-height: 1rem; height: 20px;">
                            <Cell
                                style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                >{item_2.RawMatName}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                >{item_2.SumWeightSP == null
                                    ? ""
                                    : Number(item_2.SumWeightSP).toLocaleString(
                                          undefined,
                                          {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          }
                                      )}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                >{item_2.SumWeightActual == null
                                    ? ""
                                    : Number(
                                          item_2.SumWeightActual
                                      ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      })}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                >{item_2.SumWeightDif == null
                                    ? ""
                                    : Number(
                                          item_2.SumWeightDif
                                      ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      })}</Cell
                            >
                        </Row>
                    {/each}
                </Body>

                <Pagination slot="paginate">
                    <svelte:fragment slot="rowsPerPage">
                        <Label>Rows Per Page</Label>
                        <Select
                            variant="outlined"
                            bind:value={rowsPerPage2}
                            noLabel
                        >
                            <Option value={10}>10</Option>
                            <Option value={25}>25</Option>
                            <Option value={50}>50</Option>
                        </Select>
                    </svelte:fragment>
                    <svelte:fragment slot="total">
                        {start_2 + 1}-{end_2} of {items_2.length}
                    </svelte:fragment>

                    <IconButton
                        class="material-icons"
                        action="first-page"
                        title="First page"
                        on:click={() => (currentPage_2 = 0)}
                        disabled={currentPage_2 === 0}>first_page</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        action="prev-page"
                        title="Prev page"
                        on:click={() => currentPage_2--}
                        disabled={currentPage_2 === 0}>chevron_left</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        action="next-page"
                        title="Next page"
                        on:click={() => currentPage_2++}
                        disabled={currentPage_2 === lastPage_2}
                        >chevron_right</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        action="last-page"
                        title="Last page"
                        on:click={() => (currentPage_2 = lastPage_2)}
                        disabled={currentPage_2 === lastPage_2}
                        >last_page</IconButton
                    >
                </Pagination>
            </DataTable>
        {/if}
    </div>

<style>
    .bar {
        display: flex;
        align-items: center;
        height: 41px;
    }

    .namebar {
        border: 2px solid #4b7e7b;
        height: 40px;
        flex-grow: 1;
        background-color: #4b7e7b;
        display: flex;
        align-items: center;
        color: rgb(250 250 250);
    }
    .barwidth {
        width: 50%;
    }
    .barwidth2 {
        width: 30%;
    }
</style>