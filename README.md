
#  TicketJO - Application de Billetterie JO 2024

Cette application permet aux utilisateurs d'acheter des billets pour les Jeux Olympiques 2024 via une boutique en ligne.
Elle inclut un espace utilisateur, un panier, ainsi qu'une interface d'administration pour gérer les billets et les paiements.

##  Fonctionnalités

 Boutique avec billets par type (Solo, Duo, Famille)  
 Panier interactif avec ajout/retrait de billets  
 Paiement sécurisé via Stripe  
 Gestion sécurisée des billets par les administrateurs  
 Capacité configurable pour chaque type de billet  
 Responsive Design compatible mobile et bureau  
 Authentification JWT  
 Développé avec React.js, Vite et Tailwind CSS  

## ⚙️ Installation du projet (version développeur)

**Pré-requis** :  
- Node.js v16 ou supérieur  
- npm  
- Un compte Stripe (pour la configuration des paiements)

### 1. Cloner le projet

```bash
git clone https://votre-depot-git.git
cd ticketjo
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copiez le fichier `.env.example` et renommez-le `.env`

```bash
cp .env.example .env
```

Dans `.env`, renseignez les variables suivantes :

```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxx
```

**Détails :**
- `VITE_API_URL` : L'URL de votre backend en production ou en local  
- `VITE_STRIPE_PUBLIC_KEY` : La clé publique Stripe pour les paiements côté client (disponible dans le dashboard Stripe)

### 4. Lancer le projet en mode développement

```bash
npm run dev
```

Accédez à l'application sur : [http://localhost:5173](http://localhost:5173)

##  Générer la version production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.  
Déployez ce dossier sur votre serveur web.

##  Stack Technique

- React.js
- Vite
- Tailwind CSS
- Stripe (paiement)  
- JWT pour l'authentification
- API REST backend (Java Spring Boot ou autre)
- LocalStorage pour la gestion du panier temporaire

##  Structure livrée

```
ticketjo/
├── src/              # Code source React
├── public/           # Fichiers publics (favicon, images par défaut)
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── README.md
```
##  Copyright

© 2024 TicketJO. Tous droits réservés.
