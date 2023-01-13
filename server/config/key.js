import prod from "./prod.js";
import dev from "./dev.js";
let key = null;

if (process.env.NODE_ENV === "production") {
  key = prod;
} else {
  key = dev;
}

export default key;
