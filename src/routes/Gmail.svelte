<script lang="ts">
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../firebase";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import { onDestroy } from "svelte";
  import {
    addDoc,
    collection,
    deleteDoc,
    onSnapshot,
    QuerySnapshot,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import { destroy_block } from "svelte/internal";

  let redactar: boolean = false;

  export let userData = {
    name: "" as string,
    email: "" as string,
  };

  let mensaje = {
    enviador: userData.email as string,
    destinatario: "" as string,
    asunto: "" as string,
    texto: "" as string,
  };

  const enviarMensaje = async (e: Event) => {
    e.preventDefault();
    try {
      if (mensaje.destinatario !== userData.email) {
        await addDoc(collection(db, mensaje.destinatario), mensaje);
      }
    } catch (error) {
      console.error(error);
    }
    mensaje = {
      enviador: userData.email as string,
      destinatario: "" as string,
      asunto: "" as string,
      texto: "" as string,
    };
    redactar = !redactar;
  };

  let emails: any = [];

  const unsub = onSnapshot(collection(db, userData.email), (QuerySnapshot) => {
    emails = QuerySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    console.log(emails);
  });
  onDestroy(unsub);
</script>

<div class="gmail">
  <div class="navbar" />
  <div class="sidebar">
    <div class="logo">
      <img src="src/img/gmail.svg" alt="" />
      <h1>Gmail</h1>
    </div>
    <div class="datos-sidebar">
      <button on:click={() => (redactar = !redactar)}>Redactar</button>
      <div class="ds">
        <p>Recibidos</p>
        <p>Enviados</p>
      </div>
    </div>
  </div>
  <div class="entrada">
    <div class="entrada2">
      {#each emails as email}
        <div class="email">
          <button>Borrar</button>
          <p>{email.enviador}</p>
          <p>{email.asunto}</p>
          <p>{email.texto}</p>
        </div>
      {/each}
    </div>
  </div>
  {#if redactar === true}
    <div class="redactar">
      <div class="msg">
        <p>Mensaje nuevo</p>
        <div class="buttons">
          <button on:click={() => (redactar = !redactar)}>X</button>
          <button>Ñ</button>
        </div>
      </div>
      <form action="" on:submit={enviarMensaje}>
        <input
          bind:value={mensaje.destinatario}
          type="text"
          placeholder="Destinatario"
        />
        <input
          bind:value={mensaje.asunto}
          placeholder="Asunto"
          type="text"
          name=""
          id=""
        />
        <textarea
          bind:value={mensaje.texto}
          placeholder="Escribe tu mensaje"
          name=""
          id=""
          cols="30"
          rows="10"
        />
        <div class="submit">
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
  div,
  textarea {
    font-family: Roboto;
  }
  button {
    font-family: Roboto;
    cursor: pointer;
  }
  :root {
    --background: rgb(36, 36, 36);
    --background2: rgb(54, 54, 54);
    --azul: rgb(0, 98, 255);
  }
  .logo {
    margin-left: -30px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo > img {
    width: 40px;
    height: 40px;
  }
  .sidebar {
    position: absolute;
    width: 300px;
    background-color: var(--background);
    height: 100%;
    top: 0;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    left: 0;
  }
  .entrada {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;
    background-color: var(--background2);
    border-radius: 20px;
    overflow-x: hidden;
    display: grid;
  }
  .entrada2 {
    background-color: var(--background);
    overflow-y: scroll;
    margin-left: 300px;
    margin-top: 80px;
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(60px, 60px));
  }
  .entrada2 > :nth-child(1) {
    border-top: 1px solid rgb(121, 121, 121);
  }
  .email {
    overflow: hidden;
    font-size: 0.9rem;
    height: 50px;
    border-bottom: 1px solid rgb(128, 128, 128);
    display: flex;
    align-items: center;
    text-align: center;
    background-color: var(--background);
  }
  .email > :nth-child(2) {
    font-size: 1rem;
    font-weight: bolder;
  }
  .email > :nth-child(3) {
    margin-left: 40px;
    font-weight: bold;
  }
  .email > :nth-child(4) {
    color: rgb(206, 206, 206);
    margin-left: 10px;
  }
  .submit {
    width: 100%;
  }
  .submit > button {
    color: white;
    background-color: var(--azul);
    outline: none;
    border: none;
    border-radius: 5px;
    width: 70px;
    height: 30px;
    margin-left: 30px;
  }
  .msg {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    text-align: center;
    background-color: rgb(233, 233, 233);
  }
  .msg > .buttons {
    width: 70%;
    display: flex;
    justify-content: right;
    gap: 10px;
  }
  .buttons > button {
    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
  }
  .msg > p {
    margin-left: 30px;
  }
  .redactar {
    overflow: hidden;
    border-radius: 10px;
    position: absolute;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 70%;
    background-color: white;
    top: 30%;
    box-shadow: 0 7px 14px rgb(0 0 0 / 0.2);
    right: 70px;
  }
  form {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: column;
  }
  form > input {
    font-family: Roboto;
    font-size: 0.9rem;
    width: 95%;
    border-left: none;
    border-right: none;
    outline: none;
    height: 35px;
    border-bottom: 1px solid rgb(231, 229, 229);
    border-top: none;
  }
  form > textarea {
    margin-top: 5px;
    font-family: Roboto;
    outline: none;
    font-size: 0.9rem;
    width: 95%;
    height: 70%;
    border: none;
  }
  .sidebar > h1 {
    margin-top: 9px;
  }
  .datos-sidebar {
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    text-align: center;
    border-radius: 5px;
    background-color: var(--background2);
  }
  .datos-sidebar > button {
    margin-top: 20px;
    background-color: var(--azul);
    outline: none;
    border: none;
    border-radius: 5px;
    height: 50px;
    width: 70%;
    color: white;
    font-size: 1rem;
  }
  .navbar {
    align-items: center;
    justify-content: right;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 80px;
    color: white;
    background-color: var(--background);
  }
  .button-redactar > button {
    background-color: var(--azul);
    outline: none;
    border: none;
    border-radius: 4px;
    height: 30px;
    color: white;
    width: 70px;
    margin-right: 30px;
  }
</style>
