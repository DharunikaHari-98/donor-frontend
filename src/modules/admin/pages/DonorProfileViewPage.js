import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDonorById } from '../services/donorAdminApi';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

// PDF Library
import jsPDF from 'jspdf';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import EditIcon from '@mui/icons-material/Edit';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
  textAlign: 'center',
}));

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
  height: '100%',
}));

const DetailItem = ({ icon, primary, secondary }) => (
  <ListItem>
    <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
    <ListItemText primary={primary} secondary={secondary || 'Not provided'} />
  </ListItem>
);

const fmtDate = (val) => {
  if (!val) return '-';
  const d = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

const DonorProfileViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: donor, isLoading, isError, error } = useQuery({
    queryKey: ['donor', id],
    queryFn: () => getDonorById(id),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;
  if (!donor) return <Typography>No donor data found.</Typography>;

  const fullAddress =
    [donor?.address, donor?.city, donor?.state].filter(Boolean).join(', ') || '-';

  // --- NEW FUNCTION TO DOWNLOAD PDF ---
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Donor Profile", 14, 20);

    doc.setFontSize(12);
    doc.text(`Donor ID: ${donor?.id ?? '-'}`, 14, 35);
    doc.text(`Name: ${donor?.name ?? '-'}`, 14, 45);
    doc.text(`Blood Group: ${donor?.bloodGroup ?? '-'}`, 14, 55);
    doc.text(`City: ${donor?.city ?? '-'}`, 14, 65);
    doc.text(`Email: ${donor?.email ?? '-'}`, 14, 75);
    doc.text(`Phone: ${donor?.phone ?? '-'}`, 14, 85);
    doc.text(`Date of Birth: ${fmtDate(donor?.dob)}`, 14, 95);
    doc.text(`Address: ${fullAddress}`, 14, 105);

    doc.text("Medical & Consent:", 14, 120);
    doc.text(`Willing to Donate Blood: ${donor?.willingBlood ? 'Yes' : 'No'}`, 14, 130);
    doc.text(`Willing to Donate Organs (Posthumous): ${donor?.willingPosthumous ? 'Yes' : 'No'}`, 14, 140);
    doc.text(`Medical Notes: ${donor?.medicalNotes || 'Not provided'}`, 14, 150);

    doc.save(`Donor_${donor?.id}.pdf`);
  };

  return (
    <Grid container spacing={3}>
      {/* Left Column: Profile Summary */}
      <Grid item xs={12} md={4}>
        <ProfileCard>
          <Avatar sx={{ width: 120, height: 120, margin: '0 auto 16px', bgcolor: 'primary.light' }}>
            <PersonIcon sx={{ fontSize: 80, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h5" fontWeight="600">{donor?.name || '-'}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Donor ID: #{donor?.id ?? '-'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2 }}>
            <Chip icon={<BloodtypeIcon />} label={`Blood Group: ${donor?.bloodGroup ?? '-'}`} color="primary" />
            <Chip icon={<LocationCityIcon />} label={donor?.city || '-'} variant="outlined" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/admin/donors/${id}/edit`)}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Box>
        </ProfileCard>
      </Grid>

      {/* Right Column: Detailed Information */}
      <Grid item xs={12} md={8}>
        <DetailPaper>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Donor Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <List>
                <DetailItem icon={<EmailIcon />} primary="Email" secondary={donor?.email || '-'} />
                <DetailItem icon={<PhoneIcon />} primary="Phone" secondary={donor?.phone || '-'} />
                <DetailItem icon={<CakeIcon />} primary="Date of Birth" secondary={fmtDate(donor?.dob)} />
              </List>
            </Grid>
            <Grid item xs={12} lg={6}>
              <List>
                <DetailItem icon={<HomeIcon />} primary="Address" secondary={fullAddress} />
              </List>
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="600" mt={4} gutterBottom>
            Medical & Consent
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            <ListItem>
              <ListItemIcon sx={{ color: donor?.willingBlood ? 'success.main' : 'error.main' }}>
                {donor?.willingBlood ? <CheckCircleIcon /> : <CancelIcon />}
              </ListItemIcon>
              <ListItemText primary="Willing to Donate Blood" />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ color: donor?.willingPosthumous ? 'success.main' : 'error.main' }}>
                {donor?.willingPosthumous ? <CheckCircleIcon /> : <CancelIcon />}
              </ListItemIcon>
              <ListItemText primary="Willing to Donate Organs (Posthumous)" />
            </ListItem>
            <DetailItem
              icon={<MedicalInformationIcon />}
              primary="Medical Notes"
              secondary={donor?.medicalNotes || 'Not provided'}
            />
          </List>
        </DetailPaper>
      </Grid>
    </Grid>
  );
};

export default DonorProfileViewPage;
