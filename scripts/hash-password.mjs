import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Uso: npm run hash -- "tu-password"');
  process.exit(1);
}

// Se imprime en base64 para que el valor no contenga "$": los archivos .env
// interpretan ese caracter como expansion de variables y rompen el hash.
const hash = bcrypt.hashSync(password, 10);
console.log(Buffer.from(hash, "utf8").toString("base64"));
