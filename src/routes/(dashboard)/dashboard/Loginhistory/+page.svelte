<script lang="ts">
    //LoginHistory
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
    import { URL } from '$lib/shared/stores/url';
    type Todo = {
        id: number;
        UserName: string;
        IPAddress: string;
        LoginDateTime: string;

    };

    let items: Todo[] = [];
    let rowsPerPage2 = 25;
    let currentPage = 0;
    let currentPage_2 = 0;
    let x1 = "";
    let x2 = "";
    let x1_tag = "";
    let x2_tag = "";
    let link: any;
    $: start = currentPage * rowsPerPage2;
    $: end = Math.min(start + rowsPerPage2, items.length);
    $: slice = items.slice(start, end);
    $: lastPage = Math.max(Math.ceil(items.length / rowsPerPage2) - 1, 0);

    $: if (currentPage > lastPage) {
        currentPage = lastPage;
    }
    onMount(async function currentdata() {
        URL.subscribe(value => {
            link = value;
        });
        if (typeof fetch !== "undefined") {
            const url = `${link}/Get/UserHistory/UsersHistory_Get.php`;
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
            const url1 = `${link}/Get/UserHistory/UsersHistory_Get.php?date_get1=${x1_tag}&&date_get2=${x2_tag}`;
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
</script>

<div class="paper-container">
    <div class="bar">
        <OverflowMenu style="background-color: #876bd6;" />
        <p class="namebar">เงื่อนไขการดึงประวัติการ Login</p>
    </div>
    <Paper>
        <Content>
            <div class="flex justify-center items-center h-full">
                <div class="grid grid-cols-2 gap-8 mb-10 mt-10 ml-10 w-30%">
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
                    <button
                        on:click={searching}
                        type="button"
                        class="flex w-1/2 h-10 justify-center text-white bg-[#755abe] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm px-3 py-1.5 text-center items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                        search by date
                    </button>
                </div>
            </div>
        </Content>
    </Paper>
</div>

<div class="table-wrapper mt-10">
    <DataTable table$aria-label="Todo list" style="width: 100%;">
        <Head>
            <Row>
                <Cell
                    style="width: 20%; text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Login DateTime</Cell
                >
                <Cell
                    style="  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">UserName</Cell
                >
                <Cell
                    style="  text-align: center; vertical-align: middle; font-size: 1.125rem; 
            line-height: 1.75rem;">Status</Cell
                >
            </Row>
        </Head>
        <Body>
            {#each slice as item}
                <Row style=" line-height: 1rem; height: 20px;">
                    <Cell
                        style="  text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                        >{item.LoginDateTime}</Cell
                    >
                    <Cell
                        style=" text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                        >{item.UserName}</Cell
                    >
                    <Cell
                        style=" text-align: center; vertical-align: middle; line-height: 1rem; height: 1.5rem;"
                        >{item.IPAddress}</Cell
                    >
                </Row>
            {/each}
        </Body>

        <Pagination slot="paginate">
            <svelte:fragment slot="rowsPerPage">
                <Label>Rows Per Page</Label>
                <Select variant="outlined" bind:value={rowsPerPage2} noLabel>
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
                disabled={currentPage === lastPage}>chevron_right</IconButton
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

<style>
    .bar {
        display: flex;
        align-items: center;
        height: 41px;
    }

    .namebar {
        border: 2px solid #876bd6;
        height: 40px;
        flex-grow: 1;
        background-color: #876bd6;
        display: flex;
        align-items: center;
        color: rgb(250 250 250);
    }
</style>