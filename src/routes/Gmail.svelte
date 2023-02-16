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
  import Icon from "@iconify/svelte";

  let redactar: boolean = false;
  let userd: boolean = false;
  let busqueda: string = "";
  let bus: boolean = false;
  let error: string = "";
  let er: boolean = false;
  let succes: string = "";
  let suc: boolean = false;
  let visualilzar: boolean = false;

  export let userData = {
    name: "" as string,
    email: "" as string,
    photo: "" as string,
  };

  const quitarElementos = () => {
    userd = !userd;
  };

  let mensaje = {
    enviador: userData.email as string,
    destinatario: "" as string,
    asunto: "" as string,
    texto: "" as string,
    photo: userData.photo as string,
  };

  const borrarTarea = async (id: any) => {
    try {
      await deleteDoc(doc(db, userData.email, id));
      succes = "Mensaje borrado correctamente";
      suc = true;
    } catch (error) {
      error = "Error en borrar mensaje";
      er = true;
      console.error(error);
    }
    setTimeout(() => {
      suc = false;
      er = false;
    }, 1000);
  };

  const enviarMensaje = async (e: Event) => {
    e.preventDefault();
    try {
      if (mensaje.destinatario !== userData.email) {
        await addDoc(collection(db, mensaje.destinatario), mensaje);
      }
      succes = "Mensaje enviado correctamente";
      suc = true;
    } catch (error) {
      error = "Error en envio de mensaje";
      er = true;
      console.error(error);
    }
    setTimeout(() => {
      suc = false;
      er = false;
    }, 1000);
    mensaje = {
      enviador: userData.email as string,
      destinatario: "" as string,
      asunto: "" as string,
      texto: "" as string,
      photo: userData.photo as string,
    };
    redactar = !redactar;
  };

  const verMensaje = (currentID: string) => {
    id = emails.filter((elemento: any) => {
      return elemento.id === currentID;
    });
    visualilzar = !visualilzar;
    console.log(id);
  };
  let id: any = {};
  let em: any = {};
  let emails: any = [];

  const unsub = onSnapshot(collection(db, userData.email), (QuerySnapshot) => {
    emails = QuerySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    console.log(emails);
  });
  onDestroy(unsub);
  console.log("PHOTO" + userData.photo);
</script>

<div class="gmail">
  {#if er === true}
    <div class="error">
      <p>{error}</p>
    </div>
  {/if}
  {#if suc === true}
    <div class="succes">
      <p>{succes}</p>
    </div>
  {/if}
  <div class="navbar">
    <div class="buscar">
      <div>
        <Icon icon="material-symbols:search" />
      </div>
      <input
        bind:value={busqueda}
        on:focus={() => (bus = !bus)}
        class="i"
        type="text"
        placeholder="Busca mensajes"
      />
      {#if busqueda !== ""}
        <div>
          <button on:click={() => (busqueda = "")}>
            <Icon icon="material-symbols:close" />
          </button>
        </div>
      {/if}
    </div>
    {#if userd === true}
      <div class="userData">
        <div>
          <img src={userData.photo} alt="" />
          <div>
            <p>{userData.name}</p>
            <p>{userData.email}</p>
          </div>
        </div>
        <button
          ><Icon icon="material-symbols:door-open-outline-rounded" />Cerrar
          Sesion</button
        >
      </div>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img on:click={quitarElementos} src={userData.photo} alt="" />
  </div>
  <div class="sidebar">
    <div class="logo">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/320px-Gmail_icon_%282020%29.svg.png"
        alt=""
      />
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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="entrada" on:click={() => (userd = false)}>
    {#if visualilzar === true}
      <div class="aud" on:click={() => (visualilzar = !visualilzar)}>
        <div class="vermensaje">
          <div class="bar">
            <button><Icon icon="ic:baseline-close" /></button>
          </div>
          <p>{id[0].asunto}</p>
          <img src={id[0].photo} alt="" />
          <p>{id[0].enviador}</p>
          <p>{id[0].texto}</p>
        </div>
      </div>
    {/if}
    <div class="entrada2">
      {#each emails as email}
        <div class="email">
          <button class="icon" on:click={borrarTarea(email.id)}>
            <Icon icon="ph:trash-fill" />
          </button>
          <p on:click={verMensaje(email.id)}>{email.enviador}</p>
          <p on:click={verMensaje(email.id)}>{email.asunto}</p>
          <p on:click={verMensaje(email.id)}>{email.texto}</p>
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
          autofocus
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
    width: 50px;
    height: 40px;
  }
  .vermensaje {
    display: flex;
    flex-direction: column;
    z-index: 5;
    color: black;
    background-color: white;
    margin-left: 295px;
    width: 90%;
    z-index: 5;
    margin-top: 79px;
    overflow: hidden;
  }
  .bar {
    width: 100%;
    background-color: var(--background2);
    height: 50px;
  }
  .vermensaje > img {
    width: 80px;
    margin-left: 40px;
    height: 80px;
    margin-top: 30px;
    border-radius: 999px;
  }
  .email > img {
    width: 30px;
    height: 30px;
    border-radius: 999px;
  }
  .aud {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
  }
  .icon {
    background-color: var(--background);
    font-size: 1rem;
    color: red;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
    border: none;
  }
  .error,
  .succes {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    position: absolute;
    visibility: hidden;
    width: 300px;
    z-index: 4;
    height: 50px;
    transition: ease in 0.4s;
    top: 90%;
    opacity: 0;
    left: 5%;
    border-radius: 5px;
    font-size: 1rem;
  }
  @keyframes notificacion {
    0% {
      top: 90%;
      visibility: visible;
      opacity: 0.25;
    }
    25% {
      opacity: 0.75;
    }
    50% {
      top: 90%;
      opacity: 1;
      visibility: visible;
    }
    100% {
      visibility: hidden;
      top: 90%;
    }
  }
  .error {
    background-color: red;
    animation-duration: 1.5s;
    animation-iteration-count: 1;
  }
  .succes {
    animation-name: notificacion;
    animation-duration: 1s;
    animation-iteration-count: 1.5;
    background-color: white;
    color: var(--azul);
  }
  .userData {
    z-index: 4;
    height: 200px;
    width: 380px;
    background-color: var(--background2);
    position: absolute;
    top: 70px;
    right: 40px;
    border-radius: 19px;
    overflow: hidden;
  }
  .userData > div > img {
    margin-top: 10px;
    margin-left: 10px;
    width: 80px;
    height: 80px;
    border-radius: 999px;
  }
  .userData > div {
    margin-left: 10px;
    display: flex;
    gap: 40px;
  }
  .userData > button {
    margin-top: 30px;
    border: none;
    display: flex;
    align-items: center;
    border-radius: 5px;
    font-size: 1rem;
    background-color: red;
    color: white;
    gap: 10px;
    height: 30px;
    margin-left: 140px;
  }
  .userData > div > div {
    margin-top: 10px;
  }
  .userData > div > div > :nth-child(1) {
    text-transform: capitalize;
    font-size: 1.1rem;
  }
  .userData > div > div > :nth-child(2) {
    color: rgb(164, 164, 164);
  }
  .buscar {
    position: absolute;
    left: 310px;
    border-radius: 5px;
    width: 50%;
    display: flex;
    background-color: var(--background2);
    align-items: center;
  }
  .buscar > :nth-child(1) {
    position: absolute;
    top: 18px;
    left: 10px;
    z-index: 5;
    color: red;
  }
  .buscar > :nth-child(3) {
    top: 16px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 90%;
    background-color: transparent;
  }
  .buscar > :nth-child(3) > button {
    color: red;
    font-size: 1.2rem;
    border: none;
    background-color: transparent;
  }
  .buscar > input {
    height: 50px;
    text-indent: 35px;
    font-size: 1rem;
    width: 100%;
    border-radius: 5px;
    background-color: var(--background2);
    outline: none;
    border: none;
    color: white;
  }
  .buscar > input:focus {
    color: black;
    background-color: white;
  }
  .icon:hover {
    transition: 0.3s;
    transform: scale(1.2);
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
    cursor: pointer;
    font-size: 0.9rem;
    height: 50px;
    border-bottom: 1px solid rgb(128, 128, 128);
    display: flex;
    align-items: center;
    text-align: center;
    background-color: var(--background);
  }
  .email > :nth-child(1) {
    margin-left: 5px;
  }
  .email > :nth-child(2) {
    font-size: 1rem;
    font-weight: bolder;
    margin-left: 20px;
  }
  .email > :nth-child(3) {
    margin-left: 40px;
    font-weight: bold;
  }
  .email > :nth-child(4) {
    color: rgb(206, 206, 206);
    margin-left: 50px;
  }
  .email > :nth-child(5) {
    margin-left: 30px;
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
  .navbar > img {
    cursor: pointer;
    margin-right: 30px;
    height: 40px;
    width: 40px;
    border-radius: 999px;
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
