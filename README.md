# 🏡 Real Estate App

A modern, feature-rich real estate mobile application built with React Native and Expo, powered by Appwrite backend services.

## ✨ Features

- **🔐 Authentication**: Secure Google OAuth integration for seamless user login
- **🏠 Property Listings**: Browse featured and recommended properties
- **🔍 Advanced Search**: Search properties by name, location, or type
- **🎯 Smart Filters**: Filter properties by type (House, Apartment, Villa, etc.)
- **📱 Property Details**: Comprehensive property information including:
  - High-quality images and gallery
  - Agent contact details
  - Facilities and amenities
  - User reviews and ratings
  - Interactive location display
- **👤 User Profile**: Personalized profile management
- **💫 Beautiful UI**: Modern design with smooth animations using NativeWind (Tailwind CSS)

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Appwrite (BaaS)
- **Navigation**: Expo Router
- **Language**: TypeScript
- **Authentication**: OAuth 2.0 (Google)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Git
- Android Studio / Xcode (for emulator)
- Appwrite instance (self-hosted or cloud)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lucky-arya/Real_Estate_App.git
   cd Real_Estate_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID=your_agents_collection_id
   EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID=your_galleries_collection_id
   EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
   EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=your_properties_collection_id
   ```

4. **Configure Appwrite**
   
   - Create an Appwrite project
   - Set up the following collections:
     - `agents` - Store agent information
     - `properties` - Store property listings
     - `reviews` - Store user reviews
     - `galleries` - Store property images
   - Configure Google OAuth provider
   - Add your platform (iOS/Android bundle ID)

## 📱 Running the App

**Start the development server**
```bash
npx expo start
```

**Run on Android**
```bash
npx expo start --android
```

**Run on iOS**
```bash
npx expo start --ios
```

**Run on Web**
```bash
npx expo start --web
```

## 📂 Project Structure

```
Real_State_app/
├── app/                    # App screens and navigation
│   ├── (root)/            # Main app screens
│   │   ├── (tabs)/        # Tab navigation screens
│   │   └── properties/    # Property detail screens
│   ├── _layout.tsx        # Root layout
│   └── sign-in.tsx        # Authentication screen
├── assets/                 # Static assets
│   ├── fonts/             # Custom fonts
│   ├── icons/             # Icon images
│   └── images/            # App images
├── components/            # Reusable components
│   ├── Cards.tsx          # Property cards
│   ├── Comment.tsx        # Comment display
│   ├── Filters.tsx        # Filter component
│   ├── Search.tsx         # Search component
│   └── noResult.tsx       # Empty state component
├── constants/             # App constants
│   ├── data.ts            # Static data
│   ├── icons.ts           # Icon exports
│   └── images.ts          # Image exports
├── lib/                   # Core functionality
│   ├── appwrite.ts        # Appwrite configuration
│   ├── global-provider.tsx # Global state management
│   ├── useAppwrite.ts     # Custom hooks
│   └── seed.ts            # Database seeding script
└── tailwind.config.js     # Tailwind configuration
```

## 🎨 Key Features Implementation

### Authentication Flow
- OAuth 2.0 integration with Google
- Automatic session management
- Protected routes

### Property Management
- Real-time data fetching from Appwrite
- Optimized image loading
- Pagination support

### Search & Filter
- Dynamic query building
- Multi-parameter search
- Type-based filtering

## 🔧 Configuration

### NativeWind Setup
The app uses NativeWind for styling. Configuration is in:
- `tailwind.config.js`
- `nativewind-env.d.ts`

### TypeScript
Type definitions are configured in `tsconfig.json` with strict mode enabled.

## 🌱 Database Seeding

To populate your database with sample data:

```typescript
import seed from './lib/seed';
// Run the seed function once
seed();
```

## 📸 Screenshots

> Add your app screenshots here

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Lucky Arya**
- GitHub: [@lucky-arya](https://github.com/lucky-arya)

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Appwrite for the backend services
- NativeWind for Tailwind CSS integration

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Made with ❤️ using React Native & Expo**
