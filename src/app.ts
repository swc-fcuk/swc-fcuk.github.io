import greeting from "./some_module";
import Greeter from "./greeter";

console.log(greeting);

var greeter = new Greeter("Hello, world!!!");
const greet = document.body.innerHTML = greeter.greet();

