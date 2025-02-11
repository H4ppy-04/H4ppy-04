---
slug: icloud-photos-integration
title: Synchronizing iCloud Calendar
date: 2023-04-22T21:55:27.154Z
excerpt: How I synchronize my iCloud calendar.
coverImage: /images/posts/icloud-calendar-automation.jpg
tags:
  - iCloud
  - automation
  - systemd
---

<script>
  import Callout from "$lib/components/molecules/Callout.svelte";
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
  import Image from "$lib/components/atoms/Image.svelte";
</script>

## The Problem

A lot of my workflow is terminal-based. My email client, text editor, music player, calendar and IRC client are all terminal applications. My family has a **shared calendar** wherein all the events that concern members of the family are stored. However, I'll frequently waste time doing something like this.

### Open up my email

I'll open up mutt to see if there have been any new events that are created. New events are forwarded to my inbox.

### Download and import a `.ics` file

A convenient `.ics` file is always attached to any automatic event emails. I'll manually save and import these into [Khal](https://lostpackets.de/khal/).

---

All this is very tedious. I needed to find some way to be able to automate this process. That's when I found out about [vdirsyncer](https://github.com/pimutils/vdirsyncer) - a program that automatically syncs your iCloud calendar events.

## Configuring vsyncdir

I'd simply add a configuration file, telling *vsyncdir* a few important details.

 1. Where to fetch the events from.
 2. The calendar ID (since you can have multiple iCloud calendars).
 3. iCloud authentication details - as the calendar is private.
 4. Where to store the events

All in all, it looks like this. Sensitive information has been redacted for security purposes.

<CodeBlock lang="conf" filename="~/.config/vdirsyncer/config">

```toml
[general]
status_path = "~/.local/share/vdirsyncer/status/"

[pair family]
a = "family_local"
b = "family_remote"
collections = ["4138f409266b0ef84e8ccc6a2153c5ae9c12e5a345e61cad05db17cc05430a3a"]

[storage family_local]
type = "filesystem"
path = "~/.calendars/icloud/"
fileext = ".ics"

[storage family_remote]
type = "caldav"
url = "https://caldav.icloud.com/<USER_ID>/calendars/<CALENDAR_ID>/"
username = "<ICLOUD EMAIL>"
password = "<ICLOUD PASSWORD>"
```

</CodeBlock>

### Syncing remote data

After a configuration file has been defined, we can actually start the synchronization process. It's a matter of just discovering the remote calendar identifier(s) and then following up by syncing the remote calendar data using *vdirsyncer*.

<Callout type="warning">
  Upon synchronising, you'll get a few warnings and errors when importing events. This is due to the experimental nature of `ics` file serialization.
</Callout>

Discover and synchronize as follows.

<CodeBlock lang="sh">

```
vdirsyncer discover && vdirsyncer sync
```

</CodeBlock>

It may also be handy to have this linked up to a systemd process. For example, on my server, I have the following setup.

I have a timer that is linked to the synchronization of common tasks such as reloading emails and calendar events:


<CodeBlock lang="systemd" filename="~/.config/systemd/user/sync.timer">

```systemd
[Unit] 
Description=Periodically synchronize remote data 
Requires=mbsync.service 
Requires=icloud.service 
Wants=network-online.target 
After=network-online.target 

[Timer] 
OnStartupSec=1m 
OnUnitActiveSec=3m 
Unit=mbsync.service 

[Install] 
WantedBy=timers.target 
```

</CodeBlock>

This is then "linked" to the following service files.

### Get recent iCloud photos

<CodeBlock lang="systemd" filename="~/.config/systemd/user/photos.service">

```systemd
[Unit]
Description=Periodically synchronize icloud data
AssertPathExists=/run/media/ssd/icloud/
AssertPathExists=%h/.calendars/icloud
Wants=photos.timer

[Service]
type=oneshot
ExecStart=/usr/bin/icloudpd --directory /run/media/ssd/icloud --username <email> --password <password> --library "PrimarySync" --recent 10 --notification-email joshuarose@gmx.com

TimeoutSec=300

[Install]
WantedBy=default.target
```

</CodeBlock>

### Get new calendar events

<CodeBlock lang="systemd" filename="~/.config/systemd/user/calendar.service">

```systemd
[Unit]
Description=Periodically synchronize icloud calendar data
AssertPathExists=%h/.local/share/vdirsyncer/status
AssertPathExists=%h/.calendars/icloud
Wants=sync.timer

[Service]
type=oneshot
ExecStart=/usr/bin/vdirsyncer sync

TimeoutSec=500

[Install]
WantedBy=default.target
```

</CodeBlock>


## Displaying `.ics` data with Khal

Khal *does* know how to display `.ics` files, but it takes a bit of
hand-holding. Here's what my Khal configuration looks like:

<CodeBlock lang="conf" filename="~/.config/khal/config">

  ```toml
  [calendars]
  [[icloud]]
  path = ~/.calendars/icloud/<CALENDAR_ID>
  ```
</CodeBlock>

Then once you open Khal you should be seeing the same events that are in your iCloud calendar. Here's what it looks like for me:

<Image fullBleed src="/images/khal-screenshot.png" alt="Screenshot of khal with all the synchronized events from iCloud" />
