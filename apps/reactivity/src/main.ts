import './style.css';
import { effect, reactive } from '@vue-mini/vue';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

const entryInnerHTML = `
  <div class="mx-auto">
    <a class="mr-2" href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1 class="my-2">Vite + TypeScript</h1>
  </div>
  <section id="reactivity-test" class="my-2">
  </section>
`;

document.querySelector('#app')!.innerHTML = entryInnerHTML;

// function reactive1() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="effect-1" class="my-1"></p>`;

//   const state = reactive({
//     name: 'i7eo',
//   });

//   effect(() => {
//     document.querySelector('#effect-1')!.innerHTML = state.name;
//   });

//   setTimeout(() => {
//     state.name = 'George';
//   }, 2000);
// }
// reactive1();

function reactive2() {
  document.querySelector('#reactivity-test')!.innerHTML =
    `<p id="effect-1" class="my-1"></p><p id="effect-2" class="my-1"></p>`;

  const state = reactive({
    name: 'i7eo',
  });

  effect(() => {
    document.querySelector('#effect-1')!.innerHTML = state.name;
  });

  effect(() => {
    document.querySelector('#effect-2')!.innerHTML = state.name;
  });

  setTimeout(() => {
    state.name = 'George';
  }, 2000);
}
reactive2();
