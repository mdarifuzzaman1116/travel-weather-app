import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';

// Built-in travel data (same as before)
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

export default function SearchScreen({ navigation, route }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState(null); // 'month' or 'country'

  // Handle initial query from navigation params
  useEffect(() => {
    if (route?.params?.initialQuery) {
      setSearchQuery(route.params.initialQuery);
      performSearch(route.params.initialQuery);
    }
  }, [route?.params?.initialQuery]);

  const performSearch = (query) => {
    if (!query.trim()) return;

    setLoading(true);
    
    // Check if search is a month
    const isMonth = MONTHS.find(m => m.toLowerCase() === query.toLowerCase());
    
    if (isMonth) {
      searchByMonth(isMonth);
    } else {
      searchByCountry(query);
    }
    
    setLoading(false);
  };

  const handleSearch = () => {
    performSearch(searchQuery);
  };

  const searchByMonth = (month) => {
    const matchingCountries = [];
    
    Object.keys(TRAVEL_DATA).forEach(country => {
      const data = TRAVEL_DATA[country];
      if (data.monthlyData[month]) {
        const info = data.monthlyData[month];
        if (info.rating === 'Excellent' || info.rating === 'Good') {
          matchingCountries.push({
            country,
            ...info
          });
        }
      }
    });

    setSearchType('month');
    setResults({
      month,
      countries: matchingCountries
    });
  };

  const searchByCountry = (countryName) => {
    const country = Object.keys(TRAVEL_DATA).find(
      c => c.toLowerCase() === countryName.toLowerCase()
    );

    if (country) {
      setSearchType('country');
      setResults({
        country,
        data: TRAVEL_DATA[country]
      });
    } else {
      setSearchType('notfound');
      setResults({ query: countryName });
    }
  };

  const saveDestination = async (country, month, temp) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('destinations')
        .insert({
          user_id: user.id,
          country,
          month,
          temperature: temp,
        });

      if (error) throw error;
      alert(`✅ ${country} saved for ${month}!`);
    } catch (error) {
      alert('Error saving destination: ' + error.message);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Destinations</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchBox}>
          <Text style={styles.title}>Where do you want to go?</Text>
          <TextInput
            style={styles.input}
            placeholder="Type a country or month (e.g., Japan, March)"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}

      {searchType === 'month' && results && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>
            🌟 Best Destinations for {results.month}
          </Text>
          {results.countries.map((dest, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{dest.country}</Text>
              <Text style={styles.cardDetail}>🌡️ Temperature: {dest.temp}</Text>
              <Text style={styles.cardDetail}>☔ Rainfall: {dest.rainfall}</Text>
              <Text style={styles.cardDetail}>👥 Crowds: {dest.crowd}</Text>
              <View style={[styles.badge, styles[`badge${dest.rating}`]]}>
                <Text style={styles.badgeText}>{dest.rating}</Text>
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => saveDestination(dest.country, results.month, dest.temp)}
              >
                <Text style={styles.saveButtonText}>💾 Save</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {searchType === 'country' && results && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>
            Travel Information: {results.country}
          </Text>
          {results.data.bestMonths && (
            <View style={styles.bestMonths}>
              <Text style={styles.bestMonthsText}>
                🌟 Best Months: {results.data.bestMonths.join(', ')}
              </Text>
            </View>
          )}
          {MONTHS.map(month => {
            const info = results.data.monthlyData[month];
            if (!info) return null;
            return (
              <View key={month} style={styles.monthRow}>
                <Text style={styles.monthName}>{month}</Text>
                <Text style={styles.monthDetail}>{info.temp}</Text>
                <View style={[styles.badge, styles[`badge${info.rating}`]]}>
                  <Text style={styles.badgeText}>{info.rating}</Text>
                </View>
                <TouchableOpacity
                  style={styles.saveButtonSmall}
                  onPress={() => saveDestination(results.country, month, info.temp)}
                >
                  <Text style={styles.saveButtonText}>💾</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {searchType === 'notfound' && (
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>No data found for "{results.query}"</Text>
          <Text style={styles.notFoundText}>Try searching for: Maldives, Japan, Iceland, Thailand, or Greece</Text>
        </View>
      )}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.headerBg,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  searchBox: {
    backgroundColor: theme.colors.card,
    padding: 20,
    margin: 15,
    borderRadius: 12,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    padding: 15,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: theme.colors.text,
  },
  cardDetail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  badgeExcellent: {
    backgroundColor: '#10b981',
  },
  badgeGood: {
    backgroundColor: '#3b82f6',
  },
  badgeFair: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonSmall: {
    backgroundColor: '#667eea',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bestMonths: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  bestMonthsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthName: {
    fontWeight: 'bold',
    flex: 1,
  },
  monthDetail: {
    color: '#6b7280',
    flex: 1,
  },
  notFound: {
    padding: 40,
    alignItems: 'center',
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  notFoundText: {
    color: '#6b7280',
    textAlign: 'center',
  },
});
