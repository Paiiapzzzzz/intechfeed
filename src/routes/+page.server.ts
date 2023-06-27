import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

type Todo = {
    id: number;
    Operator_ID: string;
    role_name: string;
    pass_word: string;
    image: string;
    full_name: string;
};
let users: Todo[] = [];

export const load: PageServerLoad = async ({ locals }) => {
	// console.log(locals);
    // if(locals.user == null){
    //     redirect(303, "/")
    // }   
	return {
		user: locals.user,
	}
}


export const actions: Actions = {
    login: async ({ request, cookies }) => {
        if (typeof fetch !== "undefined") {
            const url = "http://10.10.20.115/Get/UserHistory/UsersRegis.php";
            fetch(url) // Send a GET request to the specified URL
                .then((response) => response.json())
                .then((json) => (users = json.slice(0)));
                // setTimeout(() => {
                //     console.log(users);
                // }, 500);
        }
        const formData = await request.formData();
        const username = formData.get('login');
        const password = formData.get('password');

        const user = users.find(
            (user) =>
                user.Operator_ID === username && user.pass_word === password
        );
        // console.log("running");
        if (user) {
            cookies.set(
                "auth", "regularusertoken",
                {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60*30, // second
                },
            );
            throw redirect(302, '/dashboard');
        }
        return fail(400, { error: 'Invalid login or password' });
    },
    logout: async ({ cookies }) => {
        cookies.delete("auth")
        throw redirect(303, "/")
        }
}
