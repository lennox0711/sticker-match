"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth() {
const [showRegister, setShowRegister] =
useState(false);

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [
confirmPassword,
setConfirmPassword,
] = useState("");

const [loading, setLoading] =
useState(false);

const signIn = async () => {
setLoading(true);

const { error } =
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

if (error) {
  alert(error.message);
}

setLoading(false);

};

const signUp = async () => {
if (
password !== confirmPassword
) {
alert(
"Die Passwörter stimmen nicht überein."
);
return;
}

if (password.length < 6) {
  alert(
    "Das Passwort muss mindestens 6 Zeichen lang sein."
  );
  return;
}

setLoading(true);

const { error } =
  await supabase.auth.signUp({
    email,
    password,
  });
console.log("SignUp Error:", error);
if (error) {
  alert(error.message);
  setLoading(false);
  return;
}

const {
  data: loginData,
  error: loginError,
} =
  await supabase.auth.signInWithPassword(
    {
      email,
      password,
    }
  );
console.log("LoginData:", loginData);
console.log("LoginError:", loginError);

if (loginError) {
  console.error(loginError);
  alert("Login fehlgeschlagen");
  setLoading(false);
  return;
}

const user =
  loginData.user;

if (user) {
  const { error: profileError } =
    await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
      });
console.log(
  "Profile Error:",
  profileError
);

  if (profileError) {
    console.error(
      profileError
    );
  }
}
setLoading(false);
};
if (showRegister) {
return (
<div className="bg-white rounded-3xl p-6 shadow-sm">
<h2 className="text-xl font-bold text-zinc-800 text-center mb-6">
Registrieren
</h2>

    <div className="space-y-3">
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-400"
      />

      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-400"
      />

      <input
        type="password"
        placeholder="Passwort wiederholen"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value
          )
        }
        className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-400"
      />

      <button
        onClick={signUp}
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all"
      >
        {loading
          ? "..."
          : "Konto erstellen"}
      </button>

      <button
        onClick={() =>
          setShowRegister(false)
        }
        className="w-full px-4 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-medium hover:bg-zinc-200 transition-all"
      >
        Zurück
      </button>
    </div>
  </div>
);

}

return (
<div className="bg-white rounded-3xl p-6 shadow-sm">
<h2 className="text-xl font-bold text-zinc-800 text-center mb-6">

</h2>

  <div className="space-y-3">
    <input
      type="email"
      placeholder="E-Mail"
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
      className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-400"
    />

    <input
      type="password"
      placeholder="Passwort"
      value={password}
      onChange={(e) =>
        setPassword(
          e.target.value
        )
      }
      className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-400"
    />

    <button
      onClick={signIn}
      disabled={loading}
      className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all"
    >
      {loading
        ? "..."
        : "Login"}
    </button>

    <div className="pt-2 text-center">
      <p className="text-sm text-zinc-500 mb-2">
        Noch kein Konto?
      </p>

     <button
  onClick={() =>
    setShowRegister(true)
  }
>
  Registrieren
</button>
    </div>
  </div>
</div>

);
}