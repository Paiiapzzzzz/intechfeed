<script lang="ts">
    //Dosing Report
    import "carbon-components-svelte/css/white.css";
    import Button, { Group, Label } from "@smui/button";
    import { Search } from "carbon-components-svelte";
    import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
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
        DosingNo: string;
        MixerNo: string;
    };
    //state
    //let items: Todo[] = [];
    let items: Todo[] = [];
    let items_2: Todo[] = [];
    let items_3: Todo[] = [];
    let items_4: Todo[] = [];
    let rowsPerPage = 5;
    let rowsPerPage2 = 50;
    let currentPage = 0;
    let currentPage_2 = 0;
    let currentPage_3 = 0;
    let x1 = "";
    let x2 = "";
    let x1_tag = "";
    let x2_tag = "";
    let toggle = false;
    let processingItems = true;
    let searchTerm = "";
    let searchTerm2 = ""; //for search bar first table
    let textclass = "";
    textclass = processingItems == true ? "button1" : "button2";
    let link: any;
    // $: exportItems = items.filter((item) => item.JobNo);
    $: filteredItems = items.filter((item) => item.JobNo.includes(searchTerm));
    $: filteredItems2 = items_2.filter((item_2) =>
        item_2.BatchNumber.includes(searchTerm2)
    );
    $: start = currentPage * rowsPerPage;
    $: end = Math.min(start + rowsPerPage, items.length);
    $: slice = items.slice(start, end);
    $: lastPage = Math.max(Math.ceil(items.length / rowsPerPage) - 1, 0);

    $: if (currentPage > lastPage) {
        currentPage = lastPage;
    }

    $: start_2 = currentPage_2 * rowsPerPage2;
    $: end_2 = Math.min(start_2 + rowsPerPage2, filteredItems2.length);
    $: slice_2 = items_2.slice(start_2, end_2);
    $: lastPage_2 = Math.max(Math.ceil(items_2.length / rowsPerPage2) - 1, 0);

    $: if (currentPage_2 > lastPage_2) {
        currentPage_2 = lastPage_2;
    }

    $: start_3 = currentPage_3 * rowsPerPage2;
    $: end_3 = Math.min(start_3 + rowsPerPage2, items_3.length);
    $: slice_3 = items_3.slice(start_3, end_3);
    $: lastPage_3 = Math.max(Math.ceil(items_3.length / rowsPerPage2) - 1, 0);

    $: if (currentPage_3 > lastPage_3) {
        currentPage_3 = lastPage_3;
    }
    onMount(async function currentdata() {
        URL.subscribe(value => {
            link = value;
        });
        if (typeof fetch !== "undefined") {
            const url = `${link}/Get/Dosing/Report/Report_ByDate.php`;
            fetch(url) // Send a GET request to the specified URL
                .then((response) => response.json())
                .then((json) => (items = json.slice(0)));
        }
    });
    async function searching() {
        x1_tag = document.getElementById("startdate").value;
        x2_tag = document.getElementById("stopdate").value;
        x1 = "2023/02/01";
        x2 = "2023/02/03";
        console.log("day1=" + x1_tag);
        console.log("day2=" + x2_tag);
        if (typeof fetch !== "undefined") {
            // Slice a few off the end to show how the
            // last page looks when it's not full.
            const url1 = `${link}/Get/Dosing/Report/Report_ByDate.php?date_get1=${x1_tag}&&date_get2=${x2_tag}`;
            fetch(url1)
                .then((response) => response.json())
                .then((json) => (items = json.slice(0)));
            //         .then((data) => {
            //         return data.json(); //convert to json format (object)
            // }).then((objectData) => {
            // console.log(objectData);
            // })
        }
    }
    async function viewmore(JobNum: any) {
        // var JobNo;
        // JobNo = document.getElementById(`JobNo`)?.innerHTML;
        console.log("JobNo=" + JobNum);
        if (typeof fetch !== "undefined") {
            // Slice a few off the end to show how the
            // last page looks when it's not full.
            const url2 = `${link}/Get/Dosing/Report/Detail_ByJobNo.php?JobNo_get=${JobNum}`;
            fetch(url2)
                .then((response) => response.json())
                .then((json) => (items_2 = json.slice(0)));
            const url3 = `${link}/Get/Dosing/Report/Summary_ByJobNo.php?JobNo_get=${JobNum}`;
            fetch(url3)
                .then((response) => response.json())
                .then((json) => (items_3 = json.slice(0)));
            // console.log(items_2);
        }
    }
    async function exportFile(JobNum: any) {
        console.log("JobNo=" + JobNum);
        if (typeof fetch !== "undefined") {
            // Slice a few off the end to show how the
            // last page looks when it's not full.
            const url4 = `${link}/Get/Dosing/Report/Report_ByJobNo.php?JobNo_get=${JobNum}`;
            fetch(url4)
                .then((response) => response.json())
                .then((json) => (items_4 = json.slice(0)));
            const url2 = `${link}/Get/Dosing/Report/Detail_ByJobNo.php?JobNo_get=${JobNum}`;
            fetch(url2)
                .then((response) => response.json())
                .then((json) => (items_2 = json.slice(0)));
            const url3 = `${link}/Get/Dosing/Report/Summary_ByJobNo.php?JobNo_get=${JobNum}`;
            fetch(url3)
                .then((response) => response.json())
                .then((json) => (items_3 = json.slice(0)));
            // console.log(items_4);
            // setTimeout(() => {
            //     console.log(items_4);
            // }, 500);
        }

        const wb = utils.book_new();
        const headersItemshead = [`Dosing Report JobNo=${JobNum}`];
        const headersItems4 = [
            "Job No.",
            "Start DTM",
            "Stop DTM",
            "Recipe Name",
            "Batch Total",
            "DosingNo",
            "MixingNo",
            "Batch Actual",
            "Status",
        ];
        const headersItemsname3 = ["Dosing Material Usage Summary"];
        const headersItems3 = [
            "Job No.",
            "Batch Total",
            "Process",
            "Step",
            "Raw Name",
            "Weight SP",
            "Weight Ac",
            "Weight Diff",
        ];
        const headersItemsname2 = ["Dosing Process Detail"];
        const headersItems2 = [
            "Job No.",
            "Batch No.",
            "Process",
            "Step",
            "Raw name",
            "Start Time",
            "Stop Time",
            "Total Time",
            "Weight SP",
            "Weight AC",
            "Weight Diff",
            "Remark",
        ];
        setTimeout(() => {
            

            const combinedItems = [
                headersItemshead,
                headersItems4,
                ...items_4.map(Object.values),
                headersItemsname3,
                headersItems3,
                ...items_3.map(Object.values), // Extract values from objects in items_3
                headersItemsname2,
                headersItems2,
                ...items_2.map(Object.values), // Extract values from objects in items_2
            ] as any[][]; // Type assertion to specify the array type

            const wsCombinedItems = utils.aoa_to_sheet(combinedItems);
            var t1 = 6 ;
            var t1_end = items_3.length + 5;
            // console.log(i2);
            for(t1=6; t1<=t1_end; t1++){
                // console.log(i2);
                if(wsCombinedItems[`F${t1}`] != null){
                    // console.log(wsCombinedItems[`F${i}`].v);
                    wsCombinedItems[`F${t1}`].t = 'n';
                    wsCombinedItems[`G${t1}`].t = 'n';
                    wsCombinedItems[`H${t1}`].t = 'n';
                }    
            }
            var t2 = t1_end + 3 ;
            var t2_end = items_2.length + (t2-1);
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

            writeFileXLSX(wb, `Liquid Dosing Report${JobNum}.xlsx`);
        }, 2000);
    }
</script>

<div class="bar">
    <OverflowMenu style="background-color: #36a9e1;" />
    <p class="namebar">เงื่อนไขการดึงข้อมูลรายงาน Liquid Dosing Report</p>
</div>
<div class="container text-center">
    <div class="table-wrapper">
        <div class="date-picker-wrapper">
            <div class="flex ml-4">
                <DatePicker datePickerType="range" dateFormat="Y/m/d" on:change>
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
                    <div class="flex items-end ml-4">
                        <Button
                            on:click={searching}
                            color="secondary"
                            variant="outlined"
                            class="date-picker-button"
                        >
                            <Label>Search</Label>
                        </Button>
                        <Search
                            class="ml-3"
                            placeholder="Search by Job No."
                            bind:value={searchTerm}
                        />
                    </div>
                </DatePicker>
            </div>
        </div>

        <DataTable
            table$aria-label="Todo list"
            style="width: 100%; text-align: center;  "
        >
            <Head>
                <Row>
                    <Cell
                        style=" text-align: center; vertical-align: middle; font-size: 1.125rem; 
                        line-height: 1.75rem;  ">Job No.</Cell
                    >
                    <Cell
                        style="width: 10%; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                        line-height: 1.75rem; ">Start DTM</Cell
                    >
                    <Cell
                        style="width: 10%; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                        line-height: 1.75rem;">Stop DTM</Cell
                    >
                    <Cell
                        style="text-align: center; vertical-align: middle;  font-size: 1.125rem; 
                    line-height: 1.75rem;">RecipeName</Cell
                    >
                    <Cell
                        style="text-align: center; vertical-align: middle; font-size: 1.125rem; 
                    line-height: 1.75rem;">Batch Total</Cell
                    >
                    <Cell
                        style="text-align: center; vertical-align: middle; font-size: 1.125rem; 
                    line-height: 1.75rem;">DosingNo</Cell
                    >
                    <Cell
                        style="text-align: center; vertical-align: middle; font-size: 1.125rem; 
                line-height: 1.75rem;">MixingNo</Cell
                    >
                    <Cell
                        style="text-align: center; vertical-align: middle; font-size: 1.125rem; 
                    line-height: 1.75rem;">Status</Cell
                    >
                    <Cell />
                </Row>
            </Head>
            <Body>
                {#each filteredItems.slice(start, end) as item (item.JobNo)}
                    {#if item.JobNo.includes(searchTerm)}
                        <Row>
                            <Cell
                                style="text-align: center; vertical-align: middle; "
                                >{item.JobNo}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.JobStart}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.JobStop}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.RecipeName}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.BatchQty}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.DosingNo}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.MixerNo}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                                >{item.JobStatus}</Cell
                            >
                            <Cell
                                style="text-align: center; vertical-align: middle;"
                            >
                                <div>
                                    <div class="mb-2">
                                        <button
                                            on:click={viewmore(`${item.JobNo}`)}
                                            on:click={() => (toggle = true)}
                                            type="button"
                                            class="text-white bg-[#60bfee] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                                            View more
                                        </button>
                                    </div>
                                    <div class="mb-2">
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
                                                <path
                                                    style="fill:#ffffff;stroke:none;"
                                                    d="m 65,3 0,19 19,0 z"
                                                />
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
                                    </div>
                                    <div>
                                        <button
                                            on:click={exportFile(
                                                `${item.JobNo}`
                                            )}
                                            
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
                                </div>
                            </Cell>
                        </Row>
                    {/if}
                {/each}
            </Body>

            <Pagination slot="paginate">
                <svelte:fragment slot="rowsPerPage">
                    <Label>Rows Per Page</Label>
                    <Select variant="outlined" bind:value={rowsPerPage} noLabel>
                        <Option value={5}>5</Option>
                        <Option value={10}>10</Option>
                        <Option value={20}>20</Option>
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
                    disabled={currentPage === lastPage}>last_page</IconButton
                >
            </Pagination>
        </DataTable>
    </div>

    {#if toggle}
        <div class="table-wrapper mt-10">
            <Search
                placeholder="Search by Batch No."
                bind:value={searchTerm2}
            />
            <div
                class="inline-flex"
                style="display: flex; justify-content: stretch;"
            >
                <button
                    class="textclass bg-gray-500 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                    style="width: 50%; flex-grow: 1; background-color: {processingItems
                        ? '#36a9e1'
                        : undefined}; color: white;"
                    on:click={() => (processingItems = true)}
                >
                    Process Detail
                </button>
                <button
                    class="textclass bg-gray-500 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                    style="width: 50%; flex-grow: 1; background-color: {!processingItems
                        ? '#36a9e1'
                        : undefined}; color: white;"
                    on:click={() => (processingItems = false)}
                >
                    Dosing Material Usage Summary
                </button>
            </div>
            {#if processingItems === true}
                <DataTable table$aria-label="Todo list" style="width: 100%;">
                    <Head>
                        <Row>
                            <Cell
                                style="padding: 0; width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Job No.</Cell
                            >
                            <Cell
                                style="padding: 0; width: 2%; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Batch No.</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Process</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Step</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Raw name</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Start Time</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Stop Time</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Total Time</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Weight SP</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Weight AC</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Weight Diff</Cell
                            >
                            <Cell
                                style="padding: 0; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Remark</Cell
                            >
                        </Row>
                    </Head>
                    <Body>
                        {#each filteredItems2.slice(start_2, end_2) as item_2}
                            {#if item_2.BatchNumber.includes(searchTerm2)}
                                <Row style=" line-height: 1rem; height: 20px; {item_2.Process == 'Total Dosing' ? 'background-color: yellow;' : ''}">
                                    <Cell
                                        style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.JobNo}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.BatchNumber}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.Process}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.Step == null
                                            ? ""
                                            : item_2.Step}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0;  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.RawMatName == null
                                            ? ""
                                            : item_2.RawMatName}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.StartTime}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.StopTime}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.Duration}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.WeightSP == null
                                            ? ""
                                            : Number(
                                                  item_2.WeightSP
                                              ).toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              })}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.WeightActual == null
                                            ? ""
                                            : Number(
                                                  item_2.WeightActual
                                              ).toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              })}</Cell
                                    >
                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                                        >{item_2.SumWeightDif == null
                                            ? ""
                                            : Number(
                                                  item_2.SumWeightDif
                                              ).toLocaleString(undefined, {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              })}</Cell
                                    >

                                    <Cell
                                        style="margin: 0; padding: 0; text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                        >{item_2.Remark}</Cell
                                    >
                                </Row>
                            {/if}
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
                            disabled={currentPage_2 === 0}
                            >first_page</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="prev-page"
                            title="Prev page"
                            on:click={() => currentPage_2--}
                            disabled={currentPage_2 === 0}
                            >chevron_left</IconButton
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
            {:else}
                <DataTable table$aria-label="Todo list" style="width: 100%;">
                    <Head>
                        <Row>
                            <Cell
                                style=" width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Job No.</Cell
                            >
                            <Cell
                                style="width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Batch Total</Cell
                            >
                            <Cell
                                style=" width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Process</Cell
                            >
                            <Cell
                                style="width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Step</Cell
                            >
                            <Cell
                                style=" width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">Raw Name</Cell
                            >
                            <Cell
                                style=" width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">SumWeightSP</Cell
                            >
                            <Cell
                                style="width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">SumWeightAc</Cell
                            >
                            <Cell
                                style=" width: ; text-align: center; vertical-align: middle; font-size: 1.125rem; 
                            line-height: 1.75rem;">SumWeightDiff</Cell
                            >
                        </Row>
                    </Head>
                    <Body>
                        {#each slice_3 as item_3 (item_3.RawMatName)}
                            <Row style=" line-height: 1rem; height: 20px;">
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.JobNo}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.BatchActual}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.Process}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.Step}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.RawMatName}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.SumWeightSP == null
                                        ? ""
                                        : Number(
                                              item_3.SumWeightSP
                                          ).toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.SumWeightActual == null
                                        ? ""
                                        : Number(
                                              item_3.SumWeightActual
                                          ).toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })}</Cell
                                >
                                <Cell
                                    style="text-align: center; vertical-align: middle; line-height: 1rem; height: 1.25rem;"
                                    >{item_3.SumWeightDif == null
                                        ? ""
                                        : Number(
                                              item_3.SumWeightDif
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
                            {start_3 + 1}-{end_3} of {items_3.length}
                        </svelte:fragment>

                        <IconButton
                            class="material-icons"
                            action="first-page"
                            title="First page"
                            on:click={() => (currentPage_3 = 0)}
                            disabled={currentPage_3 === 0}
                            >first_page</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="prev-page"
                            title="Prev page"
                            on:click={() => currentPage_3--}
                            disabled={currentPage_3 === 0}
                            >chevron_left</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="next-page"
                            title="Next page"
                            on:click={() => currentPage_3++}
                            disabled={currentPage_3 === lastPage_3}
                            >chevron_right</IconButton
                        >
                        <IconButton
                            class="material-icons"
                            action="last-page"
                            title="Last page"
                            on:click={() => (currentPage_3 = lastPage_3)}
                            disabled={currentPage_3 === lastPage_3}
                            >last_page</IconButton
                        >
                    </Pagination>
                </DataTable>
            {/if}
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 103%;
        max-width: none; /* Adjust the height as needed */
    }

    .table-wrapper {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
    }

    .button-group button {
        width: calc(50% - 10px); /* Adjust the padding (10px) as needed */
    }
    .date-picker-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
    }

    .date-picker-button {
        margin-right: 10px;
    }
    .centered {
        text-align: center;
    }
    .button1 {
        background-color: rgb(47, 136, 196);
    }
    .button2 {
        background-color: rgb(155, 163, 163);
    }
    .bar {
        display: flex;
        align-items: center;
        height: 41px;
        width: 103%;
    }
    .namebar {
        border: 2px solid #36a9e1;
        height: 40px;
        flex-grow: 1;
        background-color: #36a9e1;
        display: flex;
        align-items: center;
        color: rgb(250 250 250);
    }
</style>