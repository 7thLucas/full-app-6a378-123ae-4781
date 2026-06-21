# Product Overview

## Product Identity

**Name**: TBD (to be confirmed during onboarding)
**Type**: Social media mobile application
**Platforms**: Android & iOS (responsive)
**Tech Stack**: Firebase Authentication · Firestore · Firebase Storage

---

## Positioning

A premium, original social media platform for photo and video sharing — inspired by Instagram's interaction patterns but built with a distinct visual identity. The product targets everyday creators and social users who want a clean, fast, beautifully designed space to share moments, build an audience, and connect directly with the people they care about.

---

## Target Users

- **Content creators**: people who regularly share photos and short videos and want a polished canvas for their work
- **Social connectors**: users primarily motivated by following friends, reacting to posts, and messaging people they know
- **Explorers**: discovery-oriented users who browse hashtags, search new creators, and engage with trending content

---

## Core Functionality

### Authentication & Profiles
- User signup and login via Firebase Authentication (email/password)
- Personal profile page: profile picture, bio, post grid
- Secure session management and token handling

### Identity Verification & Trust
- Multi-tier account verification: email, mobile number (OTP), and government ID (required for creators and public profiles)
- Blue verified badge system for confirmed identities
- AI-powered fake account and bot detection
- Two-Factor Authentication (2FA) on all accounts
- Login alerts for sign-ins from new or unrecognised devices
- Account recovery via email and phone number
- Manual review process for high-profile accounts
- Community reporting system for impersonation and fake profiles
- **Platform goal**: a trusted space where users can verify identities and where spam, bots, and fake profiles are actively suppressed

### Content Sharing
- Photo and video upload to Firebase Storage
- Post composition with caption and hashtag support
- Home feed with infinite scrolling (Firestore cursor-based pagination)

### Engagement
- Like and comment on any post (real-time via Firestore)
- Hashtag indexing for content discovery

### Social Graph
- Follow and unfollow users
- Follower / following counts visible on profiles

### Communication
- Direct messaging between users (real-time Firestore listeners)
- In-app notification system: new followers, likes, comments, DMs

### Discovery
- User search by username or display name
- Hashtag search and browsing

### UX & Settings
- Dark mode toggle (system-aware + manual override)
- Settings page: account, privacy, notification preferences
- Smooth UI animations throughout the app

---

## Design Language

Clean, premium, editorial. The UI is inspired by Instagram's established interaction conventions (bottom nav, profile grids, story-style highlights) but expresses a fully original visual identity — distinct typography, color palette, and component styling that avoids direct imitation. The product should feel built from scratch, not reskinned.

---

## Technical Architecture

| Layer | Technology |
|---|---|
| Frontend | Mobile-responsive (Android & iOS) |
| Authentication | Firebase Authentication |
| Database | Firestore (real-time NoSQL) |
| Media Storage | Firebase Storage |
| Animations | CSS / framework-native transitions |

---

## Strategic Principles

1. **Originality over imitation** — draw on Instagram's proven UX patterns but differentiate meaningfully in visual design and feature framing
2. **Performance first** — infinite scroll, lazy-loaded media, optimistic UI updates
3. **Security by default** — multi-layer identity verification (email, OTP, government ID), 2FA, AI-powered fake account detection, blue verified badges, and Firebase Auth for all user flows; Storage rules limit access to authenticated users only
4. **Mobile-native feel** — every interaction should feel native on both Android and iOS, not like a mobile website
5. **Scalable by design** — Firebase's serverless model handles growth from zero to thousands of daily active users without re-architecture
