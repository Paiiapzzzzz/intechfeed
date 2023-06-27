<script lang="ts">
  import "../../../app.postcss";
  import {
    Header,
    HeaderUtilities,
    HeaderGlobalAction,
    SideNav,
    SideNavItems,
    Content,
    Grid,
    Row,
    Column,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  let isSideNavOpen = false;
  type Todo = {
    id: number;
    Operator_ID: string;
    role_name: string;
    pass_word: string;
    image: string;
    full_name: string;
  };
  import usernameglobal from "$lib/shared/stores/username";
  import { writable } from "svelte/store";
  import { URL } from '$lib/shared/stores/url';
  const defaultValue = "";
  const globalusername = writable<string>(defaultValue);
  let current: string;

  // import { usernameRead } from "../../+page.svelte"
  // console.log(currentrole);
  let users: Todo[] = []; // Define an empty array to store the fetched users
  let showError = false;
  let link: any;
  onMount(async () => {
    URL.subscribe(value => {
            link = value;
    });
    usernameglobal.subscribe((value) => {
      current = value;
    });
    // console.log(current);
    // console.log("4");
  });

  async function Logout() {
    let usernameRead;

    usernameglobal.subscribe((value) => {
      usernameRead = value;
    });
    if (typeof fetch !== "undefined") {
      const url_put = `${link}/Get/UserHistory/UserHistory_Put.php?user_get=${usernameRead}&&status_get=Logout`;
      fetch(url_put);
    }

    // console.log(usernameRead);

    // console.log("3");
  }
  function loginHistory() {
  window.location.href = '/dashboard/Loginhistory';
}
function batchingUse() {
  window.location.href = '/dashboard/batchingusage';
}
function batchingReport() {
  window.location.href = '/dashboard';
}

function dosingUse() {
  window.location.href = '/dashboard/dosingMaterialUsage';
}
function dosingReport() {
  window.location.href = '/dashboard/liquidDosing';
}



</script>

<Header
  persistentHamburgerMenu={true}
  company="Inteqc Feed Co.,Ltd"
  platformName=""
  bind:isSideNavOpen
  style="background-color: #36a9e1; "
  class="custom-header"
>
  <!-- <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment> -->

  <HeaderUtilities  >
    <div class="flex items-center" >
      <span class="text-white text-xs" >{current}</span>
      
        <svg
          aria-hidden="true"
          class="w-6 h-6 ml-2 text-gray-200 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"
          />
        </svg>
      
    </div>
  </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen} style="background-color: #383e4b;">
  <SideNavItems>
    <ul class="space-y-2 font-medium">
      <li>
        <button
        type="button"
        on:click={batchingReport}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#2d323d] dark:hover:bg-gray-700"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path
              d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
            /></svg
          >
          <span class="ml-3 flex justify-start text-white">Batching Report</span>
      </button>
      </li>
      <li>
        <button
        type="button"
        on:click={batchingUse}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#2d323d] dark:hover:bg-gray-700"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path
              d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
            /></svg
          >
          <span class="ml-3 flex justify-start text-white">Batching Matertal Usage Report</span>
      </button>
      </li>
      <li>
        <button
        type="button"
        on:click={dosingReport}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#2d323d] dark:hover:bg-gray-700"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path
              d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
            /></svg
          >
          <span class="ml-3 flex justify-start text-white">Liquid Dosing Report</span>
      </button>
      </li>
      <li>
        <button
        type="button"
        on:click={dosingUse}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#2d323d] dark:hover:bg-gray-700"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path
              d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
            /></svg
          >
          <span class="ml-3 flex justify-start text-white">Dosing Material Usage Report</span>
      </button>
      </li>
      <li>
        <button
        type="button"
        on:click={loginHistory}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#2d323d] dark:hover:bg-gray-700"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path
              d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
            /></svg
          >
          <span class="flex justify-start ml-3 text-white">Login History</span>
        </button>
      </li>
      <li>
        <form action="/.?/logout" method="POST">
         <button  on:click={Logout} 
         class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#2d323d] dark:hover:bg-gray-700"
         >
         <svg
          aria-hidden="true"
          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
            clip-rule="evenodd"
          /></svg
        >
        <span class="flex-1 flex justify-start ml-3 whitespace-nowrap text-white">Log out</span>
        </button>
        </form>
      </li>
    </ul>
  </SideNavItems>
</SideNav>

<Content>
  <Grid>
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>
  </Grid>
</Content>