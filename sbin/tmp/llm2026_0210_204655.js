#!run
import { pipeline,env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

export async function main(){
//import { pipeline } from '@huggingface/transformers';

//const generator = await pipeline('text-generation', 'Xenova/llama-160m');
//const output = await generator('Once upon a time, there was', { max_new_tokens: 10 });

const frag=`
// Complete the function body in JavaScript.
// Write only the minimal implementation.

function reptstr(s, times) {
`;

env.allowRemoteModels = true;

const generator = await pipeline(
  "text-generation",
  //"Xenova/phi-1_5_dev",
  "Xenova/codegen-350M-mono",
  //"Xenova/llama2.c-stories110M",
  //"Xenova/llama-160m",
  //"Xenova/tiny-random-Starcoder2ForCausalLM",
  //"Xenova/tiny-starcoder",
  {
    device: "wasm",
  }
);
  let prompt = /*"once upon a time, there were"*/
    frag;

//out.textContent = "準備OK";
for(let i=0;i<2;i++){


  const res = await generator(prompt, {
    max_new_tokens: 32,
    temperature: 0.2,
    do_sample: false,
  });

  const completion = res[0].generated_text.slice(prompt.length);
this.echo(completion);
prompt+=completion;
await this.sleep(0.1);
}
//  return completion;
}