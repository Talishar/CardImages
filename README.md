<p align="center">
  <img src="https://github.com/Talishar/Talishar/blob/main/Images/TalisharLogo.webp?raw=true" width="623" height="278" alt="Talishar" />
</p>

<h3 align="center">Talishar is a browser-based platform to play Flesh and Blood. This is an unofficial project not linked to or endorsed by Legend Story Studios.</h3>

[![license](https://flat.badgen.net/github/license/talishar/talishar)](./LICENSE)
[![discord](https://flat.badgen.net/discord/online-members/JykuRkdd5S?icon=discord)](https://discord.gg/JykuRkdd5S)
[![patreon](https://flat.badgen.net/badge/become/a%20patreon/F96854?icon=patreon)](https://www.patreon.com/talishar)
[![twitter](https://flat.badgen.net/twitter/follow/talishar_online?icon=twitter)](https://twitter.com/talishar_online/)
[![github](https://flat.badgen.net/github/last-commit/Talishar/Card-Images?icon=github)](https://github.com/Talishar/Card-Images/)

Visit [Talishar.net](https://talishar.net/) to get playing Flesh & Blood in your browser right now!

# Getting started with Card-Images

This is the repository to store all the images and generate images in a language other than English used in the Talishar project.

## Requirements / How to install:

### Prerequesites:

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

## Scripts

### downloadImages

```
node downloadImages.js
```

Use this script when you need to download a card, a set or the whole language collection to download the image, resize it and create a square copy.

### generateTranslatedCollections

```
node generateTranslatedCollections.js
```

Use this script when a new reprint set like History Pack is released to generate a JSON to compare the original card ID with the new collection ID. This JSON should be used in Talishar-FE to translate to any language rather than english.

Keep in mind sometimes some cards can not be able to generate the reference translation, check the error in the terminal to check it manually.

Learn more about the Talishar-FE project here: [Talishar-FE](https://github.com/Talishar/Talishar-FE)

## Disclaimer

All artwork and card images © Legend Story Studios.

Talishar.net is in no way affiliated with Legend Story Studios. Legend Story Studios®, Flesh and Blood™, and set names are trademarks of Legend Story Studios. Flesh and Blood characters, cards, logos, and art are property of [Legend Story Studios](https://legendstory.com/).
