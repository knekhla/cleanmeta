# CleanMeta — Product Requirements Document (PRD)
## SaaS de suppression de métadonnées d’images (Privacy-first & API-first)

---

## 1. Vision & Positionnement
CleanMeta est une plateforme SaaS **privacy-first** permettant de supprimer les métadonnées sensibles (EXIF, PNG, IA) des images, localement dans le navigateur pour le grand public, et côté serveur pour les usages professionnels et automatisés.

Principe fondamental :
> **Client-side par défaut, serveur uniquement quand nécessaire.**

---

## 2. Architecture globale

### Séparation Client / Serveur
- Gratuit : 100 % navigateur
- Premium : API, batch, automatisation → serveur

---

## 3. Backend & Infrastructure

- Backend : Node.js + Fastify + TypeScript
- Image processing : exiftool-vendored, sharp
- Queue : BullMQ + Redis
- Storage : S3-compatible + CDN
- Auth & DB : Supabase (PostgreSQL)
- Paiement : Stripe
- Monitoring : Sentry, Prometheus/Datadog

---

## 4. Politique de rétention des données

- Images nettoyées : TTL par défaut 24h
- ZIP batch : TTL max 48h
- Suppression automatique via cron
- Aucun stockage permanent d’images

---

## 5. Sécurité

- HTTPS only
- Rate limiting Redis
- API keys avec scopes
- Workers isolés via Docker
- Chiffrement at-rest et in-transit

---

## 6. Fallback navigateur

- Détection mémoire insuffisante ou timeout
- Proposition de bascule serveur (utilisateur premium)

---

## 7. Conformité légale & RGPD (SECTION CRITIQUE)

### 7.1 Rôle RGPD
CleanMeta agit comme :
- **Responsable de traitement** pour les comptes utilisateurs
- **Sous-traitant** pour les images traitées via API

### 7.2 Données collectées
- Email, identifiant utilisateur
- Données de facturation (Stripe)
- Logs techniques anonymisés

### 7.3 Données NON collectées
- Contenu des images (hors traitement temporaire)
- Métadonnées utilisateur persistantes
- Tracking publicitaire

### 7.4 Droits utilisateurs
- Droit d’accès
- Droit de suppression
- Droit de portabilité
- Contact DPO : dpo@cleanmeta.io

### 7.5 Localisation
- Hébergement UE (ou AWS eu-west)
- Sous-traitants RGPD compliant

---

## 8. Prompt parfait pour Antigravity / Cursor

### Prompt maître développeur

"""
Tu es un agent IA développeur senior (fullstack + infra + sécurité).
Ta mission est d’implémenter strictement ce PRD CleanMeta.

Contraintes ABSOLUES :
- Respect total du principe privacy-first
- Aucune image stockée de manière permanente
- Séparation claire client-side / server-side
- Toute image serveur doit être décodée puis réencodée (sharp)
- Batch obligatoirement asynchrone via queue
- API sécurisée (auth, rate limit, scopes)

Livrables attendus :
1. Architecture backend complète (Fastify + Docker)
2. Workers BullMQ pour batch
3. API REST conforme au PRD
4. Stockage temporaire S3 + CDN
5. Tests basiques et documentation

Ne propose rien hors périmètre.
Si un point est ambigu, applique la solution la plus sécurisée et la plus privacy-first.
"""

---

## 9. Résumé exécutif
CleanMeta est conçu pour être :
- Ultra simple pour le public
- Ultra robuste pour les professionnels
- Conforme RGPD by design
- Scalable sans compromettre la confidentialité
