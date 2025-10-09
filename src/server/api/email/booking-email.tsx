import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';

interface BookingEmailProps {
  bookingId: number;
  bookingLink: string;
  translations: (key: string) => string;
  bookingData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    bookingDate: string;
    numberOfPeople: number;
    totalAmount: number;
    tripTitle: string;
    additionalNotes?: string;
  };
  isAdminCopy?: boolean;
}

export const BookingEmail = ({
  bookingId,
  bookingLink,
  translations: t,
  bookingData,
  isAdminCopy = false,
}: BookingEmailProps) => {
  const title = isAdminCopy ? t('adminTitle') : t('title');
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* --- DECORATIVE TOP BANNER --- */}
          <Section style={topBanner}>
            <div style={gradientOverlay}></div>
          </Section>

          {/* --- HEADER --- */}
          <Section style={headerSection}>
            <Row style={rowResponsive}>
              <Column style={columnLeft}>
                <div style={logoWrapper}>
                  <img
                    src="https://www.karimtour.com/logo.svg"
                    alt="Karim Tour Logo"
                    width="140"
                    height="46"
                    style={logoResponsive}
                  />
                </div>
              </Column>
              <Column style={columnRight}>
                <div style={voucherBadge}>
                  <Heading style={voucherTitle}>TOURIST VOUCHER</Heading>
                  <div style={voucherNumber}>#{bookingId}</div>
                </div>
                <Text style={contactText}>
                  <span style={phoneIcon}>📞</span>
                  <span style={phoneNumbers}>
                    +201003637624 • +905352699881
                  </span>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* --- BOOKING DETAILS CARD --- */}
          <Section style={detailsCardSection}>
            <div style={cardGradient}>
              <Heading as="h2" style={cardTitle}>
                ✨ Booking Confirmation
              </Heading>
              
              <div style={detailsGrid}>
                <div style={detailItem}>
                  <div style={detailIcon}>🎫</div>
                  <div style={detailContent}>
                    <div style={detailLabel}>Ticket Number</div>
                    <div style={detailValue}>{bookingId}</div>
                  </div>
                </div>

                <div style={detailItem}>
                  <div style={detailIcon}>👤</div>
                  <div style={detailContent}>
                    <div style={detailLabel}>Guest Name</div>
                    <div style={detailValue}>{bookingData.fullName}</div>
                  </div>
                </div>

                <div style={detailItem}>
                  <div style={detailIcon}>🌍</div>
                  <div style={detailContent}>
                    <div style={detailLabel}>Trip Service</div>
                    <div style={detailValue}>{bookingData.tripTitle}</div>
                  </div>
                </div>

                <div style={detailItem}>
                  <div style={detailIcon}>👥</div>
                  <div style={detailContent}>
                    <div style={detailLabel}>Number of Persons</div>
                    <div style={detailValue}>{bookingData.numberOfPeople}</div>
                  </div>
                </div>

                <div style={detailItem}>
                  <div style={detailIcon}>💰</div>
                  <div style={detailContent}>
                    <div style={detailLabel}>Total Amount</div>
                    <div style={detailValuePrice}>${bookingData.totalAmount}</div>
                  </div>
                </div>

                <div style={detailItem}>
                  <div style={detailIcon}>💳</div>
                  <div style={detailContent}>
                    <div style={detailLabel}>Payment Method</div>
                    <div style={detailValue}>Online</div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* --- TERMS & CONDITIONS --- */}
          <Section style={termsSection}>
            <div style={termsHeader}>
              <div style={termsIconWrapper}>⚖️</div>
              <Heading as="h3" style={termsTitle}>
                Terms & Conditions
              </Heading>
            </div>
            
            <div style={termsCard}>
              <Text style={termsText}>
                All orders, pre-bookings, and trips made through <strong>www.karimtour.com</strong> are subject to the International Travel Agencies Law (Law No. 1254) and the Consumer Protection Law (Law No. 4077), as amended to align with the European Union Consumer Rights Law.
              </Text>

              <div style={agreementBox}>
                <Text style={termsSub}>
                  <strong>Subject of the Agreement</strong>
                  <br />
                  The travel agency "Karim Tour" (hereinafter referred to as "the Contractor") is obliged to provide services and organize trips. The customer (hereinafter referred to as "the Client") is obliged to pay the cost of the selected trips and comply with the terms of this agreement.
                </Text>
              </div>

              <div style={termsListWrapper}>
                <div style={termItem}>
                  <div style={termNumber}>1</div>
                  <div style={termContent}>
                    <strong>Cancellation by the Client:</strong> The Client has the right to cancel up to 12 hours before without penalty, except for:
                    <ul style={termsList}>
                      <li>Flights</li>
                      <li>Trips to another country</li>
                      <li>Trips that include entrance tickets (Aquapark, Dolphin Show, Cable Car, Hot Air Balloon)</li>
                      <li>Private and individual programs</li>
                    </ul>
                  </div>
                </div>

                <div style={termItem}>
                  <div style={termNumber}>2</div>
                  <div style={termContent}>
                    <strong>Late Cancellation:</strong> If cancellation is made on the same day or less than 12 hours before, no refund is provided.
                  </div>
                </div>

                <div style={termItem}>
                  <div style={termNumber}>3</div>
                  <div style={termContent}>
                    <strong>Accuracy of Information:</strong> All displayed information is valid, and Karim Tour commits to the exact itinerary listed.
                  </div>
                </div>

                <div style={termItem}>
                  <div style={termNumber}>4</div>
                  <div style={termContent}>
                    <strong>Right of Refusal:</strong> Karim Tour reserves the right to cancel participation for misconduct or intoxication, harassment, or disrespectful behavior towards staff or drivers.
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* --- FOOTER --- */}
          <Section style={footerSection}>
            <div style={footerWave}></div>
            <Text style={footer}>
              <strong>Thank you for choosing Karim Tour! 🎉</strong>
              <br />
              Your adventure awaits. Have a wonderful journey!
              <br /><br />
              <span style={footerBrand}>Karim Tour Team</span>
            </Text>
            <div style={socialLinks}>
              <span style={socialText}>Follow us:</span>
              <span style={socialIcons}>🌐 📱 📧</span>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- STYLES ---

const main = {
  backgroundColor: '#f0f4f8',
  fontFamily: '"Segoe UI", "Arial", "Helvetica Neue", Helvetica, sans-serif',
  padding: '20px 10px',
};

const container = {
  margin: '0 auto',
  maxWidth: '650px',
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
};

const topBanner = {
  height: '8px',
  background: 'linear-gradient(90deg, #c00000 0%, #ff4757 50%, #ffa502 100%)',
  position: 'relative' as const,
};

const gradientOverlay = {
  height: '100%',
  width: '100%',
};

const headerSection = {
  padding: '30px 25px 25px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  borderBottom: '2px solid #e9ecef',
};

const rowResponsive = {
  display: 'flex',
  flexDirection: 'row' as const,
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: '20px',
};

const columnLeft = {
  flex: '0 0 auto',
  minWidth: '140px',
};

const columnRight = {
  flex: '1 1 auto',
  textAlign: 'right' as const,
  minWidth: '200px',
};

const logoWrapper = {
  backgroundColor: '#ffffff',
  padding: '12px 16px',
  borderRadius: '12px',
  display: 'inline-block',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  border: '2px solid #f1f3f5',
};

const logoResponsive = {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
};

const voucherBadge = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #c00000 0%, #e63946 100%)',
  padding: '12px 20px',
  borderRadius: '10px',
  marginBottom: '12px',
  boxShadow: '0 4px 15px rgba(192, 0, 0, 0.3)',
};

const voucherTitle = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 4px 0',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
};

const voucherNumber = {
  fontSize: '22px',
  fontWeight: '800',
  color: '#fff',
  margin: '0',
  letterSpacing: '1.5px',
};

const contactText = {
  color: '#495057',
  fontSize: '14px',
  margin: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  flexWrap: 'wrap' as const,
};

const phoneIcon = {
  fontSize: '18px',
};

const phoneNumbers = {
  color: '#1254c2',
  fontWeight: '600',
};

const detailsCardSection = {
  padding: '30px 25px',
  background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
};

const cardGradient = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: '30px 25px',
  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
};

const cardTitle = {
  fontSize: '26px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 25px 0',
  textAlign: 'center' as const,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const detailsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '16px',
};

const detailItem = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '18px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
};

const detailIcon = {
  fontSize: '28px',
  flexShrink: 0,
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
};

const detailContent = {
  flex: 1,
  minWidth: 0,
};

const detailLabel = {
  fontSize: '12px',
  color: '#6c757d',
  fontWeight: '600',
  marginBottom: '4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailValue = {
  fontSize: '16px',
  color: '#212529',
  fontWeight: '700',
  wordBreak: 'break-word' as const,
};

const detailValuePrice = {
  fontSize: '20px',
  color: '#c00000',
  fontWeight: '800',
};

const termsSection = {
  padding: '30px 25px',
};

const termsHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '3px solid #e9ecef',
};

const termsIconWrapper = {
  fontSize: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const termsTitle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#c00000',
  margin: '0',
};

const termsCard = {
  backgroundColor: '#f8f9fa',
  padding: '25px',
  borderRadius: '12px',
  border: '2px solid #e9ecef',
};

const termsText = {
  fontSize: '14px',
  lineHeight: '1.7',
  color: '#495057',
  margin: '0 0 20px 0',
};

const agreementBox = {
  backgroundColor: '#ffffff',
  padding: '18px',
  borderRadius: '10px',
  borderLeft: '4px solid #c00000',
  marginBottom: '20px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const termsSub = {
  fontSize: '14px',
  lineHeight: '1.7',
  color: '#212529',
  margin: '0',
};

const termsListWrapper = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
};

const termItem = {
  display: 'flex',
  gap: '15px',
  alignItems: 'flex-start',
  backgroundColor: '#ffffff',
  padding: '18px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const termNumber = {
  flexShrink: 0,
  width: '32px',
  height: '32px',
  backgroundColor: '#c00000',
  color: '#ffffff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '16px',
};

const termContent = {
  flex: 1,
  fontSize: '14px',
  lineHeight: '1.7',
  color: '#495057',
};

const termsList = {
  margin: '10px 0 0 0',
  paddingLeft: '20px',
  listStyleType: 'disc' as const,
};

const footerSection = {
  backgroundColor: '#212529',
  padding: '0',
  position: 'relative' as const,
  overflow: 'hidden',
};

const footerWave = {
  height: '40px',
  background: 'linear-gradient(90deg, #c00000 0%, #ff4757 50%, #ffa502 100%)',
  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 70%)',
};

const footer = {
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '1.8',
  textAlign: 'center' as const,
  padding: '25px 25px 15px',
  margin: '0',
};

const footerBrand = {
  fontSize: '16px',
  fontWeight: '700',
  background: 'linear-gradient(90deg, #ffa502 0%, #ff4757 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const socialLinks = {
  textAlign: 'center' as const,
  padding: '15px 25px 25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  flexWrap: 'wrap' as const,
};

const socialText = {
  color: '#adb5bd',
  fontSize: '13px',
};

const socialIcons = {
  fontSize: '20px',
  display: 'flex',
  gap: '10px',
};