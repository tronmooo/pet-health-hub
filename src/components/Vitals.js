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
  Grid,
  IconButton,
  Tooltip,
  DialogContentText
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DeleteIcon from '@mui/icons-material/Delete';

const Vitals = ({ pets }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [vitalEntries, setVitalEntries] = useState([]);
  
  // State for delete confirmation
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [vitalToDelete, setVitalToDelete] = useState(null);
  
  const [newVitalEntry, setNewVitalEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    notes: ''
  });
  
  // Find the current pet
  const pet = pets.find(p => p.id === parseInt(petId)) || { name: 'Unknown Pet' };
  
  const [symptomText, setSymptomText] = useState('');
  const [symptomAnalysis, setSymptomAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Prevent navigation when clicking the current tab
    if (newValue === 0 && window.location.pathname === `/pet/${petId}/vitals`) {
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
    setOpenDialog(true);
  };
  
  const handleSymptomCheck = async () => {
    if (!symptomText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await GeminiService.analyzeSymptoms(pet.type, symptomText);
      setSymptomAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setSymptomAnalysis('Sorry, there was an error processing your request. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVitalEntry({
      ...newVitalEntry,
      [name]: value
    });
  };
  
  const handleAddVital = () => {
    // Add the new vital entry with a unique ID
    const newEntry = {
      ...newVitalEntry,
      id: Date.now(), // Use timestamp as a simple unique ID
      createdAt: new Date().toISOString()
    };
    
    // Add to the vitalEntries state array
    setVitalEntries([...vitalEntries, newEntry]);
    
    console.log('Added new vital:', newEntry);
    
    // Reset form and close dialog
    setNewVitalEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      notes: ''
    });
    handleDialogClose();
  };
  
  // Delete handlers
  const handleDeleteClick = (vitalId) => {
    setVitalToDelete(vitalId);
    setConfirmDeleteOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (vitalToDelete) {
      // Remove the vital entry from state
      setVitalEntries(prev => prev.filter(v => v.id !== vitalToDelete));
    }
    setConfirmDeleteOpen(false);
    setVitalToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false);
    setVitalToDelete(null);
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
          <Tab icon={<FavoriteIcon />} label="Vitals" />
          <Tab icon={<DescriptionIcon />} label="Medical Records" />
          <Tab icon={<DirectionsRunIcon />} label="Activity" />
          <Tab 
            icon={<RestaurantIcon />} 
            label="Diet" 
          />
          <Tab icon={<EventIcon />} label="Appointments" />
        </Tabs>
      </Paper>
      
      {/* Content */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FavoriteIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1" color="primary">
            Recent Vitals
          </Typography>
        </Box>
        
        {vitalEntries.length === 0 ? (
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
              No vital records for {pet.name} yet. Add one to see health trends!
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ mb: 3 }}>
            {vitalEntries.map((entry) => (
              <Paper 
                key={entry.id} 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  mb: 2,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Grid container>
                  <Grid item xs={10}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {new Date(entry.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'right' }}>
                    <Tooltip title="Delete Vital Entry">
                      <IconButton 
                        onClick={() => handleDeleteClick(entry.id)} 
                        size="small" 
                        color="error" 
                        aria-label="delete vital"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {entry.weight && (
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Weight</Typography>
                      <Typography variant="body1">{entry.weight} lbs</Typography>
                    </Grid>
                  )}
                  {entry.temperature && (
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Temperature</Typography>
                      <Typography variant="body1">{entry.temperature} °F</Typography>
                    </Grid>
                  )}
                  {entry.heartRate && (
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                      <Typography variant="body1">{entry.heartRate} bpm</Typography>
                    </Grid>
                  )}
                  {entry.respiratoryRate && (
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" color="text.secondary">Resp. Rate</Typography>
                      <Typography variant="body1">{entry.respiratoryRate} bpm</Typography>
                    </Grid>
                  )}
                </Grid>
                {entry.notes && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    <strong>Notes:</strong> {entry.notes}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        )}
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
          sx={{ py: 1.5, mb: 3, borderRadius: 8 }}
        >
          Add New Vital Entry
        </Button>
        
        <Paper 
          elevation={2}
          sx={{ 
            p: 2, 
            bgcolor: '#E0E0E0', 
            borderRadius: 2,
            mb: 3
          }}
        >
          <Button
            variant="text"
            fullWidth
            startIcon={<SmartToyIcon />}
            sx={{ py: 1.5, color: '#1F1F1F', justifyContent: 'flex-start' }}
          >
            Get AI Health & Vaccine Suggestions
          </Button>
        </Paper>
        
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            Get Gemini AI Health & Vaccine Suggestions
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Describe your pet's symptoms and get an AI analysis. 
            <Typography component="span" sx={{ color: 'error.main' }}>
              {' '}Disclaimer: This is for informational purposes only and is not a substitute for professional veterinary advice. Always consult a qualified veterinarian for any health concerns.
            </Typography>
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="E.g., 'My dog has been coughing and has low energy for the past two days.'"
            multiline
            rows={3}
            sx={{ mb: 2 }}
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
          />
          
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            onClick={handleSymptomCheck}
            disabled={isAnalyzing || !symptomText.trim()}
          >
            {isAnalyzing ? 'Analyzing...' : 'Check Symptoms with Gemini'}
          </Button>
          
          {symptomAnalysis && (
            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Gemini Analysis:
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                {symptomAnalysis}
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>
      
      {/* New Vital Entry Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Vital Entry for {pet.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newVitalEntry.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="weight"
            label="Weight (lbs)"
            type="number"
            fullWidth
            variant="outlined"
            value={newVitalEntry.weight}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="temperature"
            label="Temperature (°F)"
            type="number"
            fullWidth
            variant="outlined"
            value={newVitalEntry.temperature}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="heartRate"
            label="Heart Rate (bpm)"
            type="number"
            fullWidth
            variant="outlined"
            value={newVitalEntry.heartRate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="respiratoryRate"
            label="Respiratory Rate (bpm)"
            type="number"
            fullWidth
            variant="outlined"
            value={newVitalEntry.respiratoryRate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newVitalEntry.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddVital} color="primary" variant="contained">
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vital entry? This action cannot be undone.
          </DialogContentText>
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

export default Vitals;
