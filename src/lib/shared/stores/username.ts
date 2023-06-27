import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const defaultValue = '';
const initialUser = browser ? window.localStorage.getItem('globalusername') ?? defaultValue : defaultValue;
 
const  globalusername = writable<string>(initialUser);
 
globalusername.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('globalusername', value);
  }
});
 
export default globalusername;