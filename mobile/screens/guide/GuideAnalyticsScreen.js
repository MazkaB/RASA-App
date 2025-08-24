import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function GuideAnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' }
  ];

  const analytics = {
    earnings: {
      total: 15750000,
      growth: 12.5,
      trend: 'up'
    },
    bookings: {
      total: 47,
      growth: 8.3,
      trend: 'up'
    },
    rating: {
      average: 4.8,
      growth: 0.2,
      trend: 'up'
    },
    responseRate: {
      percentage: 95,
      growth: -2.1,
      trend: 'down'
    }
  };

  const chartData = [
    { month: 'Jul', earnings: 8500000, bookings: 15 },
    { month: 'Aug', earnings: 12200000, bookings: 28 },
    { month: 'Sep', earnings: 9800000, bookings: 22 },
    { month: 'Oct', earnings: 14500000, bookings: 35 },
    { month: 'Nov', earnings: 11200000, bookings: 26 },
    { month: 'Dec', earnings: 15750000, bookings: 42 }
  ];

  const topDestinations = [
    { name: 'Borobudur Temple', tours: 18, percentage: 38 },
    { name: 'Prambanan Temple', tours: 12, percentage: 26 },
    { name: 'Yogyakarta City Tour', tours: 8, percentage: 17 },
    { name: 'Malioboro Street', tours: 5, percentage: 11 },
    { name: 'Sultan Palace', tours: 4, percentage: 8 }
  ];

  const formatCurrency = (amount) => {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  };

  const renderTrendIcon = (trend) => {
    return (
      <Ionicons
        name={trend === 'up' ? 'trending-up' : 'trending-down'}
        size={16}
        color={trend === 'up' ? '#4CAF50' : '#F44336'}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.key && styles.activePeriodText
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Earnings</Text>
              {renderTrendIcon(analytics.earnings.trend)}
            </View>
            <Text style={styles.metricValue}>{formatCurrency(analytics.earnings.total)}</Text>
            <Text style={[
              styles.metricGrowth,
              analytics.earnings.trend === 'up' ? styles.positiveGrowth : styles.negativeGrowth
            ]}>
              {analytics.earnings.growth > 0 ? '+' : ''}{analytics.earnings.growth}% this month
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Bookings</Text>
              {renderTrendIcon(analytics.bookings.trend)}
            </View>
            <Text style={styles.metricValue}>{analytics.bookings.total}</Text>
            <Text style={[
              styles.metricGrowth,
              analytics.bookings.trend === 'up' ? styles.positiveGrowth : styles.negativeGrowth
            ]}>
              {analytics.bookings.growth > 0 ? '+' : ''}{analytics.bookings.growth}% this month
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Average Rating</Text>
              {renderTrendIcon(analytics.rating.trend)}
            </View>
            <Text style={styles.metricValue}>{analytics.rating.average}</Text>
            <Text style={[
              styles.metricGrowth,
              analytics.rating.trend === 'up' ? styles.positiveGrowth : styles.negativeGrowth
            ]}>
              {analytics.rating.growth > 0 ? '+' : ''}{analytics.rating.growth} this month
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Response Rate</Text>
              {renderTrendIcon(analytics.responseRate.trend)}
            </View>
            <Text style={styles.metricValue}>{analytics.responseRate.percentage}%</Text>
            <Text style={[
              styles.metricGrowth,
              analytics.responseRate.trend === 'up' ? styles.positiveGrowth : styles.negativeGrowth
            ]}>
              {analytics.responseRate.growth > 0 ? '+' : ''}{analytics.responseRate.growth}% this month
            </Text>
          </View>
        </View>

        {/* Earnings Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartAxis}>
              {chartData.map((data, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={['#4CAF50', '#2E7D32']}
                      style={[
                        styles.chartBar,
                        { height: (data.earnings / 20000000) * 120 }
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.month}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Top Destinations */}
        <View style={styles.destinationsSection}>
          <Text style={styles.sectionTitle}>Top Destinations</Text>
          {topDestinations.map((destination, index) => (
            <View key={index} style={styles.destinationItem}>
              <View style={styles.destinationRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationStats}>
                  {destination.tours} tours • {destination.percentage}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progress,
                    { width: `${destination.percentage}%` }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Performance Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Season Ahead</Text>
              <Text style={styles.insightText}>
                January typically sees 40% more bookings. Consider updating your availability.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="star" size={24} color="#FFD700" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Excellent Reviews</Text>
              <Text style={styles.insightText}>
                Your 4.8 rating is above average. Keep up the great work!
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="time" size={24} color="#FF6B35" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Response Time</Text>
              <Text style={styles.insightText}>
                Consider improving response time to increase booking rates.
              </Text>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Monthly Goals</Text>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Earnings Target</Text>
              <Text style={styles.goalProgress}>78%</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: '78%' }]} />
            </View>
            <Text style={styles.goalText}>Rp 15.7M of Rp 20M</Text>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>Tours Target</Text>
              <Text style={styles.goalProgress}>94%</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: '94%' }]} />
            </View>
            <Text style={styles.goalText}>47 of 50 tours</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activePeriodButton: {
    backgroundColor: '#2E7D32',
  },
  periodText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4,
  },
  metricGrowth: {
    fontSize: 12,
    fontWeight: '500',
  },
  positiveGrowth: {
    color: '#4CAF50',
  },
  negativeGrowth: {
    color: '#F44336',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  chartAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    width: 20,
  },
  chartBar: {
    width: 20,
    borderRadius: 10,
  },
  chartLabel: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 8,
  },
  destinationsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  destinationRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  destinationInfo: {
    flex: 1,
    marginRight: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  destinationStats: {
    fontSize: 12,
    color: '#5f6368',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#f1f3f4',
    borderRadius: 2,
  },
  progress: {
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  goalsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  goalBar: {
    height: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalFill: {
    height: 8,
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#5f6368',
  },
});