<script lang="ts">
    import "../app.postcss";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { Alert } from "flowbite-svelte";
    import usernameglobal from '$lib/shared/stores/username';
    import { URL } from '$lib/shared/stores/url';
    import { enhance } from '$app/forms';
    let link: any;
    type Todo = {
        id: number;
        Operator_ID: string;
        role_name: string;
        pass_word: string;
        image: string;
        full_name: string;
    };
    let users: Todo[] = []; // Define an empty array to store the fetched users
    let showError = false;

    onMount(async function login() {
        URL.subscribe(value => {
            link = value;
        });
        if (typeof fetch !== "undefined") {
            const url = `${link}/Get/UserHistory/UsersRegis.php`;
            fetch(url) // Send a GET request to the specified URL
                .then((response) => response.json())
                .then((json) => (users = json.slice(0)));
            setTimeout(() => {
                console.log(users);
            }, 500);
        }
        // console.log(link);
    });
 

    function validateLogin() {
        const username = document.getElementById("SelectUser").value;
        const password = document.getElementById("password").value;
        usernameglobal.set(username);
        let usernameRead;
        usernameglobal.subscribe(value=>{
            usernameRead=value;
        });
        
        // console.log(usernameRead);

        // Find the user with the matching username and password
        const user = users.find(
            (user) =>
                user.Operator_ID === username && user.pass_word === password
        );

        if (user) {
            if (typeof fetch !== "undefined") {
            const url_put = `${link}/Get/UserHistory/UserHistory_Put.php?user_get=${username}&&status_get=Login`
            fetch(url_put)
            }
        } else {
            // Invalid username or password, display an error message or perform any other action
            showError = true;
            console.log("Invalid username or password");
        }
    }
    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            validateLogin();
        }
    }
</script>

<section
    class="dark:bg-gray-900"
    style="background-image: url('https://www.inteqcgroup.com/assets/images/Feeds.png'); background-size: cover; background-position: center;"
>
    <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
        <p
            class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
            Inteqc Feed Co.,Ltd
        </p>
        <div
            class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                >
                    Log in
                </h1>
                <form class="space-y-4 md:space-y-6" action="?/login" method="POST" use:enhance>
                    <div>
                        <p
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Username
                        </p>
                        <select
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            id="SelectUser" bind:value={$usernameglobal} name="login"
                        >
                          
                            {#each users as user (user.id)}
                                <option>{user.Operator_ID}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label
                            for="password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Password</label
                        >
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder=""
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    <button
                        on:keydown={handleKeyPress}
                        on:click={validateLogin}
                        type="submit"
                        class="w-full border-2 text-black border-gray-150 bg-gray-100 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >Log in</button
                    >
                    <!-- {#if form?.error}<p>{form.error}</p>{/if} -->
                </form>
                <!-- <div class="button-container">
                    <form action="?/login" method="POST" use:enhance>
                        <label>Login <input type="text" name="login" /></label>
                        <label>Password <input type="password" name="password" /></label>
                        {#if form?.error}<p>{form.error}</p>{/if}
                        <button type="submit">Login</button>
                    </form>
                </div> -->
                {#if showError}
                    <Alert color="red" type="error">
                        <svg
                            slot="icon"
                            aria-hidden="true"
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            ><path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd"
                            /></svg
                        >
                        <span class="font-medium"
                            >Invalid username or password!</span
                        > Please try again.
                    </Alert>
                {/if}
            </div>
        </div>
    </div>
</section>
