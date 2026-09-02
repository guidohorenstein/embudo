import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

declare global {
  // eslint-disable-next-line no-var
  var __sql: Sql | undefined;
}

/**
 * La conexion se crea en el primer uso, no al importar el modulo:
 * asi `next build` puede recolectar las rutas sin DATABASE_URL.
 */
function client(): Sql {
  if (globalThis.__sql) return globalThis.__sql;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta la variable de entorno DATABASE_URL");

  // Los poolers en modo "transaction" (Supabase/Supavisor en el 6543, PgBouncer)
  // no soportan prepared statements: hay que desactivarlos o falla toda consulta.
  const pooled = url.includes("pooler.") || url.includes(":6543") || url.includes("pgbouncer=true");

  const instance = postgres(url, {
    // Ojo: no bajar a 1. La pagina lanza dos consultas en paralelo
    // (generateMetadata y el render) y con una sola conexion se traban entre si.
    // El pooling del lado del servidor ya lo hace Supavisor/PgBouncer.
    max: Number(process.env.DB_POOL_MAX) || 5,
    idle_timeout: 20,
    prepare: !pooled,
    // Sin este timeout, una base inalcanzable cuelga el request para siempre
    // en vez de fallar y dejar que la pagina caiga en el contenido por defecto.
    connect_timeout: 10,
  });
  globalThis.__sql = instance;
  return instance;
}

export const sql = new Proxy(function () {} as unknown as Sql, {
  apply: (_target, _thisArg, args: unknown[]) =>
    (client() as unknown as (...a: unknown[]) => unknown)(...args),
  get: (_target, prop: string | symbol) => (client() as unknown as Record<string | symbol, unknown>)[prop],
}) as Sql;
