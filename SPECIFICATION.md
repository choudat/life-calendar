# Cahier des Charges - Life Calendar SaaS

## 1. Présentation du Projet
**Nom :** Life Calendar
**Objectif :** Une application SaaS permettant aux utilisateurs de visualiser leur vie sous forme de grille temporelle (Life Calendar), d'y ajouter des événements marquants, des périodes et des récurrences.

## 2. Parcours Utilisateur (User Flow)

### 2.1. Landing Page
- Présentation de la proposition de valeur.
- Boutons d'appel à l'action (CTA) pour s'inscrire ou se connecter.

### 2.2. Authentification
- **Solution :** Clerk.
- Création de compte / Connexion.

### 2.3. Onboarding (Premier accès)
- Si l'utilisateur n'a pas encore configuré son profil :
    - Ouverture d'une modale/dialogue.
    - Demande obligatoire de la **Date de Naissance** (Point de départ J0 du calendrier).

### 2.4. Interface Principale (Dashboard)
- Affichage du Life Calendar.
- Contrôles de visualisation.
- Gestion des données (Ajout d'événements, gestion des calendriers).

## 3. Fonctionnalités de Visualisation

### 3.1. Concept Temporel
- **J0 :** Date de naissance de l'utilisateur.
- Chaque cellule représente une unité de temps (semaine, jour, bloc de jours) selon le mode.

### 3.2. Modes de Visualisation
L'utilisateur peut basculer entre plusieurs vues :

1.  **Mode Classique (Semaine) - *Défaut***
    - Unité : 1 Semaine.
    - Structure : 1 ligne = 1 année (52 colonnes).
    
2.  **Modes Alternatifs (Basés sur des jours)**
    - *Vue "Annuelle détaillée" :* Unité = 10 jours, 1 ligne = 1 année.
    - *Vue "Densité Moyenne" :* Unité = 10 jours, 1 ligne = 500 jours.
    - *Vue "Macro" (Vie entière) :* Unité = 100 jours, 1 ligne = 5000 jours.

## 4. Modèle de Données

### 4.1. Entités Principales
- **Calendrier (Calendar)**
    - Conteneur d'événements.
    - Attributs : Titre, Icône.
    - *Note :* Un calendrier "Par défaut" est créé automatiquement. L'utilisateur peut en créer d'autres (ex: "Santé", "Carrière", "Voyages").
    - Fonctionnalité : Possibilité d'afficher/masquer des calendriers spécifiques sur la vue.

- **Événement (Event)**
    - Représente un point dans le temps ou une durée.
    - Attributs : 
        - Date de début (Obligatoire)
        - Date de fin (Optionnel - définit une **Période**)
        - Récurrence (Optionnel - ex: Mensuel, Annuel)
        - Description, Tags.
    - Lié à un Calendrier.
    - Visualisation : Icône pour ponctuel, Surlignage pour période.

- **Tag**
    - Attributs : Label, Icône, Couleur (implicite pour la visualisation).
    - Utilisé pour catégoriser les événements/périodes.

## 5. Interactions Interface

- **Interaction Cellule :**
    - Clic sur une cellule :
        - Si vide : Ouvre le formulaire d'ajout pré-rempli avec la date.
        - Si contenu existant : Ouvre une vue détaillée listant les événements/périodes actifs à cette date, avec un bouton pour en ajouter un nouveau.
- **Ajout de contenu :**
    - Bouton global "Ajouter".
- **Filtrage :**
    - Sélecteur pour activer/désactiver l'affichage des différents calendriers créés.
- **Navigation :**
    - Zoom / Changement de mode de vue.

## 6. Stratégie Technique (Phasage)

### Phase 1 : Prototype Frontend (Actuel)
- **Stack :** React (Vite ou Next.js), TailwindCSS.
- **Données :** Mock data (JSON en dur).
- **Stockage :** Aucun (ou LocalStorage temporaire).
- **Objectif :** Valider l'UX et les algorithmes de visualisation du calendrier.

### Phase 2 : Persistance Locale
- **Stockage :** LocalStorage / IndexedDB.
- **Fonctionnalités :** CRUD complet fonctionnel en local.

### Phase 3 : Backend & Auth
- **Auth :** Intégration de Clerk.
- **Backend :** API (Node.js/Next.js API Routes) + Base de données (PostgreSQL/Prisma).
- **Sync :** Sauvegarde des données utilisateur dans le cloud.

---
*Ce document servira de référence pour le développement.*
