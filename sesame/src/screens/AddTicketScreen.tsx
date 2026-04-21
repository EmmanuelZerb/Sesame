import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { Ticket, TicketType } from '@/types';
import { TYPE_META } from '@/data/typeMeta';
import { Colors, FontFamily, Spacing, Radius } from '@/theme';
import { inferType } from '@/utils/dateHelpers';
import { scanTicketWithAI } from '@/utils/scanTicket';
import { Badge } from '@/components/Badge';
import { TypeIcon } from '@/components/TypeIcon';
import { CardLarge } from '@/components/CardLarge';
import { CardCompact } from '@/components/CardCompact';

interface AddTicketScreenProps {
  onClose: () => void;
  onAdd: (ticket: Ticket) => void;
  lang?: 'fr' | 'en';
}

const STEPS = 5;

export function AddTicketScreen({ onClose, onAdd, lang = 'fr' }: AddTicketScreenProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<TicketType>('flight');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:00');
  const [venue, setVenue] = useState('');
  const [seat, setSeat] = useState('');
  const [gate, setGate] = useState('');
  const [reference, setReference] = useState('');
  const [scanning, setScanning] = useState(false);

  const onBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
    else onClose();
  }, [step, onClose]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  useEffect(() => {
    const d = new Date(Date.now() + 7 * 86400000);
    setDate(d.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    const t = inferType(title);
    if (t) setType(t);
  }, [title]);

  const preview: Ticket = {
    id: '_p',
    type,
    title: title || (lang === 'fr' ? "Nom de l'\u00e9v\u00e9nement" : 'Event name'),
    subtitle: subtitle || 'Subtitle',
    date: date || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    time,
    venue: venue || 'Lieu',
    seat,
    gate,
    reference: reference || 'REF-0000',
    isUsed: false,
    addedAt: new Date().toISOString(),
  };

  const canNext = step === 2 ? title.length > 0 : step === 3 ? date.length > 0 : true;
  const next = () => { if (step < STEPS) setStep((s) => s + 1); };
  const confirm = () => {
    onAdd({
      ...preview,
      id: 't' + Math.random().toString(36).slice(2, 9),
      reference: reference || 'SES-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    });
  };

  const handleScan = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets[0]?.base64) return;

      setScanning(true);
      const asset = result.assets[0];
      const data = await scanTicketWithAI(asset.base64, asset.mimeType || 'image/jpeg');

      if (data.type) setType(data.type);
      if (data.title) setTitle(data.title);
      if (data.subtitle) setSubtitle(data.subtitle);
      if (data.date) setDate(data.date);
      if (data.time) setTime(data.time);
      if (data.venue) setVenue(data.venue);
      if (data.seat) setSeat(data.seat);
      if (data.gate) setGate(data.gate);
      if (data.reference) setReference(data.reference);
      setStep(5);
    } catch (err) {
      Alert.alert(
        lang === 'fr' ? 'Erreur' : 'Error',
        lang === 'fr' ? 'Analyse impossible. R\u00e9essayez ou saisissez manuellement.' : 'Scan failed. Try again or enter manually.',
      );
    } finally {
      setScanning(false);
    }
  };

  const L = {
    fr: {
      next: 'Suivant', confirm: 'Ajouter \u00e0 Sesame', type: 'Type de billet',
      event: "Nom de l'\u00e9v\u00e9nement", sub: 'Sous-titre (optionnel)',
      details: 'Informations compl\u00e9mentaires', preview: 'Aper\u00e7u',
      venue: 'Lieu', seat: 'Si\u00e8ge (optionnel)', gate: 'Porte (optionnel)',
      ref: 'R\u00e9f\u00e9rence (optionnel)',
      scanning: 'Analyse en cours\u2026', scan: 'Scanner mon billet',
      newTicket: 'Nouveau billet',
    },
    en: {
      next: 'Next', confirm: 'Add to Sesame', type: 'Ticket type',
      event: 'Event name', sub: 'Subtitle (optional)',
      details: 'Additional details', preview: 'Preview',
      venue: 'Venue', seat: 'Seat (optional)', gate: 'Gate (optional)',
      ref: 'Reference (optional)',
      scanning: 'Scanning\u2026', scan: 'Scan my ticket',
      newTicket: 'New ticket',
    },
  }[lang];

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {step > 1 && (
              <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
                <ChevLeftIcon />
              </Pressable>
            )}
            <Text style={[FontFamily.title, { fontSize: 18, color: Colors.text1 }]}>
              {L.newTicket}
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <XIcon />
          </Pressable>
        </View>

        {/* Progress dots */}
        <View style={styles.dots}>
          {Array.from({ length: STEPS }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: step === i + 1 ? 20 : 6,
                  backgroundColor: step <= i + 1 ? Colors.text1 : Colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Step content */}
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && <StepType type={type} setType={setType} lang={lang} scanning={scanning} onScan={handleScan} L={L} />}
          {step === 2 && <StepEvent title={title} setTitle={setTitle} subtitle={subtitle} setSubtitle={setSubtitle} preview={preview} lang={lang} L={L} />}
          {step === 3 && <StepDate date={date} setDate={setDate} time={time} setTime={setTime} lang={lang} />}
          {step === 4 && <StepDetails type={type} venue={venue} setVenue={setVenue} seat={seat} setSeat={setSeat} gate={gate} setGate={setGate} reference={reference} setReference={setReference} lang={lang} L={L} />}
          {step === 5 && <StepPreview ticket={preview} lang={lang} L={L} />}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* CTA */}
        <View style={styles.cta}>
          <Pressable
            onPress={step === STEPS ? confirm : next}
            disabled={!canNext}
            style={({ pressed }) => [
              styles.ctaBtn,
              {
                backgroundColor: canNext ? Colors.text1 : Colors.bgSubtle,
                opacity: pressed && canNext ? 0.8 : 1,
              },
            ]}
          >
            {step === STEPS ? (
              <CheckIcon />
            ) : (
              <ChevRightIcon />
            )}
            <Text style={[FontFamily.semi, { fontSize: 15, color: canNext ? '#fff' : Colors.text3, marginLeft: 8 }]}>
              {step === STEPS ? L.confirm : L.next}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ── Step components ──────────────────────── */

function StepType({ type, setType, lang, scanning, onScan, L }: {
  type: TicketType; setType: (t: TicketType) => void; lang: 'fr' | 'en'; scanning: boolean; onScan: () => void; L: Record<string, string>;
}) {
  return (
    <View>
      <Text style={[FontFamily.medium, { fontSize: 13, color: Colors.text2, marginBottom: 14 }]}>{L.type}</Text>
      <View style={styles.typeGrid}>
        {(Object.keys(TYPE_META) as TicketType[]).map((k) => {
          const m = TYPE_META[k];
          const active = type === k;
          return (
            <Pressable
              key={k}
              onPress={() => setType(k)}
              style={[
                styles.typeButton,
                {
                  borderColor: active ? Colors.text1 : Colors.border,
                  backgroundColor: active ? m.bg : Colors.bgCard,
                },
              ]}
            >
              <TypeIcon type={k} size={19} color={active ? m.color : Colors.text3} />
              <Text style={[active ? FontFamily.semi : FontFamily.body, { fontSize: 11, color: active ? Colors.text1 : Colors.text2 }]}>
                {lang === 'fr' ? m.labelFr : m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onScan}
        disabled={scanning}
        style={({ pressed }) => [
          styles.scanBtn,
          pressed && !scanning && { opacity: 0.7 },
        ]}
      >
        <Text style={{ fontSize: 18 }}>{'\ud83d\uddbc\ufe0f'}</Text>
        <Text style={[FontFamily.semi, { fontSize: 14, color: scanning ? Colors.text3 : Colors.text1, marginLeft: 8 }]}>
          {scanning ? L.scanning : L.scan}
        </Text>
      </Pressable>
    </View>
  );
}

function StepEvent({ title, setTitle, subtitle, setSubtitle, preview, lang, L }: {
  title: string; setTitle: (v: string) => void; subtitle: string; setSubtitle: (v: string) => void; preview: Ticket; lang: 'fr' | 'en'; L: Record<string, string>;
}) {
  return (
    <View>
      <FieldGroup label={L.event}>
        <StyledInput value={title} onChange={setTitle} placeholder={lang === 'fr' ? 'ex. Paris \u2192 Tokyo' : 'e.g. Paris \u2192 Tokyo'} large />
      </FieldGroup>
      <FieldGroup label={L.sub}>
        <StyledInput value={subtitle} onChange={setSubtitle} placeholder={lang === 'fr' ? 'Compagnie, artiste\u2026' : 'Company, artist\u2026'} />
      </FieldGroup>
      {title ? (
        <View style={{ marginTop: 14 }}>
          <CardCompact ticket={preview} onPress={() => {}} lang={lang} />
        </View>
      ) : null}
    </View>
  );
}

function StepDate({ date, setDate, time, setTime, lang }: {
  date: string; setDate: (v: string) => void; time: string; setTime: (v: string) => void; lang: 'fr' | 'en';
}) {
  return (
    <View style={styles.dateRow}>
      <FieldGroup label={lang === 'fr' ? 'Date' : 'Date'} style={{ flex: 3 }}>
        <StyledInput value={date} onChange={setDate} placeholder="YYYY-MM-DD" />
      </FieldGroup>
      <FieldGroup label={lang === 'fr' ? 'Heure' : 'Time'} style={{ flex: 2 }}>
        <StyledInput value={time} onChange={setTime} placeholder="HH:MM" />
      </FieldGroup>
    </View>
  );
}

function StepDetails({ type, venue, setVenue, seat, setSeat, gate, setGate, reference, setReference, lang, L }: {
  type: TicketType; venue: string; setVenue: (v: string) => void; seat: string; setSeat: (v: string) => void; gate: string; setGate: (v: string) => void; reference: string; setReference: (v: string) => void; lang: 'fr' | 'en'; L: Record<string, string>;
}) {
  return (
    <View>
      <FieldGroup label={L.venue}>
        <StyledInput value={venue} onChange={setVenue} placeholder={lang === 'fr' ? 'Salle, gare, stade\u2026' : 'Venue, station\u2026'} />
      </FieldGroup>
      <FieldGroup label={L.seat}>
        <StyledInput value={seat} onChange={setSeat} placeholder={lang === 'fr' ? 'Rang, place\u2026' : 'Row, seat\u2026'} />
      </FieldGroup>
      {type === 'flight' && (
        <FieldGroup label={L.gate}>
          <StyledInput value={gate} onChange={setGate} placeholder="ex. K42" />
        </FieldGroup>
      )}
      <FieldGroup label={L.ref}>
        <StyledInput value={reference} onChange={setReference} placeholder={lang === 'fr' ? 'Laissez vide pour auto' : 'Auto if empty'} mono />
      </FieldGroup>
    </View>
  );
}

function StepPreview({ ticket, lang, L }: { ticket: Ticket; lang: 'fr' | 'en'; L: Record<string, string> }) {
  return (
    <View>
      <Text style={[FontFamily.medium, { fontSize: 13, color: Colors.text2, marginBottom: 14 }]}>{L.preview}</Text>
      <CardLarge ticket={ticket} onPress={() => {}} lang={lang} />
    </View>
  );
}

/* ── Shared helpers ───────────────────────── */

function FieldGroup({ label, children, style }: { label: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.fieldGroup, style]}>
      <Text style={[FontFamily.semi, styles.fieldLabel]}>{label}</Text>
      {children}
    </View>
  );
}

function StyledInput({ value, onChange, placeholder, large, mono }: {
  value: string; onChange: (v: string) => void; placeholder?: string; large?: boolean; mono?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={Colors.text3}
      style={[
        styles.textInput,
        mono ? FontFamily.mono : large ? FontFamily.title : FontFamily.body,
        { fontSize: large ? 17 : 14 },
      ]}
      onFocus={(e) => e.currentTarget.setNativeProps({ style: { borderColor: Colors.text1 } })}
      onBlur={(e) => e.currentTarget.setNativeProps({ style: { borderColor: Colors.border } })}
    />
  );
}

/* ── Mini SVG icons ───────────────────────── */

function ChevLeftIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="m15 6-6 6 6 6" stroke={Colors.text2} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevRightIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6 6 18M6 6l12 12" stroke={Colors.text2} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(26,25,22,0.28)',
    zIndex: 70,
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    zIndex: 80,
    maxHeight: '91%',
    paddingTop: 10,
  },
  handleRow: { alignItems: 'center' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { padding: 4 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgSubtle,
    alignItems: 'center', justifyContent: 'center',
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 10 },
  dot: { height: 5, borderRadius: 3 },
  body: { flex: 1, paddingHorizontal: 22 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 16 },
  typeButton: {
    width: '31%', alignItems: 'center', gap: 5,
    paddingVertical: 13, paddingHorizontal: 8,
    borderRadius: 14, borderWidth: 1.5,
  },
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', paddingVertical: 13, marginTop: 8,
    borderRadius: Radius.input, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  fieldGroup: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: 10, letterSpacing: 0.9, textTransform: 'uppercase' as const, color: Colors.text2, marginBottom: 6 },
  textInput: {
    width: '100%', paddingHorizontal: 13, paddingVertical: 11,
    borderRadius: Radius.input, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.bgCard, color: Colors.text1,
  },
  dateRow: { flexDirection: 'row', gap: 10 },
  cta: {
    paddingHorizontal: 22, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', paddingVertical: 14, borderRadius: Radius.input,
  },
});
