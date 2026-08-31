# ✦ Premium Interactive Birthday Gift

A mobile-first cinematic birthday experience built with **HTML5 + CSS3 + Vanilla JavaScript**.

## Project structure

```text
birthday-gift/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
├── audio/
│   └── birthday.mp3
└── README.md
```

The project intentionally has no framework and no required external dependency.

## Run it

The simplest option is VS Code + Live Server:

1. Open the `birthday-gift` folder in VS Code.
2. Install/use the **Live Server** extension if you have it.
3. Right-click `index.html` → **Open with Live Server**.
4. Open the displayed local address on your computer or phone.

You can also upload the folder to any static web host.

> Opening `index.html` directly may work, but a local server is recommended because browsers handle local media/files more reliably that way.

## 1. Change the name and messages

Open `script.js`. At the very top you will find:

```js
const birthdayConfig = {
  name: "NAME",
  personalMessage: "...",
  finalMessage: "...",
  constellationMessage: "...",
  wishMessage: "...",
  music: "audio/birthday.mp3"
};
```

Change only those values.

### Example

```js
name: "Sarah",
personalMessage: "Happy birthday! I hope this year gives you...",
finalMessage: "Here's to another amazing year.",
constellationMessage: "Some people make ordinary moments unforgettable.",
wishMessage: "I hope this year brings you amazing moments."
```

The name automatically appears in the birthday reveal and final celebration.

## 2. Add your photos

Put your own photos inside the `images` folder.

Then edit the `memories` array in `script.js`:

```js
const memories = [
  { image: "images/photo1.jpg", caption: "Our first memory", date: "2024" },
  { image: "images/photo2.jpg", caption: "That amazing day", date: "2025" },
  { image: "images/photo3.jpg", caption: "A moment to remember", date: "2026" }
];
```

You can add or remove objects. The gallery automatically creates its navigation dots.

If a photo is missing, a generated visual placeholder appears instead of breaking the gallery.

## 3. Add music

Put your audio file here:

```text
audio/birthday.mp3
```

The website **does not autoplay** audio. After the user starts the experience, they can use the small music button in the top-right corner.

If the file is missing, the rest of the experience continues normally and the music button is disabled gracefully.

## 4. Change colours

The main visual variables are at the top of `style.css`:

```css
:root {
  --bg: #060711;
  --text: #f7f5ff;
  --purple: #a78bfa;
  --blue: #647cff;
  --pink: #e7a6d8;
  --gold: #f1d49a;
}
```

You can change these values without editing the rest of the stylesheet.

## 5. What is implemented

- Cinematic mysterious intro
- Animated particles
- Gift box with hover/touch response and opening animation
- Birthday reveal with letter-by-letter animation
- Personal message with typewriter reveal
- Responsive photo gallery
- Previous/next controls
- Mobile swipe gestures
- Photo captions and dates
- Graceful missing-image fallback
- Interactive constellation canvas
- Hidden constellation message
- Interactive multi-layer cake
- Three clickable candles with flame/smoke animation
- Wish message + confetti
- Final fireworks using Canvas
- Replay button
- Optional music with no autoplay
- Desktop micro-interactions / 3D photo tilt
- Keyboard left/right navigation
- Visible focus states
- Reduced-motion support
- Mobile-first responsive layout
- No framework required

## 6. Customisation tips

For the best result, use:
- Photos with similar aspect ratios.
- Short captions.
- A personal message with a few paragraphs.
- A subtle instrumental audio track.

The website is deliberately written so the main personal content can be changed without understanding the whole codebase.

## 7. Deploy online

Any static hosting service can host these files. Keep the relative structure intact so paths such as `images/photo1.jpg` and `audio/birthday.mp3` continue to work.

Typical deployment workflow:
1. Upload the whole `birthday-gift` folder to your chosen static host.
2. Make sure `index.html` is the entry page.
3. Test the site on both desktop and phone.
4. Send the resulting website link as the digital gift.

## Accessibility

The project includes semantic sections, keyboard-focus styles, labelled controls, live regions for changing messages, and a `prefers-reduced-motion` mode.

## Performance

The particle counts are reduced on small screens. Canvas effects use `requestAnimationFrame`, images use lazy loading, and the experience avoids framework overhead.
