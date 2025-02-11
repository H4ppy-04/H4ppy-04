---
slug: setting-up-a-development-environment
title: Setting up a development environment
date: 2025-11-02T18:05:56.154Z
excerpt: How to setup your perfect digital experience
coverImage: /images/posts/systemd-logo-banner.png
tags:
  - systemd
  - workflow
  - development
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
  import Image from "$lib/components/atoms/Image.svelte";
</script>

# Setting up a system

Recently I was helping a friend over discord set-up a new system. Don't get me wrong, setting up a new system can be intense; there are so many rabbit holes to go down. I figured that I would share my thoughts and experiences on setting up a system for general use. I guess general use also includes

 * Listening to music
 * Managing emails
 * Watching movies
 * Writing code
 * (Insert your favourite pastime here)

And I found myself doing a few common things. I'll be going over those things in this post.

## Selecting a display server

I don't really have too much to say on this, as I've only ever really used X for managing a display daemon. If you'd like to learn more about X, see [this excellent post](https://grimoire.carcano.ch/blog/x-window-tutorial-x-display-server-howto-and-cheatsheet/) by Marco Antonion Carcano.

Starting a display server will basically execute whatever you have in your `~/.xinitrc` file which is basically a *"fancy shell script"*. In it, you can put what you want, but the most important thing, is to make sure that you have this at the bottom of it:


<CodeBlock lang="sh">

  ```sh
exec /usr/bin/your_display_manager_goes_here
  ```

</CodeBlock>

## Setting up a wallpaper

The first step to truly making a system *yours* is to select a wallpaper. Honestly there's no judgement here, whatever looks good to you. If you'll recall the `~/.xinitrc` file, you'll want to put the program that *sets* your wallpaper *above* executing your window manager.

There are 2 really decent wallpaper 'setters' that I know of as of this moment.

1. [xwallpaper](https://github.com/stoeckmann/xwallpaper) - A minimal wallpaper setter designed to be used with X.
2. [feh](https://feh.finalrewind.org) - A more general image viewer that can also be used to set wallpapers.

### xwallpaper example

<CodeBlock lang="sh">

```sh
xwallpaper --clear --output HDMI-1 --maximize ~/Pictures/wallpaper.png
xwallpaper --clear --output eDP-1 --zoom ~/Pictures/wallpaper_2.png
```

</CodeBlock>

### feh example

<CodeBlock lang="sh">

```sh
feh --bg-scale ~/Pictures/wallpaper.png
```

</CodeBlock>

They both do similar things, but I prefer feh, as the documentation and command line arguments are more straightforward.

## Terminals

There are the best terminals (in my opinion)

 * kitty
 * wezterm
 * st (suckless terminal)

I personally use st, as it is highly minimal, patch-based, and compiled. You can use whichever you see fit.

## Program selector

In a minimal workflow environment such as if you are using

 * bspwm
 * i3
 * dwm
 * hyprland

or any other non-desktop-environment workflow, you basically have two main options.

 1. dmenu - a dynamic menu for x
 2. rofi - A "dmenu replacement" *[according to the documentation](https://manpages.org/rofi)*

### Dmenu

dmenu is the default for dwm, i3, and basically every other window manager. It is not that aesthetic, but it gets the job done.

### Rofi

For those that are looking for a more 'aesthetic' user experience, Rofi may be what you're looking for. It offers extensive customization abilities and is often used in conjunction with more 'aesthetic' programs such as picom and polybar.

A full example, using [DWM](https://git.suckless.org/dwm) as the display manager might look like this:


<CodeBlock lang="sh">

```sh
#!/usr/bin/env bash

[ -f "~/.Xresources" ] && xrdb -merge "~/.Xresources"
[ -f "~/.Xmodmap" ]    && xmodmap "~/.Xmodmap"

BAT=$(acpi | head -1)
xsetroot -solid "#002b36"
xbanish -t 2 &
setxkbmap us -variant colemak -option ctrl:nocaps
dwmbar &

systemctl --user import-environment DISPLAY

xset -r -b

exec dwm
```

</CodeBlock>

Which (roughly translates to) a few of the things that you see below. (This is what it looked like when I was writing this).

<Image fullBleed src="/images/posts/desktop-preview.png" alt="Desktop preview image" />
