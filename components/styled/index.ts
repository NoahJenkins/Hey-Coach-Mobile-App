import styled from 'styled-components/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/Colors';

// Theme type
export interface Theme {
  colors: typeof Colors.light;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
}

// Styled Components

// Primary Button - Large touch target with gradient-like appearance
export const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => props.disabled ? '#94A3B8' : '#2563EB'};
  border-radius: ${BorderRadius.lg}px;
  padding: ${Spacing.md}px ${Spacing.lg}px;
  min-height: 60px;
  justify-content: center;
  align-items: center;
  shadow-color: #2563EB;
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props) => props.disabled ? 0 : 0.3};
  shadow-radius: 8px;
  elevation: ${(props) => props.disabled ? 0 : 8};
`;

export const PrimaryButtonText = styled.Text<{ disabled?: boolean }>`
  color: #FFFFFF;
  font-size: ${Typography.body.fontSize}px;
  font-weight: ${Typography.body.fontWeight};
  text-align: center;
`;

// Secondary Button
export const SecondaryButton = styled.TouchableOpacity`
  background-color: transparent;
  border-radius: ${BorderRadius.lg}px;
  padding: ${Spacing.md}px ${Spacing.lg}px;
  min-height: 60px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #E2E8F0;
`;

export const SecondaryButtonText = styled.Text`
  color: #64748B;
  font-size: ${Typography.body.fontSize}px;
  font-weight: 500;
  text-align: center;
`;

// Voice Recording Button - The centerpiece 200px circular button
export const VoiceButton = styled.TouchableOpacity<{ isRecording?: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: ${(props) => props.isRecording ? '#EF4444' : '#2563EB'};
  justify-content: center;
  align-items: center;
  shadow-color: ${(props) => props.isRecording ? '#EF4444' : '#2563EB'};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

export const VoiceButtonInner = styled.View`
  width: 180px;
  height: 180px;
  border-radius: 90px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border-width: 3px;
  border-color: rgba(255, 255, 255, 0.3);
`;

// Card Components
export const Card = styled.View<{ variant?: 'default' | 'surface' }>`
  background-color: ${(props) => props.variant === 'surface' ? '#F8FAFC' : '#FFFFFF'};
  border-radius: ${BorderRadius.md}px;
  padding: ${Spacing.lg}px;
  shadow-color: #000000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 12px;
  elevation: 2;
  ${(props) => props.variant === 'default' && `
    border-width: 1px;
    border-color: #E2E8F0;
  `}
`;

export const CardHeader = styled.View`
  margin-bottom: ${Spacing.md}px;
`;

export const CardTitle = styled.Text`
  font-size: ${Typography.h3.fontSize}px;
  font-weight: ${Typography.h3.fontWeight};
  color: #0F172A;
  line-height: ${Typography.h3.lineHeight}px;
`;

export const CardContent = styled.View`
  flex: 1;
`;

// Typography Components
export const HeroText = styled.Text`
  font-size: ${Typography.hero.fontSize}px;
  font-weight: ${Typography.hero.fontWeight};
  color: #0F172A;
  line-height: ${Typography.hero.lineHeight}px;
`;

export const H1Text = styled.Text`
  font-size: ${Typography.h1.fontSize}px;
  font-weight: ${Typography.h1.fontWeight};
  color: #0F172A;
  line-height: ${Typography.h1.lineHeight}px;
`;

export const H2Text = styled.Text`
  font-size: ${Typography.h2.fontSize}px;
  font-weight: ${Typography.h2.fontWeight};
  color: #0F172A;
  line-height: ${Typography.h2.lineHeight}px;
`;

export const H3Text = styled.Text`
  font-size: ${Typography.h3.fontSize}px;
  font-weight: ${Typography.h3.fontWeight};
  color: #0F172A;
  line-height: ${Typography.h3.lineHeight}px;
`;

export const BodyText = styled.Text<{ variant?: 'primary' | 'secondary' | 'muted' }>`
  font-size: ${Typography.body.fontSize}px;
  font-weight: ${Typography.body.fontWeight};
  line-height: ${Typography.body.lineHeight}px;
  color: ${(props) => {
    switch (props.variant) {
      case 'secondary': return '#64748B';
      case 'muted': return '#94A3B8';
      default: return '#0F172A';
    }
  }};
`;

export const CaptionText = styled.Text`
  font-size: ${Typography.caption.fontSize}px;
  font-weight: ${Typography.caption.fontWeight};
  color: #64748B;
  line-height: ${Typography.caption.lineHeight}px;
`;

// Layout Components
export const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

export const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #FFFFFF;
`;

export const ContentContainer = styled.View<{ padding?: keyof typeof Spacing }>`
  padding: ${(props) => Spacing[props.padding || 'lg']}px;
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${Spacing.lg}px;
`;

// Stats Components
export const StatsGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const StatItem = styled.View<{ width?: string }>`
  width: ${(props) => props.width || '48%'};
  align-items: center;
  margin-bottom: ${Spacing.md}px;
`;

export const StatValue = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #2563EB;
  margin-bottom: 4px;
`;

export const StatLabel = styled.Text`
  font-size: 12px;
  color: #64748B;
`;

// Coach-specific Components
export const CoachIcon = styled.View<{ size?: number; color?: string }>`
  width: ${(props) => props.size || 64}px;
  height: ${(props) => props.size || 64}px;
  background-color: ${(props) => props.color || 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${(props) => (props.size || 64) / 2}px;
  justify-content: center;
  align-items: center;
`;

export const CoachMessage = styled.View`
  background-color: #2563EB;
  border-radius: ${BorderRadius.lg}px;
  padding: ${Spacing.lg}px;
  align-items: center;
  margin-bottom: ${Spacing.lg}px;
`;

export const CoachMessageText = styled.Text`
  color: #FFFFFF;
  font-size: ${Typography.body.fontSize}px;
  text-align: center;
  line-height: 22px;
`;

// Form Components
export const FormSection = styled.View`
  margin-bottom: ${Spacing.xl}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${Typography.h3.fontSize}px;
  font-weight: ${Typography.h3.fontWeight};
  color: #0F172A;
  margin-bottom: ${Spacing.md}px;
  padding-horizontal: ${Spacing.lg}px;
`;

export const SettingItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${Spacing.lg}px;
  padding-vertical: ${Spacing.md}px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #E2E8F0;
`;

export const SettingInfo = styled.View`
  flex: 1;
  margin-right: ${Spacing.md}px;
`;

export const SettingTitle = styled.Text`
  font-size: ${Typography.body.fontSize}px;
  font-weight: 500;
  color: #0F172A;
  margin-bottom: 4px;
`;

export const SettingDescription = styled.Text`
  font-size: ${Typography.bodySmall.fontSize}px;
  color: #64748B;
`;

// Empty State Components
export const EmptyState = styled.View`
  align-items: center;
  padding: ${Spacing.xl}px;
`;

export const EmptyStateText = styled.Text`
  font-size: ${Typography.body.fontSize}px;
  font-weight: 500;
  color: #64748B;
  margin-top: ${Spacing.md}px;
  margin-bottom: ${Spacing.sm}px;
`;

export const EmptyStateSubtext = styled.Text`
  font-size: ${Typography.bodySmall.fontSize}px;
  color: #94A3B8;
  text-align: center;
`;