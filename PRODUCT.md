# Product Overview

## Product Identity

**Name**: Lumora
**Type**: Premium social media platform
**Platforms**: Android & iOS (responsive web with React)
**Tech Stack**: Firebase Authentication · Firestore · Firebase Storage

---

## Positioning

Lumora is a premium Instagram-inspired social platform built for creators, explorers, and community-driven users. It delivers a clean, modern, and beautifully crafted space to share photos and videos, build a following, connect directly with the people who inspire them, and discover trending content. The platform prioritises safety, authenticity, and creator empowerment through multi-layer identity verification, AI-powered fake account detection, and a trusted blue badge system.

---

## Target Users

- **Creators**: photo, video, and short-form content makers who want a polished, premium canvas to share their work and grow a following
- **Social explorers**: discovery-oriented users who browse hashtags, reels, and trending content to find new creators
- **Community members**: users who follow, react, comment, DM, and engage deeply with the people they care about

---

## Core Functionality

### Authentication & Security
- User signup and login with Email + OTP / phone verification
- Two-Factor Authentication (2FA) on all accounts
- Login alerts for sign-ins from new or unrecognised devices
- Account recovery via email and phone number

### Identity Verification & Trust
- Multi-tier verification: email, mobile OTP, and government ID (required for creators and public profiles)
- Blue verified badge system for confirmed identities
- AI-powered fake account and bot detection hooks
- Manual review process for high-profile accounts
- Community reporting system for impersonation and fake profiles
- User blocking and reporting tools

### Profiles
- Profile pictures, bio, follower / following counts
- Post grid on profile page
- Saved posts section

### Content Sharing
- Photo and video uploads to Firebase Storage
- Reels — short vertical videos with infinite scroll
- Stories — 24-hour disappearing posts
- Post composition with captions and hashtag support

### Engagement
- Likes, comments, share on any post
- Real-time interactions via Firestore

### Social Graph
- Follow / unfollow system
- Follower and following counts visible on profiles

### Communication
- Direct messaging (DM) with real-time chat
- Voice and video calls

### Discovery
- Home feed with infinite scrolling (Firestore cursor-based pagination)
- Explore / discover page
- Hashtags and trending section
- Search — users, posts, hashtags

### Notifications
- In-app notifications: likes, comments, follows, DMs

### UX & Settings
- Dark and light mode toggle (system-aware + manual override)
- Settings page: account, privacy, notification preferences
- Smooth animations and clean premium UI
- Fully responsive for Android and iOS

---

## Design Language

Clean, modern, premium. The UI is inspired by Instagram's proven interaction conventions (bottom nav, profile grids, story rings, vertical reel scroll) but expresses a fully original visual identity — distinct typography, color palette, and component styling that avoids direct imitation. The product should feel built from scratch, not reskinned.

---

## Technical Architecture

| Layer | Technology |
|---|---|
| Frontend | React (web, mobile-responsive) |
| Authentication | Firebase Authentication |
| Database | Firestore (real-time NoSQL) |
| Media Storage | Firebase Storage |
| Animations | CSS / framework-native transitions |

---

## Strategic Principles

1. **Originality over imitation** — draw on Instagram's proven UX patterns but differentiate meaningfully in visual design and feature framing
2. **Performance first** — infinite scroll, lazy-loaded media, optimistic UI updates
3. **Security by default** — multi-layer identity verification (email, OTP, government ID), 2FA, AI-powered fake account detection, blue verified badges, and Firebase Auth for all user flows
4. **Mobile-native feel** — every interaction should feel native on both Android and iOS
5. **Scalable by design** — Firebase's serverless model handles growth from zero to thousands of daily active users without re-architecture
