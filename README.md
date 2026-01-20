<p align="center">
  <img src="https://github.com/Talishar/Talishar/blob/main/Images/TalisharLogo.webp?raw=true" width="623" height="278" alt="Talishar" />
</p>

<h3 align="center">Talishar is a browser-based platform to play Flesh and Blood. It is a fan-made FABTCG project not associated with Legend Story Studios.</h3>

[![license](https://flat.badgen.net/github/license/talishar/CardImages)](./LICENSE)
[![discord](https://flat.badgen.net/discord/online-members/JykuRkdd5S?icon=discord)](https://discord.gg/JykuRkdd5S)
[![twitter](https://flat.badgen.net/badge/twitter/@talishar_online/1DA1F2?icon=twitter)](https://twitter.com/talishar_online)
[![bluesky](https://flat.badgen.net/badge/bluesky/pvtvoid/1185FE?icon=bluesky)](https://bsky.app/profile/talishar.bsky.social)
[![patreon](https://flat.badgen.net/badge/become/a%20patreon/F96854?icon=patreon)](https://metafy.gg/@Talishar)

Visit [Talishar.net](https://talishar.net/) to get playing Flesh & Blood in your browser right now!

## Getting started with CardImages

This repository stores and generates card images for the Talishar project in multiple languages. It handles downloading cards from official sources, resizing images, creating variants, and generating translation reference files for non-English languages.

### Related Repositories
- [Talishar](https://github.com/Talishar/Talishar) - PHP backend with game logic and API
- [Talishar-FE](https://github.com/Talishar/Talishar-FE) - TypeScript/React frontend interface

## Requirements / How to install

### Prerequisites:

- node.js (version 10 or higher)
- git

```
git clone https://github.com/Talishar/Card-Images
```

```
cd Card-Images
```

```
npm install
```

## Project Structure

```
CardImages/
├── media/              # Card images organized by language
│   ├── en/            # English card images
│   └── [lang]/        # Other language card images
├── scripts/           # Utility scripts for image processing
├── uploadImages.js    # Script to manage image uploads
├── package.json       # Node.js dependencies
└── README.md         # This file
```

### Image Storage
- **`media/[language]/`** - Contains card images for each language
  - Images are downloaded from official sources and resized for optimal display
  - Square copies are created for consistent UI rendering
  - Used by both backend (for exports/displays) and frontend (for card rendering)

### Generated Files
- **Translation reference JSON files** - Compare original card IDs with reprint set IDs for multi-language support

## Scripts

### downloadImages

```
node downloadImages.js
```

Use this script when you need to download a card, a set or the whole language collection. It downloads the image, resizes it, and creates a square copy.

### generateTranslatedCollections

```
node generateTranslatedCollections.js
```

Use this script when a new reprint set like History Pack is released. It generates a JSON file that compares original card IDs with new collection IDs. This JSON is used in Talishar-FE to translate cards to any language.

**Note**: Sometimes cards cannot generate reference translations automatically. Check terminal errors and verify manually.

### uploadImages

```
node uploadImages.js
```

Manages uploading processed images to the appropriate locations for use by backend and frontend.

## Disclaimer

All artwork and card images © Legend Story Studios.

Talishar.net is in no way affiliated with Legend Story Studios. Legend Story Studios®, Flesh and Blood™, and set names are trademarks of Legend Story Studios. Flesh and Blood characters, cards, logos, and art are property of [Legend Story Studios](https://legendstory.com/).
