# Responsive Text Figma Plugin

_Responsive Text_ is a Figma plugin that will let you determine (and set) the pixel value of a given text size based on a set of ranges, mimicing responsive typography in a web browser.

The method used is described in detail in this excellent [CSS Tricks](https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/) article by Pedro Rodriguez.

This plugin takes care of the math and updates the text size of the selected text frame(s), it'll also display the CSS `clamp()` function so that you can hand that off to developers.

Because Figma doesn't, yet, allow for triggering plugin code on events (like frame resizing) it's not truly responsive typography, but rather it let's you update font size at a specified frame size without having to manually calculate and update it.

## Usage

Select the text frame you want to update and launch the plugin.

The plugin takes a number of inputs - the minimum and maximum viewports the font should scale in-between, the minimum and maximum font values, the viewport size you are currently targeting, and the number of pixels in a REM (this is defaulted to 16, and most likely there is no need to change this). Once you click `Create` the text frame you've selected will override with the newly calculated pixel value. The clamping function that the plugin generated will be displayed in the plugin popup window. You'll probably want to note that somewhere in documentation so that developers can implement it.

## Development

- Clone this repository
- Run `npm install` to get the packages
- Run `npm run dev` to run the webpack watcher
