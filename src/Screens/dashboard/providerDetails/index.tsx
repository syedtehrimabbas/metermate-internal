import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getScaledHeight, scaledFontWidth} from '../../../utils/AppUtils';
import {hp} from '../../../utils/Dimension';
import {AppImages} from '../../../images';

type ProviderDetailsParams = {
  ProviderDetails: {
    provider: {
      id: number;
      name: string;
      aboutShort: string;
      buybackRate: string;
      annualEarnings: string;
      impact: string;
      programAvailability: string;
      logoPath: any;
    };
  };
};

const ProviderDetailsScreen = ({route, navigation}) => {
  const [provider_name, set_provider_name] = useState('');
  const [provider_type, set_provider_type] = useState('');
  const [avg_electric_rate, set_avg_electric_rate] = useState(0);
  const [offers_net_metering, set_offers_net_metering] = useState('');
  useEffect(() => {
    const provider = route.params?.provider;
    set_provider_name(provider.provider_name);
    set_provider_type(provider.provider_type);
    set_avg_electric_rate(provider.avg_electric_rate);
    set_offers_net_metering(provider.offers_net_metering);
  }, [route.params]);
  const renderProvider = () => (
    <View style={styles.providerCard}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <Image style={{ width: 50, height: 50, marginEnd: 15 }} source={AppImages.dummy_company_logo_one} />
        <View>
          <Text style={styles.providerName}>{provider_name}</Text>
          <Text style={styles.providerAbout}>{provider_type}</Text>
        </View>
      </View>
      {/* Row One */}
      <View style={{flexDirection: 'row', flex: 2, marginTop: 10}}>
        <View style={{flex: 1}}>
          <Text style={styles.providerAbout}>{'Average Electric Rate:'}</Text>
          <Text style={[styles.providerName, {marginTop: 10}]}>
            {avg_electric_rate}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.providerAbout}>{'Offers Net Metering:'}</Text>
          <Text style={[styles.providerName, {marginTop: 10}]}>
            {offers_net_metering ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      {/* Row Two */}
      {/*
                <View style={{ flexDirection: 'row', flex: 2, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerAbout}>{'Program Availability:'}</Text>
                        <Text style={[styles.providerName, { marginTop: 10 }]}>{item.programAvailability}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerAbout}>{'Impact on Energy Bills:'}</Text>
                        <Text style={[styles.providerName, { marginTop: 10 }]}>{item.impact}</Text>
                    </View>
                </View> */}
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{
          width: scaledFontWidth(24),
          height: getScaledHeight(24),
          marginBottom: hp(2),
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={AppImages.back_arrow}
          style={{
            width: scaledFontWidth(24),
            height: getScaledHeight(24),
          }}
        />
      </TouchableOpacity>
      {renderProvider()}
      {/* Net Metering Program Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Net Metering Program Details</Text>
        <View style={styles.tabContainer}>
          <View style={[styles.tab, styles.activeTab]}>
            <Text style={styles.tabText}>Simple</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Moderate</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>The Facts</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Advanced</Text>
          </View>
        </View>
        <Text style={styles.description}>
          The Net Metering Program allows customers who generate their own
          electricity using solar panels or other renewable sources to receive
          credits for the excess energy they produce.
        </Text>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits of the Program</Text>
        <View style={styles.benefitsList}>
          <Text style={styles.benefitItem}>
            • Cost Savings: Reduce your monthly electric bill by receiving
            credits for surplus energy
          </Text>
          <Text style={styles.benefitItem}>
            • Environmental Impact: Contribute to a greener planet by using
            renewable energy sources.
          </Text>
          <Text style={styles.benefitItem}>
            • Energy Independence: Generate your own power and gain more control
            over your energy usage.
          </Text>
          <Text style={styles.benefitItem}>
            • Support from Experts: Access to resources and guidance from our
            dedicated energy advisors.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  providerCard: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginEnd: 15,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  providerAbout: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    marginTop: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  tabText: {
    fontSize: 12,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ProviderDetailsScreen;
