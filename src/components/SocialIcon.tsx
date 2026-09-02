/**
 * Iconos de redes con la marca real. La red se detecta por la URL y no por la
 * etiqueta, porque la etiqueta la escribe el estudio desde el panel y puede
 * venir como sea. Si no se reconoce, se muestra el texto tal cual.
 */

type Red = "instagram" | "facebook" | "tiktok" | "youtube" | "x" | null;

function detectar(url: string): Red {
  const u = url.toLowerCase();
  if (u.includes("instagram.")) return "instagram";
  if (u.includes("facebook.") || u.includes("fb.com")) return "facebook";
  if (u.includes("tiktok.")) return "tiktok";
  if (u.includes("youtube.") || u.includes("youtu.be")) return "youtube";
  if (u.includes("twitter.") || u.includes("x.com")) return "x";
  return null;
}

export default function SocialIcon({ url, label }: { url: string; label: string }) {
  const red = detectar(url);
  if (!red) return <span className="social-text">{label}</span>;

  const comun = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;

  if (red === "instagram") {
    return (
      <svg {...comun}>
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <path
          fill="url(#ig-grad)"
          d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 6.3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 5.8a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Zm4.5-5.9a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Z"
        />
      </svg>
    );
  }

  if (red === "facebook") {
    return (
      <svg {...comun}>
        <path
          fill="#1877F2"
          d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.23 2.6.23v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z"
        />
      </svg>
    );
  }

  if (red === "tiktok") {
    return (
      <svg {...comun}>
        <path
          fill="#25F4EE"
          d="M9.6 9.3v-1a4.6 4.6 0 0 0-3.9 8.3 4.6 4.6 0 0 1 3.9-7.3Z"
        />
        <path
          fill="#FE2C55"
          d="M16.9 2h-1.6a5.3 5.3 0 0 0 3.3 4.5V8A6.7 6.7 0 0 1 16.9 6.6V13a4.6 4.6 0 0 1-8.3 2.7 4.6 4.6 0 0 0 8.3-2.7V6.9A6.7 6.7 0 0 0 20.7 8V6.4A5.3 5.3 0 0 1 16.9 2Z"
        />
        <path
          fill="#fff"
          d="M15.3 2h-3v11a2 2 0 1 1-2-2c.2 0 .4 0 .6.1V9.5A4.6 4.6 0 1 0 15.3 13V6.9a6.7 6.7 0 0 0 3.8 1.2V6.4A5.3 5.3 0 0 1 15.3 2Z"
        />
      </svg>
    );
  }

  if (red === "youtube") {
    return (
      <svg {...comun}>
        <path
          fill="#FF0000"
          d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5Z"
        />
        <path fill="#fff" d="M9.6 15.6 15.8 12 9.6 8.4v7.2Z" />
      </svg>
    );
  }

  return (
    <svg {...comun}>
      <path
        fill="#fff"
        d="M18.2 2h3.3l-7.2 8.3L22.7 22h-6.6l-5.2-6.8L4.9 22H1.6l7.7-8.8L1.3 2H8l4.7 6.2L18.2 2Zm-1.2 18h1.8L7.1 3.9H5.2L17 20Z"
      />
    </svg>
  );
}
