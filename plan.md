# OwlChat React Native — Implementation Plan

Re-implement the OwlChat web frontend as a React Native Android application, preserving all features and API contracts.

## User Review Required

> [!IMPORTANT]
> **Build Error Fix**: The error `Android is disabled` occurred because commands were run in the `owlchat-frontend` directory. 
> I have updated `app.json` in the mobile project with explicit platform support. Please ensure all future `npx expo` commands are run inside `w:\OwlChat\owlchat-mobile`.

## Proposed Changes

### Environment & Run Fixes
#### [MODIFY] [app.json](file:///w:/OwlChat/owlchat-mobile/app.json)
Updated with explicit platform enabling to solve CLI environment detection issues.

### Phase 7: Chat Screens (Real-time Messaging)
Rebuilding the core chat experience.

#### [NEW] [ConversationDetailScreen.tsx](file:///w:/OwlChat/owlchat-mobile/src/screens/chat/ConversationDetailScreen.tsx)
The primary orchestrator. It will:
- Initialize the WebSocket connection via `useWebSocket`.
- Memoize and filter messages for the specific `conversationId`.
- Handle pagination (fetching older messages on scroll).

#### [NEW] [ChatHeader.tsx](file:///w:/OwlChat/owlchat-mobile/src/screens/chat/components/ChatHeader.tsx)
- Custom header with a back button using React Navigation.
- Profile summary (Avatar + Name) and real-time status marker.

#### [NEW] [ChatBody.tsx](file:///w:/OwlChat/owlchat-mobile/src/screens/chat/components/ChatBody.tsx)
- Uses an **Inverted** `FlatList` for optimized chat UX (newest messages at the bottom).
- Implements different bubble styles for "Me" vs "Them".
- Supports Text, Image, and File message rendering.

### Phase 7: Screens (Friends & Profile)
Expanding the social and identity features of the app.

#### [NEW] [FriendsScreen.tsx](file:///w:/OwlChat/owlchat-mobile/src/screens/friends/FriendsScreen.tsx)
- A multi-tab dashboard (using state-based tabs or segmented control).
- **Friends Tab**: Lists active friendships using `FriendCard` and optimized `FlatList`.
- **Requests Tab**: Shows incoming and outgoing friend requests.
- **Discover Tab**: Lists all users for potential friend discovery.

#### [NEW] [FriendCard.tsx](file:///w:/OwlChat/owlchat-mobile/src/screens/friends/components/FriendCard.tsx) [DONE]
- Reusable UI for user summaries.
- Dynamic profile fetching based on `friendId`.

#### [NEW] [ProfileScreen.tsx](file:///w:/OwlChat/owlchat-mobile/src/screens/profile/ProfileScreen.tsx)
- Unified identity view.
- Real-time profile editing (Name, Bio, Gender).
- Theme toggler (Light/Dark/System) linked to `ThemeProvider`.
- Logout functionality trigger.

### Phase 8: Shared Components
#### [NEW] [ThemedButton.tsx](file:///w:/OwlChat/owlchat-mobile/src/components/shared/ThemedButton.tsx) [DONE]
#### [NEW] [ThemedCard.tsx](file:///w:/OwlChat/owlchat-mobile/src/components/shared/ThemedCard.tsx) [DONE]
#### [NEW] [Avatar.tsx](file:///w:/OwlChat/owlchat-mobile/src/components/shared/Avatar.tsx) [DONE]


## Research Summary

After a thorough deep-dive into every file in the existing web codebase, here is the full inventory:

### Source Codebase Inventory
| Layer | Files | Key Details |
| :--- | :--- | :--- |
| **Types / Enums** | 16 files | auth, chat, message, friend, friendship, block, api, user-profile, account types + 7 enums |
| **Services** | 8 files | account-service, chat-user-service, chat-member-user-service, message-user-service, friend-service, friendship-service, user-profile-service, block-service |
| **Hooks** | 9 files | use-auth, use-chat-user, use-chat-member-user, use-chat-message-user, use-friend, use-friendship, use-user-profile, use-localstorage, use-mobile |
| **Providers** | 5 files | AuthProvider (empty), ThemeProvider, WebSocketProvider, UserProfileProvider, QueryProvider (empty) |
| **Auth Feature** | 4 files | LoginPage, RegisterPage, LoginForm, RegisterForm |
| **Chat Feature** | 8 files | ConversationPage/Layout/Item/Container, ConversationDetailPage, ChatHeader, ChatBody, ChatInput |
| **Friend Feature** | 12+ files | FriendPage (tabs: list/add/discovery), multiple sub-pages and cards |
| **Profile Feature** | 5+ files | ProfileLayout, ProfilePage, ProfileDetailPage, ProfileIdentity, ProfileFriends |
| **Admin Feature** | 10+ files | AdminPage, AdminLayout, AdminSidebar + items, AdminContentUsers, AdminContentUser, AdminContentChats, AdminContentFallback, configs |
| **Sidebar / Nav** | 3 files | DesktopNav, MobileNav, SidebarWrapper |
| **UI Components** | 53 files | Full shadcn/ui library (buttons, cards, dialogs, tables, forms, etc.) |
| **Shared Components** | 4 files | LoadingLogo, ErrorLogo, UserAvatar, CustomAlert |
| **Config / Lib** | 6 files | api.ts, env.ts, axios.ts, local-storage.ts, utils.ts, websocket.ts |
| **Styles** | 2 files | index.css (166 lines, full oklch theme), App.css |

### Key Architecture Patterns Discovered
- **Microservice backend**: 3 separate service prefixes — `USER_SERVICE`, `CHAT_SERVICE`, `SOCIAL_SERVICE`
- **Custom headers**: Services use `X-Account-Id` header + `requesterId` query param for authorization context
- **Token management**: JWT stored in `localStorage`; auto-refresh via Axios interceptor on 401
- **WebSocket**: STOMP over native WebSocket with token sent as query param
- **Theme**: oklch color system with light/dark mode via CSS class `.dark` on `<html>`
- **Navigation paths**: Conversations, Friends, Groups, Marketplace, Finds (last 3 seem planned, not fully built)
- **Vietnamese locale**: Some error messages and UI strings are in Vietnamese

## Proposed Changes

### Phase 1: Project Scaffolding
- [NEW] Project root at `w:\OwlChat\owlchat-mobile`
- Initialize with `npx create-expo-app@latest ./ --template blank-typescript`
- Install core dependencies: `nativewind`, `react-navigation`, `axios`, `@stomp/stompjs`, `expo-secure-store`, `react-hook-form`, `zod`, `lucide-react-native`, `react-native-paper`
- Configure nativewind with a `tailwind.config.ts` mirroring web design tokens
- Configure `tsconfig.json` with `@/` path alias

### Phase 2: Foundation Layer (Types, Config, Lib)
- [NEW] `src/types/` — Direct port (16 files)
    - All type definitions and enums copy over 1:1 with zero changes.
- [NEW] `src/config/api.ts`
    - Replace `import.meta.env` with `expo-constants` or `react-native-dotenv`
- [NEW] `src/lib/axios.ts`
    - Replace `localStorage` calls with `expo-secure-store`
    - Replace web redirection with navigation reset via `CommonActions`
- [NEW] `src/lib/secure-storage.ts`
    - Drop-in replacement for `local-storage.ts` using `expo-secure-store`
- [NEW] `src/lib/websocket.ts`
    - Same WebSocketClient class using `@stomp/stompjs`

### Phase 3: Services Layer (8 files)
- [NEW] `src/services/*`
    - All 8 service files port directly. Changes: File type → RN file object for uploads.

### Phase 4: Hooks Layer (9 files)
- [NEW] `src/hooks/*`
    - All hooks port 1:1 except `use-localstorage.tsx` → `use-secure-storage.tsx` and removing `use-mobile.tsx`.

### Phase 5: Providers (4 files)
- [NEW] `src/providers/ThemeProvider.tsx`
- [NEW] `src/providers/WebSocketProvider.tsx`
- [NEW] `src/providers/UserProfileProvider.tsx`
- [NEW] `src/providers/AuthProvider.tsx`

### Phase 6: Navigation
- [NEW] `src/navigation/AppNavigator.tsx`
    - **RootStack**
        - **AuthStack**: Login, Register
        - **MainTabs**: ConversationsStack (List, Detail), FriendsStack, ProfileStack, AdminStack (Conditional)

### Phase 7: Screens
#### Auth Screens
- `LoginScreen` (from `login-form.tsx`)
- `RegisterScreen` (from `register-form.tsx`)

#### Chat Screens
- `ConversationsListScreen` (from `conversations-layout.tsx` + `conversation-item.tsx`)
- `ConversationDetailScreen` (from `conversation-detail-page.tsx`)

#### Friend Screens
- `FriendsScreen` (from `friend-page.tsx` with tabs)

#### Profile Screens
- `ProfileScreen` (from `profile-page.tsx`)
- `ProfileDetailScreen` (from `profile-detail-page.tsx`)

#### Admin Screens (Conditional)
- `AdminDashboardScreen`
- `AdminUsersScreen`
- `AdminUserDetailScreen`

### Phase 8: Shared Components
- [NEW] `src/components/`
    - `ThemedCard`, `ThemedButton`, `ThemedInput`, `Avatar`, `LoadingSpinner`, `AlertBanner`, `EmptyState`

### Phase 9: Theme System
- [NEW] `src/theme/colors.ts`
    - Convert OKLCH CSS variables to RGB/HEX for RN.

## Open Questions

> [!IMPORTANT]
> 1. **Admin panel on mobile?** The admin-content-user.tsx alone is 33KB. Building this for mobile is a significant effort. Should it be included or deferred?
> 2. **Environment variables**: I need the actual values for `VITE_API_BASE_URL`, etc., to configure the mobile app. Can you provide those?
> 3. **File uploads**: On mobile, we'll use `expo-image-picker` and `expo-document-picker`. Is that acceptable?

> [!WARNING]
> 1. **Groups / Marketplace / Finds**: These appear to be future features in the web app. Should I include them as placeholder screens or omit them entirely?

## Verification Plan

### Automated Tests
- Unit tests for all services with Jest mocks
- Unit tests for hooks with `@testing-library/react-native`
- Component snapshot tests for all screens

### Manual Verification
1. Build and run on Android emulator via `npx expo run:android`
2. Test full auth flow (login → conversations → chat → profile → logout)
3. Test WebSocket real-time messaging
4. Test file upload (avatar, image messages)
5. Test dark/light theme toggle
6. Verify API contracts match web version exactly

### Build Verification
- Generate Android APK via `eas build --platform android --profile preview`
- Test APK on physical Android device
