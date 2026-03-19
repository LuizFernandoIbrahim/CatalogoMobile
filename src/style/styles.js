import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';

const { width } = Dimensions.get('window');

export default StyleSheet.create({

  // ── Raiz ─────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ───────────────────────────────────────────────────────
  header: {
    paddingTop: 12,
    paddingBottom: 0,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['2xl'],
    color: '#FFF',
  },
  headerSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── ScrollView ───────────────────────────────────────────────────
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // ── Mapa ─────────────────────────────────────────────────────────
  mapContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  map: {
    width: '100%',
    height: 260,
  },
  mapOverlayPin: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapOverlayText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.xs,
    color: '#FFF',
    letterSpacing: 0.3,
  },

  // ── Card de endereço ──────────────────────────────────────────────
  addressCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  addressIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextBlock: {
    flex: 1,
  },
  addressLabel: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  addressValue: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    lineHeight: typography.sizes.md * 1.4,
  },

  // ── Botão "Como chegar" ───────────────────────────────────────────
  directionsBtn: {
    marginTop: 6,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  directionsBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  directionsBtnText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.md,
    color: '#FFF',
    letterSpacing: 0.3,
  },

  // ── Horários ──────────────────────────────────────────────────────
  hoursCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  hoursTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  statusBadgeOpen:   { backgroundColor: '#E8F5EC' },
  statusBadgeClosed: { backgroundColor: '#FDECEA' },
  statusText: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.xs,
    letterSpacing: 0.3,
  },
  statusTextOpen:   { color: colors.success },
  statusTextClosed: { color: colors.error },

  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hoursRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  hoursDay: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  hoursDayToday: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },
  hoursTime: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  hoursTimeClosed: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },

  // ── Card de contato ───────────────────────────────────────────────
  contactCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactTitle: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactBtnLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  contactBtnIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtnLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  contactBtnValue: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  contactChevron: {
    marginLeft: 'auto',
  },

  // ── Bottom Navigation ─────────────────────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontFamily: typography.fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
  navLabelActive: { color: colors.primary },
});
