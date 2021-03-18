
# Tarot Trainer
This is a simple flashcard style app to help memorize the meanings of the 
Rider-Waite-Smith Tarot deck using the descriptions presented by one of the
original authors of the deck from his book, *The Pictorial Key to the Tarot,
A.E. Waite, 1910*. Pamela Coleman Smith produced the deck's artwork in 
collaboration with Waite, and it has remained one of the most popular Tarot 
decks of all time since.

Many books have been written covering the meanings of each card from many
different angles, such as their relationship to the Zodiac. This app doesn't
intend to encompass this larger body of work, but to simply focus on Waite's 
book. Mastering this content can establish a solid foundation the user can 
build on.

## Building
This project utilizes the WebPack toolchain to produce a minimized bundle along 
with other assets.

* `npm run build`  - Build the webpack bundle, etc. Output to `platforms` 
                     folder.
* `npm run serve`  - Run the app locally using WebPack's embedded web server.
* `npm run deploy` - Deploy the bundle and assets to a Github Pages site.
                     To use this feature, some setup is required; it makes
                     use of the 
                     [gh-pages](https://www.npmjs.com/package/gh-pages) package.

## Project Structure
This project follows the default folder structure for a Cordova project;
originally I intended to use Cordova to make this a standalone app, but
explored making it a **Progressive Web App**, which it currently is and will
likely remain so.

The JS code and HTML are separted under their own folders, `html` and `js`. For
each HTML page there is usually a corresponding Javascript file; the HTML
file proves the visual elements and layout while the Javascript provides the
functionality of the application. Custom Elements are used to partition the
project's elements and styling and the Javascript files will contain one
or more of these Custom Element implementations.

The `www` folder holds the code and assets that implement the application's
features. `platforms` is the build output folder where the WebPack
bundle is placed along with other build assets. The other folders and files
at the same level are standard Node folders typical for most other Node 
toolchain based projects.

The folders under `www` are:
* `css`     - Contains CSS style documents.
* `data`    - Data assets such as JSON configuration files.
* `html`    - HTML pages used by the Javascript custom elements.
* `img`     - The Tarot card images and others.
* `js`      - The Javascript files.

## Progressive Web Apps
This project aspires to be a 
[Progressive Web App](https://web.dev/what-are-pwas/). Being one it enjoys an
interseting status as being part standalone app and a Web based solution.
It can be easily installed on a user's device like an app, but doesn't need
an app store/market for distribution. It can be installed off any page that
serves it up.

Since this project doesn't require any advanced features that would depend on
device speicific API's, it can be build purely with existing Web technology, 
which gives it a very wide range of platforms that can run it as-is.
