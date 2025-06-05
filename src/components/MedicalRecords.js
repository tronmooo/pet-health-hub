import React, { useState, useEffect } from 'react';
import GeminiService from '../services/GeminiService';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicationIcon from '@mui/icons-material/Medication';
import HealingIcon from '@mui/icons-material/Healing';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const MedicalRecords = ({ pets }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  // Tab value should be set to 1 for Medical Records tab
  const [tabValue, setTabValue] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [medicalAnalysis, setMedicalAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showEmpty, setShowEmpty] = useState(true);
  const [records, setRecords] = useState([
    {
      id: 1,
      date: '2025-05-15',
      recordType: 'vaccination',
      details: 'Annual rabies vaccination',
      veterinarian: 'Dr. Smith',
      location: 'Happy Paws Veterinary Clinic',
      notes: 'Next due in one year. Slight fever noted after previous vaccine.'
    },
    {
      id: 2,
      date: '2025-04-20',
      recordType: 'checkup',
      details: 'Regular annual check-up',
      veterinarian: 'Dr. Johnson',
      location: 'Happy Paws Veterinary Clinic',
      notes: 'All vitals normal. Weight slightly increased from last visit.'
    },
    {
      id: 3,
      date: '2025-02-10',
      recordType: 'medication',
      details: 'Prescribed heartworm prevention medication',
      veterinarian: 'Dr. Smith',
      location: 'Happy Paws Veterinary Clinic',
      notes: 'Monthly administration required. Reminder set in calendar.'
    }
  ]);
  
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    recordType: 'vaccination',
    details: '',
    veterinarian: '',
    location: '',
    notes: ''
  });
  
  // Find the current pet
  const pet = pets.find(p => p.id === parseInt(petId)) || { name: 'Unknown Pet' };
  
  // Hide empty state message after records are loaded
  useEffect(() => {
    if (records.length > 0) {
      setShowEmpty(false);
    } else {
      setShowEmpty(true);
    }
  }, [records]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Prevent navigation when clicking the current tab
    if (newValue === 1 && window.location.pathname === `/pet/${petId}/medical`) {
      return;
    }
    
    // Navigate based on tab index
    switch(newValue) {
      case 0:
        navigate(`/pet/${petId}/vitals`);
        break;
      case 1:
        navigate(`/pet/${petId}/medical`);
        break;
      case 2:
        navigate(`/pet/${petId}/activity`);
        break;
      case 3:
        navigate(`/pet/${petId}/diet`);
        break;
      case 4:
        navigate(`/pet/${petId}/appointments`);
        break;
      default:
        navigate(`/pet/${petId}`);
    }
  };
  
  const handleDialogOpen = () => {
    setEditMode(false);
    setCurrentRecordId(null);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      recordType: 'vaccination',
      details: '',
      veterinarian: '',
      location: '',
      notes: ''
    });
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleEditRecord = (record) => {
    setEditMode(true);
    setCurrentRecordId(record.id);
    setNewRecord({ ...record });
    setOpenDialog(true);
  };
  
  const handleDeleteClick = (id) => {
    setRecordToDelete(id);
    setConfirmDeleteOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      setRecords(records.filter(record => record.id !== recordToDelete));
      setConfirmDeleteOpen(false);
      setRecordToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false);
    setRecordToDelete(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value
    });
  };
  
  const handleGetMedicalAnalysis = async () => {
    if (records.length === 0) {
      setMedicalAnalysis('No medical records available for analysis. Please add some medical records first.');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const analysis = await GeminiService.analyzeMedicalHistory(records);
      setMedicalAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing medical history:', error);
      setMedicalAnalysis('Sorry, there was an error processing your request. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddRecord = () => {
    if (editMode && currentRecordId) {
      // Update existing record
      const updatedRecords = records.map(record => 
        record.id === currentRecordId ? { ...newRecord, id: currentRecordId } : record
      );
      setRecords(updatedRecords);
    } else {
      // Add new record
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
      setRecords([...records, { ...newRecord, id: newId }]);
    }
    
    // Reset form and close dialog
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      recordType: 'vaccination',
      details: '',
      veterinarian: '',
      location: '',
      notes: ''
    });
    setEditMode(false);
    setCurrentRecordId(null);
    handleDialogClose();
  };
  
  // Helper function to get icon based on record type
  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <VaccinesIcon />;
      case 'checkup':
        return <MedicalServicesIcon />;
      case 'illness':
      case 'surgery':
        return <HealingIcon />;
      case 'medication':
        return <MedicationIcon />;
      default:
        return <DescriptionIcon />;
    }
  };
  
  // Format date from YYYY-MM-DD to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Tab Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<FavoriteIcon />} 
            label="Vitals" 
          />
          <Tab 
            icon={<DescriptionIcon />} 
            label="Medical Records" 
          />
          <Tab 
            icon={<DirectionsRunIcon />} 
            label="Activity" 
          />
          <Tab 
            icon={<RestaurantIcon />} 
            label="Diet" 
          />
          <Tab icon={<EventIcon />} label="Appointments" />
        </Tabs>
      </Paper>
      
      {/* Content */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h1" color="primary">
              Medical Records for {pet.name}
            </Typography>
          </Box>
          <Tooltip title="Download Medical Records">
            <IconButton color="primary">
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {showEmpty && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              bgcolor: '#E6E9FD', 
              borderRadius: 2, 
              mb: 3,
              fontStyle: 'italic',
              color: '#555'
            }}
          >
            <Typography>
              No medical records found for {pet.name} yet.
            </Typography>
          </Paper>
        )}
        
        {records.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {records.map((record) => (
              <Grid item xs={12} key={record.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getRecordTypeIcon(record.recordType)}
                        </ListItemIcon>
                        <Box>
                          <Typography variant="h6" component="div">
                            {record.details}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formatDate(record.date)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Chip 
                          label={record.recordType.charAt(0).toUpperCase() + record.recordType.slice(1)} 
                          size="small" 
                          color={
                            record.recordType === 'vaccination' ? 'success' :
                            record.recordType === 'checkup' ? 'info' :
                            record.recordType === 'illness' ? 'error' :
                            record.recordType === 'surgery' ? 'warning' :
                            'default'
                          }
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Veterinarian:</strong> {record.veterinarian}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Location:</strong> {record.location}
                        </Typography>
                      </Grid>
                      {record.notes && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <strong>Notes:</strong> {record.notes}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                    
                    <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditRecord(record)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(record.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
          sx={{ py: 1.5, mb: 3, borderRadius: 8 }}
        >
          Add New Medical Record
        </Button>
        
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" component="h2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalHospitalIcon sx={{ mr: 1 }} />
            Gemini AI Medical History Analysis✨
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Get an AI analysis of your pet's medical records for trends, concerns, and proactive suggestions. 
            <Typography component="span" sx={{ color: 'error.main' }}>
              {' '}Disclaimer: Not a substitute for professional advice.
            </Typography>
          </Typography>
          
          <Button
            variant="contained"
            color="inherit"
            fullWidth
            startIcon={<SmartToyIcon />}
            sx={{ py: 1.5, bgcolor: '#E0E0E0', color: '#1F1F1F', '&:hover': { bgcolor: '#D0D0D0' } }}
            onClick={handleGetMedicalAnalysis}
            disabled={isAnalyzing || records.length === 0}
          >
            {isAnalyzing ? 'Analyzing...' : 'Get Gemini Medical Analysis'}
          </Button>
          
          {medicalAnalysis && (
            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Gemini Medical Analysis:
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                {medicalAnalysis}
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>
      
      {/* New Medical Record Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? `Edit Medical Record for ${pet.name}` : `Add New Medical Record for ${pet.name}`}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newRecord.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="record-type-label">Record Type</InputLabel>
            <Select
              labelId="record-type-label"
              name="recordType"
              value={newRecord.recordType}
              label="Record Type"
              onChange={handleInputChange}
            >
              <MenuItem value="vaccination">Vaccination</MenuItem>
              <MenuItem value="checkup">Regular Check-up</MenuItem>
              <MenuItem value="illness">Illness / Injury</MenuItem>
              <MenuItem value="surgery">Surgery</MenuItem>
              <MenuItem value="medication">Medication</MenuItem>
              <MenuItem value="allergy">Allergy</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="details"
            label="Details"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={newRecord.details}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="veterinarian"
            label="Veterinarian"
            type="text"
            fullWidth
            variant="outlined"
            value={newRecord.veterinarian}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="location"
            label="Location/Clinic"
            type="text"
            fullWidth
            variant="outlined"
            value={newRecord.location}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="notes"
            label="Additional Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newRecord.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddRecord} color="primary" variant="contained">
            {editMode ? 'Update Record' : 'Add Record'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this medical record? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecords;
