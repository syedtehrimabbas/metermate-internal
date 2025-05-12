import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getScaledHeight, scaledFontWidth } from '../../../utils/AppUtils';
import { hp } from '../../../utils/Dimension';
import { AppImages } from '../../../images';
import colors from '../../../theme/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

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

const ProviderDetailsScreen = ({ route, navigation }) => {
  const [provider_name, set_provider_name] = useState('');
  const [provider_type, set_provider_type] = useState('');
  const [avg_electric_rate, set_avg_electric_rate] = useState(0);
  const [offers_net_metering, set_offers_net_metering] = useState('');
  const [provider, set_provider] = useState();
  useEffect(() => {
    const provider = route.params?.provider;
    set_provider(provider);
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
      <View style={{ flexDirection: 'row', flex: 2, marginTop: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.providerAbout}>{'Average Electric Rate:'}</Text>
          <Text style={[styles.providerName, { marginTop: 10 }]}>
            {avg_electric_rate}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.providerAbout}>{'Offers Net Metering:'}</Text>
          <Text style={[styles.providerName, { marginTop: 10 }]}>
            {offers_net_metering}
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

  const EnergyRateDetails = () => {
    const [activeTab, setActiveTab] = useState('Simple');
    const [expanded, setExpanded] = useState(false);

    const tabOptions = ['Simple', 'Moderate', 'The Facts', 'Advanced'];

    const tabContent = {
      Simple: provider?.energy_rates_simple || '',
      Moderate: provider?.energy_rates_moderate || '',
      'The Facts': provider?.energy_rates_facts || '',
      Advanced: provider?.energy_rates_advanced || '',
    };

    // ✨ Utility: Parse `**bold**` text into parts
    const parseBoldText = (text) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g); // split by **bold**
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={styles.bold}>
              {part.slice(2, -2)}
            </Text>
          );
        } else {
          return <Text key={index}>{part}</Text>;
        }
      });
    };

    return (
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Energy Rate Details</Text>
          <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
            {expanded ? <FontAwesomeIcon icon={faChevronUp} size={20} color="#000" /> : <FontAwesomeIcon icon={faChevronDown} size={20} color="#000" />}
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {tabOptions.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.description}
          numberOfLines={expanded ? undefined : 2}>
          {parseBoldText(tabContent[activeTab])}
        </Text>

      </View>
    );
  };

  const NetMeteringDetails = () => {
    const [activeTab, setActiveTab] = useState('Simple');
    const [expanded, setExpanded] = useState(false);

    const tabOptions = ['Simple', 'Moderate', 'The Facts', 'Advanced'];

    const tabContent = {
      Simple: provider?.net_metering_simple || '',
      Moderate: provider?.net_metering_moderate || '',
      'The Facts': provider?.net_metering_facts || '',
      Advanced: provider?.net_metering_advanced || '',
    };

    // ✨ Utility: Parse `**bold**` text into parts
    const parseBoldText = (text) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g); // split by **bold**
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={index} style={styles.bold}>
              {part.slice(2, -2)}
            </Text>
          );
        } else {
          return <Text key={index}>{part}</Text>;
        }
      });
    };

    return (
      <View style={styles.section}>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Net Metering Program Details</Text>
          <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
            {expanded ? <FontAwesomeIcon icon={faChevronUp} size={20} color="#000" /> : <FontAwesomeIcon icon={faChevronDown} size={20} color="#000" />}
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {tabOptions.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.description}
          numberOfLines={expanded ? undefined : 2}>
          {parseBoldText(tabContent[activeTab])}
        </Text>

      </View>
    );
  };


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

      {/* Energy Rate Details */}
      {EnergyRateDetails()}

      {/* Net Metering Program Details */}
      {NetMeteringDetails()}

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
    shadowOffset: { width: 0, height: 2 },
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
  bold: {
    fontWeight: 'bold',
    // color: '#000', // optional: adjust as needed
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    // backgroundColor: '#4CAF50',
    backgroundColor: colors.accentColor,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  toggleText: {
    color: '#007bff',
    marginTop: 6,
    fontWeight: '500',
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
