<script lang="ts">
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../firebase";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import {
    addDoc,
    collection,
    onSnapshot,
    QuerySnapshot,
  } from "firebase/firestore";
  import Gmail from "./Gmail.svelte";

  export let userData = {
    name: "" as string,
    email: "" as string,
  };

  let mostrar: boolean = false;

  const autenticar = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        userData.email = user.email as string;
        userData.name = user.displayName as string;
        //console.log(user);
        mostrar = true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMesage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
</script>

<main>
  <div class="tapar" />
  {#if mostrar === false}
    <div class="login">
      <div class="card">
        <button on:click={autenticar}>Login</button>
      </div>
    </div>
  {/if}
  {#if mostrar === true}
    <Gmail {userData} />
  {/if}
</main>

<style>
</style>
