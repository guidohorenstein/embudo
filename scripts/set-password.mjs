import { existsSync, readFileSync, writeFileSync } from "node:fs";
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Uso: npm run set-password -- "tu-nueva-contrasena"');
  process.exit(1);
}

if (password.length < 8) {
  console.error("La contrasena debe tener al menos 8 caracteres.");
  process.exit(1);
}

// Se guarda en base64 para que el valor no contenga "$": los archivos .env
// interpretan ese caracter como expansion de variables y rompen el hash.
const hash = bcrypt.hashSync(password, 10);
const value = Buffer.from(hash, "utf8").toString("base64");

const file = ".env.local";
const line = `ADMIN_PASSWORD_HASH=${value}`;

let content = existsSync(file) ? readFileSync(file, "utf8") : "";

if (/^ADMIN_PASSWORD_HASH=.*$/m.test(content)) {
  content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, line);
} else {
  if (content && !content.endsWith("\n")) content += "\n";
  content += `${line}\n`;
}

writeFileSync(file, content);

console.log("Contrasena actualizada en .env.local\n");
console.log("Para produccion, copiar este valor en la variable ADMIN_PASSWORD_HASH de Vercel:\n");
console.log(value);
console.log("\nSi el servidor de desarrollo esta corriendo, reinicialo para que tome el cambio.");
