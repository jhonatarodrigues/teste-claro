module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|react-native|@react-native|expo(nent)?|expo-modules-core|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|nativewind|react-native-css-interop)',
    'node_modules/.pnpm/(?!(react-native|@react-native\\+.*|expo(nent)?|expo-modules-core|@expo\\+.*|@react-navigation\\+.*|nativewind|react-native-css-interop)@)',
  ],
};
