import './style.css';
import { effect, queuePreFlushCb, reactive } from '@vue-mini/vue';
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

// function reactive2() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="effect-1" class="my-1"></p><p id="effect-2" class="my-1"></p>`;

//   const state = reactive({
//     name: 'i7eo',
//   });

//   effect(() => {
//     document.querySelector('#effect-1')!.innerHTML = state.name;
//   });

//   effect(() => {
//     document.querySelector('#effect-2')!.innerHTML = state.name;
//   });

//   setTimeout(() => {
//     state.name = 'George';
//   }, 2000);
// }
// reactive2();

// function ref1() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="ref-1" class="my-1"></p>`;

//   const state = ref({
//     name: 'i7eo',
//   });

//   effect(() => {
//     document.querySelector('#ref-1')!.innerHTML = state.value.name;
//   });

//   setTimeout(() => {
//     state.value.name = 'George';
//   }, 2000);
// }
// ref1();

// function ref2() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="ref-2" class="my-1"></p>`;

//   const state = ref('i7eo');

//   effect(() => {
//     document.querySelector('#ref-2')!.innerHTML = state.value;
//   });

//   setTimeout(() => {
//     state.value = 'George';
//   }, 2000);
// }
// ref2();

// function computed1() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="computed-1" class="my-1"></p>`;

//   const state = reactive({
//     name: '张三',
//   });

//   const name = computed(() => {
//     // console.log("🚀 ~ name ~ computed")
//     return `Name: ${state.name}`
//   });

//   effect(() => {
//     document.querySelector('#computed-1')!.innerHTML = name.value;
//     // document.querySelector('#computed-1')!.innerHTML = name.value;
//   });

//   setTimeout(() => {
//     state.name = '李四';
//   }, 2000);
// }
// computed1();

// function computed2() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="computed-2" class="my-1"></p>`;

//   const state = reactive({
//     name: '张三',
//   });

//   const name = computed(() => {
//     console.log('🚀 ~ name ~ computed');
//     return `Name: ${state.name}`;
//   });

//   effect(() => {
//     document.querySelector('#computed-2')!.innerHTML = name.value;
//     // document.querySelector('#computed-2')!.innerHTML = name.value;
//   });

//   setTimeout(() => {
//     state.name = '李四';
//   }, 2000);
// }
// computed2();

// function lazy1() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="lazy-1" class="my-1"></p>`;

//   const state = reactive({
//     count: 1,
//   });

//   effect(
//     () => {
//       console.log('🚀 ~ lazy1 effect ~ state.count:', state.count);
//     },
//     {
//       lazy: true,
//     },
//   );

//   state.count = 2;

//   console.log('🚀 ~ lazy1 ~ end');
// }
// lazy1();

// function scheduler1() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="scheduler-1" class="my-1"></p>`;

//   const state = reactive({
//     count: 1,
//   });

//   effect(
//     () => {
//       console.log('🚀 ~ scheduler1 effect ~ state.count:', state.count);
//     },
//     {
//       scheduler: () => {
//         // 调度器可以改变执行顺序
//         setTimeout(() => {
//           console.log(
//             '🚀 ~ scheduler1 effect scheduler setTimeout ~ state.count:',
//             state.count,
//           );
//         });
//       },
//     },
//   );

//   state.count = 2;

//   console.log('🚀 ~ scheduler1 ~ end');
// }
// scheduler1();

// function scheduler2() {
//   document.querySelector('#reactivity-test')!.innerHTML =
//     `<p id="scheduler-2" class="my-1"></p>`;

//   const state = reactive({
//     count: 1,
//   });

//   effect(
//     () => {
//       console.log('🚀 ~ scheduler2 effect ~ state.count:', state.count);
//     },
//     {
//       scheduler: () => {
//         // 调度器可以控制执行规则
//         // 匿名函数在运行时创建导致引用不一致输出俩次 log，优化见 scheduler3
//         queuePreFlushCb(() =>
//           console.log(
//             '🚀 ~ scheduler2 effect scheduler queuePreFlushCb ~ state.count:',
//             state.count,
//           ),
//         );
//       },
//     },
//   );

//   state.count = 2;
//   state.count = 3;

//   console.log('🚀 ~ scheduler2 ~ end');
// }
// scheduler2();

function scheduler3() {
  document.querySelector('#reactivity-test')!.innerHTML =
    `<p id="scheduler-3" class="my-1"></p>`;

  const state = reactive({
    count: 1,
  });

  function log() {
    console.log(
      '🚀 ~ scheduler3 effect scheduler queuePreFlushCb ~ state.count:',
      state.count,
    );
  }

  effect(
    () => {
      console.log('🚀 ~ scheduler3 effect ~ state.count:', state.count);
    },
    {
      scheduler: () => {
        // 调度器可以控制执行规则
        queuePreFlushCb(log);
      },
    },
  );

  state.count = 2;
  state.count = 3;

  console.log('🚀 ~ scheduler3 ~ end');
}
scheduler3();
