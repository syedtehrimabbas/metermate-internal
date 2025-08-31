import {StyleSheet} from 'react-native';
import colors from '../../../theme/colors';
import {AppFonts} from '../../../fonts';
import {getScaledHeight, scaledFontWidth} from '../../../utils/AppUtils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
    padding: 16,
  },
  searchHistory: {
    fontSize: scaledFontWidth(28),
    letterSpacing: -0.6,
    lineHeight: 34,
    fontWeight: '500',
    fontFamily: AppFonts.inter_regular,
    color: colors.textColor,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    width: '70%',
  },
  filterText: {
    fontFamily: AppFonts.general_regular,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: scaledFontWidth(12),
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(233, 233, 233, 0.3)',
    height: getScaledHeight(40),
    minWidth: scaledFontWidth(70),
    justifyContent: 'center',
  },
  activeFilter: {
    fontFamily: AppFonts.inter_regular,
    backgroundColor: colors.accentColor,
    borderRadius: 100,
    color: colors.textColor,
  },
  dateText: {
    fontFamily: AppFonts.inter_regular,
    fontSize: scaledFontWidth(16),
    color: colors.textColor,
    marginVertical: 8,
  },
  resultItem: {
    borderRadius: 16,
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    height: 56,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  zipcodeText: {
    fontFamily: AppFonts.general_regular,
    fontSize: scaledFontWidth(14),
    color: 'rgba(0, 0, 0, 0.7)',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 2,
    marginBottom: 12,
    color: colors.textColor,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 30,
    fontSize: scaledFontWidth(15),
  },
  resultText: {
    color: '#000000',
    fontFamily: AppFonts.inter_regular,
  },
});
