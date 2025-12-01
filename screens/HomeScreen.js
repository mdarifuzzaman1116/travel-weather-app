import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const maxWidth = isWeb ? 1200 : screenWidth;

// Travel data
const TRAVEL_DATA = {
  'Maldives': {
    bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    monthlyData: {
      'January': { temp: '82-88°F', rainfall: 'Low', crowd: 'High', rating: 'Excellent' },
      'February': { temp: '82-88°F', rainfall: 'Low', crowd: 'High', rating: 'Excellent' },
      'March': { temp: '82-89°F', rainfall: 'Low', crowd: 'Medium', rating: 'Excellent' },
      'April': { temp: '83-90°F', rainfall: 'Low', crowd: 'Low', rating: 'Good' },
      'May': { temp: '83-88°F', rainfall: 'High', crowd: 'Low', rating: 'Fair' },
      'November': { temp: '82-86°F', rainfall: 'Medium', crowd: 'Medium', rating: 'Good' },
      'December': { temp: '82-86°F', rainfall: 'Low', crowd: 'High', rating: 'Excellent' },
    }
  },
  'Japan': {
    bestMonths: ['March', 'April', 'May', 'October', 'November'],
    monthlyData: {
      'March': { temp: '46-55°F', rainfall: 'Medium', crowd: 'High', rating: 'Excellent' },
      'April': { temp: '52-63°F', rainfall: 'Medium', crowd: 'Very High', rating: 'Excellent' },
      'May': { temp: '61-72°F', rainfall: 'Medium', crowd: 'Medium', rating: 'Good' },
      'October': { temp: '59-68°F', rainfall: 'Low', crowd: 'Medium', rating: 'Excellent' },
      'November': { temp: '50-59°F', rainfall: 'Low', crowd: 'Medium', rating: 'Excellent' },
    }
  },
  'Iceland': {
    bestMonths: ['June', 'July', 'August'],
    monthlyData: {
      'June': { temp: '45-54°F', rainfall: 'Low', crowd: 'High', rating: 'Excellent' },
      'July': { temp: '48-57°F', rainfall: 'Low', crowd: 'Very High', rating: 'Excellent' },
      'August': { temp: '46-55°F', rainfall: 'Medium', crowd: 'High', rating: 'Good' },
    }
  },
  'Thailand': {
    bestMonths: ['November', 'December', 'January', 'February'],
    monthlyData: {
      'November': { temp: '75-88°F', rainfall: 'Low', crowd: 'Medium', rating: 'Excellent' },
      'December': { temp: '72-88°F', rainfall: 'Very Low', crowd: 'High', rating: 'Excellent' },
      'January': { temp: '70-89°F', rainfall: 'Very Low', crowd: 'High', rating: 'Excellent' },
      'February': { temp: '73-91°F', rainfall: 'Very Low', crowd: 'High', rating: 'Excellent' },
    }
  },
  'Greece': {
    bestMonths: ['May', 'June', 'September', 'October'],
    monthlyData: {
      'May': { temp: '64-77°F', rainfall: 'Low', crowd: 'Medium', rating: 'Excellent' },
      'June': { temp: '72-84°F', rainfall: 'Very Low', crowd: 'High', rating: 'Excellent' },
      'September': { temp: '70-81°F', rainfall: 'Low', crowd: 'Medium', rating: 'Excellent' },
      'October': { temp: '61-72°F', rainfall: 'Medium', crowd: 'Low', rating: 'Good' },
    }
  }
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleSignOut = async () => {
    setMenuVisible(false);
    await signOut();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    
    // Check if search is a month
    const isMonth = MONTHS.find(m => m.toLowerCase() === searchQuery.toLowerCase());
    
    if (isMonth) {
      // Search by month
      const monthResults = [];
      Object.keys(TRAVEL_DATA).forEach(country => {
        if (TRAVEL_DATA[country].bestMonths.some(m => m.toLowerCase() === isMonth.toLowerCase())) {
          monthResults.push({
            country,
            ...TRAVEL_DATA[country].monthlyData[isMonth]
          });
        }
      });
      
      setResults(monthResults);
      setSearchType('month');
    } else {
      // Search by country
      const country = Object.keys(TRAVEL_DATA).find(c => 
        c.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (country) {
        setResults(TRAVEL_DATA[country]);
        setSearchType('country');
      } else {
        setResults([]);
        setSearchType(null);
      }
    }
    
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults(null);
    setSearchType(null);
    scrollToTop();
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header with User Menu */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>🌍 Travel Weather</Text>
          </View>
          
          <View style={styles.headerRight}>
            {/* Dark Mode Toggle */}
            <TouchableOpacity 
              style={styles.themeToggle}
              onPress={toggleTheme}
            >
              <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            
            {/* User Button */}
            <TouchableOpacity 
              style={styles.userButton}
              onPress={() => setMenuVisible(true)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* User Dropdown Menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarTextLarge}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={styles.dropdownEmail}>{user?.email}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <Text style={styles.dropdownItemIcon}>👤</Text>
              <Text style={styles.dropdownItemText}>My Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Saved');
              }}
            >
              <Text style={styles.dropdownItemIcon}>💾</Text>
              <Text style={styles.dropdownItemText}>Saved Destinations</Text>
            </TouchableOpacity>
            
            <View style={styles.dropdownDivider} />
            
            <TouchableOpacity 
              style={[styles.dropdownItem, styles.dropdownItemDanger]}
              onPress={handleSignOut}
            >
              <Text style={styles.dropdownItemIcon}>🚪</Text>
              <Text style={[styles.dropdownItemText, styles.dropdownItemTextDanger]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        {/* Hero Section - Only show when no search results */}
        {!results && (
          <View style={styles.heroWrapper}>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Find Your Perfect Travel Destination</Text>
              <Text style={styles.heroSubtitle}>
                Discover the best time to visit countries around the world
              </Text>
              
              {/* Integrated Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search country or month..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => setSearchQuery('')}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Search Results */}
        {results && (
          <View style={styles.resultsContainer}>
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={clearSearch}
            >
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
            ) : results.length === 0 && searchType === null ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsTitle}>No data found for "{searchQuery}"</Text>
                <Text style={styles.noResultsText}>
                  Try searching for: Maldives, Japan, Iceland, Thailand, or Greece
                </Text>
              </View>
            ) : searchType === 'month' ? (
              <>
                <Text style={styles.resultsTitle}>
                  Best destinations for {searchQuery}
                </Text>
                {results.map((result, index) => (
                  <View key={index} style={styles.resultCard}>
                    <Text style={styles.resultCountry}>{result.country}</Text>
                    <View style={styles.resultDetails}>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>🌡️ Temperature:</Text>
                        <Text style={styles.resultValue}>{result.temp}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>🌧️ Rainfall:</Text>
                        <Text style={styles.resultValue}>{result.rainfall}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>👥 Crowd Level:</Text>
                        <Text style={styles.resultValue}>{result.crowd}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>⭐ Rating:</Text>
                        <Text style={styles.resultValue}>{result.rating}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.resultsTitle}>{searchQuery}</Text>
                <View style={styles.resultCard}>
                  <Text style={styles.bestMonthsTitle}>Best Months to Visit:</Text>
                  <View style={styles.monthsContainer}>
                    {results.bestMonths.map((month, index) => (
                      <View key={index} style={styles.monthChip}>
                        <Text style={styles.monthText}>{month}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Monthly Details</Text>
                {Object.keys(results.monthlyData).map((month, index) => (
                  <View key={index} style={styles.resultCard}>
                    <Text style={styles.monthTitle}>{month}</Text>
                    <View style={styles.resultDetails}>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>🌡️ Temperature:</Text>
                        <Text style={styles.resultValue}>{results.monthlyData[month].temp}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>🌧️ Rainfall:</Text>
                        <Text style={styles.resultValue}>{results.monthlyData[month].rainfall}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>👥 Crowd Level:</Text>
                        <Text style={styles.resultValue}>{results.monthlyData[month].crowd}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>⭐ Rating:</Text>
                        <Text style={styles.resultValue}>{results.monthlyData[month].rating}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Main Action Cards - Only show when no search results */}
        {!results && (
          <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.card, styles.cardSmall]}
              onPress={() => navigation.navigate('Saved')}
            >
              <Text style={styles.cardIconSmall}>💾</Text>
              <Text style={styles.cardTitleSmall}>My Saved</Text>
              <Text style={styles.cardDescriptionSmall}>
                View destinations
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardSmall]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.cardIconSmall}>👤</Text>
              <Text style={styles.cardTitleSmall}>Profile</Text>
              <Text style={styles.cardDescriptionSmall}>
                Account settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        )}

        {/* Features Section - Only show when no search results */}
        {!results && (
          <View style={styles.features}>
          <Text style={styles.featuresTitle}>What You Can Do</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>📅</Text>
              </View>
              <Text style={styles.featureTitle}>Search by Month</Text>
              <Text style={styles.featureText}>
                Find destinations perfect for any time of year
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🌡️</Text>
              </View>
              <Text style={styles.featureTitle}>Weather Data</Text>
              <Text style={styles.featureText}>
                Temperature, rainfall, and climate info
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>⭐</Text>
              </View>
              <Text style={styles.featureTitle}>Best Times</Text>
              <Text style={styles.featureText}>
                Get ratings for optimal travel periods
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>☁️</Text>
              </View>
              <Text style={styles.featureTitle}>Cloud Sync</Text>
              <Text style={styles.featureText}>
                Access your saved data anywhere
              </Text>
            </View>
          </View>
        </View>
        )}
      </ScrollView>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Animated.View 
          style={[
            styles.scrollTopButton,
            {
              opacity: scrollY.interpolate({
                inputRange: [300, 400],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.scrollTopButtonInner}
            onPress={scrollToTop}
            activeOpacity={0.7}
          >
            <Text style={styles.scrollTopButtonText}>↑</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: theme.isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    maxWidth: maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    maxWidth: 200,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 6,
    flex: 1,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingRight: 20,
  },
  dropdown: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    width: 280,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: theme.isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.15)',
      },
    }),
  },
  dropdownHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarTextLarge: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  dropdownEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  dropdownItemDanger: {
    borderBottomWidth: 0,
  },
  dropdownItemTextDanger: {
    color: theme.colors.danger,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  content: {
    flex: 1,
    ...Platform.select({
      web: {
        height: '100vh',
        overflow: 'auto',
      },
    }),
  },
  heroWrapper: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  hero: {
    maxWidth: maxWidth,
    width: '100%',
    alignSelf: 'center',
    padding: isWeb ? 60 : 40,
    paddingBottom: isWeb ? 60 : 40,
  },
  heroTitle: {
    fontSize: isWeb ? 42 : 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: isWeb ? 52 : 40,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: isWeb ? 18 : 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  searchContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 12,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: theme.isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
      },
    }),
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    outlineStyle: 'none',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isWeb ? 120 : undefined,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    padding: 20,
    maxWidth: maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: theme.isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
      },
    }),
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cardSmall: {
    flex: 1,
    padding: 20,
  },
  cardIconSmall: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: theme.colors.text,
  },
  cardDescriptionSmall: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  features: {
    padding: 20,
    paddingTop: 0,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.text,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  feature: {
    width: Platform.OS === 'web' ? 'calc(50% - 8px)' : '48%',
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.isDark ? 0.2 : 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: theme.isDark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.05)',
      },
    }),
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: theme.colors.text,
  },
  featureText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  resultsContainer: {
    padding: 20,
    maxWidth: maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  resultCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultCountry: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  resultDetails: {
    gap: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  resultValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  bestMonthsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthChip: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  monthText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: isWeb ? 30 : 80,
    right: 20,
    zIndex: 1000,
  },
  scrollTopButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      },
    }),
  },
  scrollTopButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});
