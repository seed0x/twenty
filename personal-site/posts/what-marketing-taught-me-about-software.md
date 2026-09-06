---
title: What marketing taught me about writing software
date: 2026-07-12
---

I came to software from marketing, which is an unusual direction. Most people I know went the other way, or never crossed at all. Three years of running campaigns before I wrote production code left me with a set of reflexes that turned out to be surprisingly useful. Here are the ones that stuck.

## Nobody reads your README

In marketing you learn on day one that people don't read. They scan. They look at the headline, the first line, the picture, and then they decide. A landing page gets about three seconds to make its case.

Documentation is the same. The README that opens with two paragraphs of philosophy before showing an install command will be closed before the install command. Lead with what it does, show it working in five lines, and put the philosophy at the bottom for the two people who want it.

The same goes for pull requests, error messages and commit logs. If the first line doesn't carry the message, the rest doesn't get read.

## Positioning is an API

A product's positioning is the promise it makes: *this thing, for these people, instead of that other thing*. Once you commit to it, everything else has to be consistent with it — the pricing page, the onboarding, the feature you decide not to build.

An API is the same kind of promise. The names you pick and the shape of the data tell people what the thing is *for*. Change them casually and you've broken the promise even if the code still runs. I think about public interfaces the way I used to think about a tagline: pick one, say it the same way everywhere, and don't change it without a very good reason.

## Measure the thing you actually care about

Marketing is drowning in metrics, and the useful skill is ignoring most of them. Page views are not customers. Open rates are not revenue. You find the one or two numbers that mean the business is working and you watch those.

Engineering has the same trap. Test coverage isn't correctness. Story points aren't progress. Lighthouse scores aren't users having a good time. The question I try to keep asking is: *if this number went up and nothing else changed, would anyone be better off?*

## Ship the small version, then find out

The best campaign I ever ran started as a plain-text email I wrote in twenty minutes because the designed version wasn't ready. It outperformed the designed version by a factor of two. We never went back.

I've seen the same thing in software more times than I can count. The quick prototype gets used; the careful architecture gets rewritten. That's not an argument against care — it's an argument for finding out what people want *before* being careful about it.

## Say it plainly

Good marketing copy sounds like a person talking. So does good code: clear names, short functions, comments that explain *why* rather than *what*. Cleverness is a cost you pay every time someone reads it.

---

If you've made a similar crossing — in either direction — I'd love to hear what you kept. The [Contact](#/contact) window is right there.
