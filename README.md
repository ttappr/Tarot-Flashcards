
# Tarot Trainer
This is a simple flashcard style app to help memorize the meanings of the 
Rider-Waite-Smith Tarot deck using the meanings presented by one of the original
authors of that particular deck in his book, *The Pictorial Key to the Tarot,
A.E. Waite, 1910*. Pamela Coleman Smith produced the original artwork for the
deck in collaboration with Waite, and it has remained one of the most popular
Tarot decks of all time since.

Many books have been written covering the meanings of each card from many
different angles, such as their relationship to the Zodiac. This app doesn't
intend to encompass this larger body of work, but to simply focus on Waite's 
book. Taking this approach, users of this app will have a good foundation to
continue learning after mastering the meanings presented by the original 
author.

## Building
This project utilizes the WebPack toolchain to produce a minimized bundle along 
with other assets.

* `npm run build`  - Build the webpack bundle, etc. Output to `platforms` 
                     folder.
* `npm run serve`  - Run the app locally using WebPack's embedded web server.
* `npm run deploy` - Deploy the bundle and assets to (my) Github Pages.
                     This can be reconfigured to work with other (your) 
                     deployment solutions.
