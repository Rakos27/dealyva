const token = process.env.AWIN_ACCESS_TOKEN?.trim();
const configuredPublisherId = process.env.AWIN_PUBLISHER_ID?.trim();

if (!token) {
  console.error(
    [
      "AWIN_ACCESS_TOKEN est absent.",
      "Copiez .env.example vers .env.local, puis collez-y le jeton Awin.",
      "Le fichier .env.local est ignoré par Git et ne doit jamais être partagé.",
    ].join("\n"),
  );
  process.exit(1);
}

const response = await fetch(
  "https://api.awin.com/accounts?type=publisher",
  {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(15_000),
  },
);

if (!response.ok) {
  const message =
    response.status === 401
      ? "Jeton refusé par Awin. Vérifiez qu’il est complet et encore actif."
      : `Awin a répondu avec le statut ${response.status}.`;
  console.error(message);
  process.exit(1);
}

const payload = await response.json();
const accounts = Array.isArray(payload)
  ? payload
  : Array.isArray(payload?.accounts)
    ? payload.accounts
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

const publishers = accounts.filter(
  (account) =>
    String(account?.accountType ?? account?.type ?? "").toLowerCase() ===
      "publisher" ||
    account?.accountType === undefined,
);

if (publishers.length === 0) {
  console.error(
    "Le jeton est valide, mais aucun compte Publisher n’est encore accessible.",
  );
  process.exit(1);
}

console.log("Connexion Awin réussie.\n");

for (const publisher of publishers) {
  const id = String(
    publisher.accountId ?? publisher.publisherId ?? publisher.id ?? "",
  );
  const name =
    publisher.accountName ?? publisher.publisherName ?? publisher.name ?? "—";
  const role = publisher.userRole ?? publisher.role ?? "—";
  const selected = configuredPublisherId === id ? " (configuré)" : "";

  console.log(`Publisher ID : ${id}${selected}`);
  console.log(`Compte       : ${name}`);
  console.log(`Rôle         : ${role}\n`);
}

if (!configuredPublisherId) {
  console.log(
    "Ajoutez maintenant le Publisher ID voulu dans AWIN_PUBLISHER_ID de .env.local.",
  );
} else if (
  !publishers.some(
    (publisher) =>
      String(
        publisher.accountId ?? publisher.publisherId ?? publisher.id ?? "",
      ) === configuredPublisherId,
  )
) {
  console.error(
    "AWIN_PUBLISHER_ID ne correspond à aucun compte accessible avec ce jeton.",
  );
  process.exit(1);
}
