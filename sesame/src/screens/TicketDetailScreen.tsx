import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, BackHandler } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import * as Brightness from 'expo-brightness';
import type { Ticket } from '@/types';
import { getTypeMeta } from '@/data/typeMeta';
import { Colors, FontFamily, Spacing, Radius } from '@/theme';
import { formatDay, formatMonth, formatFull, urgencyBadge } from '@/utils/dateHelpers';
import { Badge } from '@/components/Badge';
import { TypeIcon } from '@/components/TypeIcon';
import { QRCodeView } from '@/components/QRCodeView';

interface TicketDetailScreenProps {
  ticket: Ticket;
  onClose: () => void;
  lang?: 'fr' | 'en';
}

export function TicketDetailScreen({ ticket, onClose, lang = 'fr' }: TicketDetailScreenProps) {
  const m = getTypeMeta(ticket.type);
  const badge = urgencyBadge(ticket.date, ticket.isUsed);
  const translateY = useSharedValue(0);
  const venueShort = ticket.venue.split('\u00b7')[0].trim();

  const dismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true;
    });
    Brightness.setBrightnessAsync(1.0);
    return () => {
      sub.remove();
      Brightness.restoreBrightnessAsync();
    };
  }, [dismiss]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 80) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Pressable style={styles.overlay} onPress={dismiss}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Color card */}
            <View style={[styles.colorCard, { backgroundColor: m.bg }]}>
              <View style={styles.typeRow}>
                <TypeIcon type={ticket.type} size={16} color={m.color} />
                <Text style={[FontFamily.semi, styles.typeLabel, { color: m.color }]}>
                  {lang === 'fr' ? m.labelFr : m.label}
                </Text>
                {badge ? <View style={{ marginLeft: 'auto' }}><Badge text={badge.text} color={badge.color} bg={badge.bg} /></View> : null}
              </View>
              <Text style={[FontFamily.title, { fontSize: 24, color: Colors.text1, letterSpacing: -0.5, lineHeight: 27, marginBottom: 4 }]}>
                {ticket.title}
              </Text>
              <Text style={[FontFamily.medium, { fontSize: 13, color: m.color, marginBottom: 14 }]}>
                {ticket.subtitle}
              </Text>

              <View style={styles.infoStrip}>
                <View style={styles.infoChip}>
                  <Text style={[FontFamily.semi, styles.infoLabel]}>{lang === 'fr' ? 'Date' : 'Date'}</Text>
                  <Text style={[FontFamily.title, { fontSize: 15, color: Colors.text1 }]}>{formatDay(ticket.date)} {formatMonth(ticket.date, lang)}</Text>
                </View>
                <View style={styles.infoChip}>
                  <Text style={[FontFamily.semi, styles.infoLabel]}>{lang === 'fr' ? 'Heure' : 'Time'}</Text>
                  <Text style={[FontFamily.title, { fontSize: 15, color: Colors.text1 }]}>{ticket.time}</Text>
                </View>
                {ticket.gate ? (
                  <View style={styles.infoChip}>
                    <Text style={[FontFamily.semi, styles.infoLabel]}>{lang === 'fr' ? 'Porte' : 'Gate'}</Text>
                    <Text style={[FontFamily.title, { fontSize: 15, color: Colors.text1 }]}>{ticket.gate}</Text>
                  </View>
                ) : null}
                {ticket.seat ? (
                  <View style={styles.infoChip}>
                    <Text style={[FontFamily.semi, styles.infoLabel]}>{lang === 'fr' ? 'Si\u00e8ge' : 'Seat'}</Text>
                    <Text style={[FontFamily.title, { fontSize: 15, color: Colors.text1 }]}>{ticket.seat}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* QR Code */}
            <View style={styles.qrCard}>
              <View style={[styles.dash, { borderColor: Colors.border }]} />
              <QRCodeView value={`sesame://ticket/${ticket.reference}`} size={196} />
              <Text style={[FontFamily.mono5, { fontSize: 13, letterSpacing: 0.8, color: Colors.text1, marginTop: 12 }]}>
                {ticket.reference}
              </Text>
              <View style={[styles.dash, { borderColor: Colors.border, marginTop: 12 }]} />
            </View>

            {/* Details */}
            <View style={styles.detailsCard}>
              <DetailRow label={lang === 'fr' ? 'Date compl\u00e8te' : 'Full date'} value={formatFull(ticket.date, lang)} />
              <View style={styles.divider} />
              <DetailRow label={lang === 'fr' ? 'Lieu' : 'Venue'} value={ticket.venue} />
              {ticket.seat ? (
                <>
                  <View style={styles.divider} />
                  <DetailRow label={lang === 'fr' ? 'Si\u00e8ge' : 'Seat'} value={ticket.seat} />
                </>
              ) : null}
              {ticket.gate ? (
                <>
                  <View style={styles.divider} />
                  <DetailRow label={lang === 'fr' ? 'Porte' : 'Gate'} value={ticket.gate} />
                </>
              ) : null}
              <View style={styles.divider} />
              <DetailRow label="Ref." value={ticket.reference} mono />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <ActionBtn icon="sun" label={lang === 'fr' ? 'Luminosit\u00e9 max' : 'Max brightness'} />
              <ActionBtn icon="share" label={lang === 'fr' ? 'Partager' : 'Share'} />
            </View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </Pressable>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[FontFamily.body, { fontSize: 13, color: Colors.text2 }]}>{label}</Text>
      <Text style={[mono ? FontFamily.mono5 : FontFamily.semi, { fontSize: mono ? 12 : 13, color: Colors.text1, textAlign: 'right' }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ActionBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}>
      <Text style={{ fontSize: 15 }}>{icon === 'sun' ? '\u2600\ufe0f' : '\u2191'}</Text>
      <Text style={[FontFamily.medium, { fontSize: 13, color: Colors.text1, marginLeft: 7 }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(26,25,22,0.28)',
    zIndex: 50,
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    zIndex: 60,
    maxHeight: '91%',
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  colorCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },
  typeLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  infoStrip: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 12,
    padding: 11,
    gap: 20,
    flexWrap: 'wrap' as const,
    flexDirection: 'row',
  },
  infoChip: {},
  infoLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: Colors.text2,
    marginBottom: 3,
  },
  qrCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
    alignItems: 'center',
  },
  dash: {
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  detailsCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: 12,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
});
