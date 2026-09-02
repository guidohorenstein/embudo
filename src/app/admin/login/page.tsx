"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type LoginState } from "../actions";

function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form className="login-box" action={action}>
      <h1>NOIR INK</h1>
      <p>Sign in to the admin panel</p>
      <input type="hidden" name="next" value={params.get("next") ?? "/admin"} />
      <label className="f">
        <span>Password</span>
        <input name="password" type="password" autoFocus autoComplete="current-password" />
      </label>
      {state.error ? <p className="failed">{state.error}</p> : null}
      <button className="btn-a" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-wrap">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
