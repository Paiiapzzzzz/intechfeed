// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// declare global {
// 	namespace App {
// 		// interface Error {}
// 		// interface Locals {}
// 		// interface PageData {}
// 		// interface Platform {}
// 	}
// }

// export {};
type User = {
	id: number
	email: string
	role: string
}

declare namespace App {
	// interface Error {}
	interface Locals {
		user: User | null
	}
	// interface PageData {}
	// interface Platform {}
}