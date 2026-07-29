# Modération des offres Awin

Dealyva n’envoie plus directement les promotions Awin vers le site public.
Chaque offre suit désormais ce circuit :

1. Awin transmet les promotions des annonceurs rejoints.
2. `npm run awin:sync` les place dans une file locale ignorée par Git.
3. L’interface `npm run awin:review` permet de les approuver ou de les refuser.
4. Seules les offres approuvées sont copiées dans
   `public/data/promotions.json`.
5. Le site public ne change qu’après commit et déploiement.

## Utilisation

Lancer le centre de contrôle :

```bash
npm run awin:review
```

Puis ouvrir `http://localhost:4174`.

L’interface permet :

- d’importer les dernières promotions Awin ;
- de rechercher et filtrer les offres ;
- d’approuver, refuser ou remettre une offre en attente ;
- de préparer le flux public.

Le jeton Awin reste côté serveur local. Il n’est ni intégré au JavaScript du
navigateur, ni écrit dans les fichiers de promotions.

## Fichiers

- `data/awin-candidates.json` : file locale générée, ignorée par Git ;
- `data/awin-moderation.json` : décisions conservées dans Git ;
- `public/data/promotions.json` : offres approuvées consommées par le site.

Une décision reste associée à l’identifiant Awin de l’offre. Une offre
approuvée disparaît automatiquement du flux public lorsqu’elle expire ou
n’est plus transmise par Awin. Toute nouvelle offre reste en attente, même si
elle appartient à une marque déjà approuvée.

## GitHub Actions

Le déploiement programmé synchronise Awin mais applique toujours
`data/awin-moderation.json`. Il ne peut donc pas publier automatiquement une
offre qui n’a jamais été approuvée.
