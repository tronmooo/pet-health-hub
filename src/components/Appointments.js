import React, { useState, useEffect } from 'react';
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
  Grid,
  IconButton,
  Tooltip,
  DialogContentText 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DeleteIcon from '@mui/icons-material/Delete'; // For delete button

const Appointments = ({ pets, appointments: petAppointments, addAppointment, deleteAppointment }) => { // Added deleteAppointment prop
  const { petId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(4); 
  const [openDialog, setOpenDialog] = useState(false);
  
  // Always ensure tab is set to appointments tab (4)
  useEffect(() => {
    setTabValue(4);
  }, []);
  
  const currentPetAppointments = petAppointments ? petAppointments.filter(app => app.petId === parseInt(petId)) : [];
  const [newAppointment, setNewAppointment] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    appointmentType: 'checkup',
    veterinarian: '',
    location: '',
    notes: ''
  });
  
  const [aiSuggestionsOpen, setAiSuggestionsOpen] = useState(false);
  const [reminderType, setReminderType] = useState('vaccination');

  // State for delete confirmation
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
  const pet = pets.find(p => p.id === parseInt(petId)) || { name: 'Unknown Pet' };
  
  const handleTabChange = (event, newValue) => {
    // Always update the tab value
    setTabValue(newValue);
    
    // If user clicks on the Appointments tab (4) while already on the Appointments page,
    // don't navigate anywhere to prevent the redirect to profile
    if (newValue === 4 && window.location.pathname === `/pet/${petId}/appointments`) {
      return;
    }
    
    // Handle navigation for other tabs
    switch(newValue) {
      case 0: navigate(`/pet/${petId}/vitals`); break;
      case 1: navigate(`/pet/${petId}/medical`); break;
      case 2: navigate(`/pet/${petId}/activity`); break;
      case 3: navigate(`/pet/${petId}/diet`); break;
      case 4: navigate(`/pet/${petId}/appointments`); break;
      default: navigate(`/pet/${petId}`);
    }
  };
  
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);
  
  const handleVaccinationReminder = () => {
    setReminderType('vaccination');
    setAiSuggestionsOpen(true);
  };
  
  const handleCheckupReminder = () => {
    setReminderType('checkup');
    setAiSuggestionsOpen(true);
  };
  
  const handleAiSuggestionsClose = () => setAiSuggestionsOpen(false);
  
  const acceptAiSuggestion = (suggestion) => {
    const suggestedAppointment = {
      date: suggestion.date,
      time: suggestion.time,
      appointmentType: reminderType,
      veterinarian: suggestion.veterinarian || '',
      location: suggestion.location || '',
      notes: suggestion.notes || `AI suggested ${reminderType} appointment`,
      petId: parseInt(petId),
      petName: pet.name,
      createdAt: new Date().toISOString()
    };
    addAppointment(suggestedAppointment);
    handleAiSuggestionsClose();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };
  
  const handleAddAppointment = () => {
    const newEntry = {
      ...newAppointment,
      petId: parseInt(petId),
      petName: pet.name,
      createdAt: new Date().toISOString()
    };
    addAppointment(newEntry);
    setNewAppointment({
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      appointmentType: 'checkup',
      veterinarian: '',
      location: '',
      notes: ''
    });
    handleDialogClose();
  };

  // Delete handlers
  const handleDeleteClick = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (appointmentToDelete) {
      deleteAppointment(appointmentToDelete); // This prop will be added to App.js
    }
    setConfirmDeleteOpen(false);
    setAppointmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setConfirmDeleteOpen(false);
    setAppointmentToDelete(null);
  };
  


  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Tab Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={4} 
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/pet/${petId}`)} sx={{ mb: 2 }}>
          Back to {pet.name}'s Profile
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1" color="primary">
            Appointments for {pet.name}
          </Typography>
        </Box>
        
        {currentPetAppointments.length === 0 ? (
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#E6E9FD', borderRadius: 2, mb: 3, fontStyle: 'italic', color: '#555' }}>
            <Typography>No appointments scheduled for {pet.name} yet.</Typography>
          </Paper>
        ) : (
          <Box sx={{ mb: 3 }}>
            {currentPetAppointments.map((appointment) => (
              <Paper key={appointment.id} sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={10} sm={11}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {appointment.appointmentType.charAt(0).toUpperCase() + appointment.appointmentType.slice(1)}: {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </Typography>
                    {appointment.veterinarian && <Typography variant="body2" color="text.secondary">Veterinarian: {appointment.veterinarian}</Typography>}
                    {appointment.location && <Typography variant="body2" color="text.secondary">Location: {appointment.location}</Typography>}
                    {appointment.notes && <Typography variant="body2" sx={{ mt: 1 }}>Notes: {appointment.notes}</Typography>}
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
                    <Tooltip title="Delete Appointment">
                      <IconButton onClick={() => handleDeleteClick(appointment.id)} size="small" color="error" aria-label="delete appointment">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}

        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleDialogOpen} 
          sx={{ mt: 2, backgroundColor: '#673ab7', '&:hover': { backgroundColor: '#5e35b1' } }}
        >
          Add New Appointment
        </Button>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<DateRangeIcon />} 
            onClick={handleVaccinationReminder}
            sx={{ borderColor: '#ab47bc', color: '#ab47bc', '&:hover': { borderColor: '#9c27b0', backgroundColor: 'rgba(156, 39, 176, 0.04)' } }}
          >
            AI: Remind Vaccination
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<LocalHospitalIcon />} 
            onClick={handleCheckupReminder}
            sx={{ borderColor: '#26a69a', color: '#26a69a', '&:hover': { borderColor: '#009688', backgroundColor: 'rgba(0, 150, 136, 0.04)' } }}
          >
            AI: Remind Check-up
          </Button>
        </Box>
      </Paper>

      {/* Dialog for adding/editing appointments */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{'Add New Appointment'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="time"
                name="time"
                value={newAppointment.time}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  name="appointmentType"
                  value={newAppointment.appointmentType}
                  onChange={handleInputChange}
                  label="Appointment Type"
                >
                  <MenuItem value="checkup">Check-up</MenuItem>
                  <MenuItem value="vaccination">Vaccination</MenuItem>
                  <MenuItem value="grooming">Grooming</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Veterinarian (Optional)"
                name="veterinarian"
                value={newAppointment.veterinarian}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location (Optional)"
                name="location"
                value={newAppointment.location}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes (Optional)"
                name="notes"
                value={newAppointment.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddAppointment} variant="contained" color="primary">
            Add Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Suggestions Dialog */}
      <Dialog open={aiSuggestionsOpen} onClose={handleAiSuggestionsClose} maxWidth="sm" fullWidth>
        <DialogTitle>AI Suggested {reminderType.charAt(0).toUpperCase() + reminderType.slice(1)} Reminders</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Here are some AI-generated suggestions for your {reminderType} appointment for {pet.name}:
          </Typography>
          {/* Placeholder for AI suggestions - In a real app, this would be dynamic */}
          <Paper sx={{ p: 2, mb: 1, bgcolor: 'grey.100' }}>
            <Typography variant="subtitle2">Suggestion 1: Next {reminderType}</Typography>
            <Typography variant="body2">Date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}, Time: 10:00 AM</Typography>
            <Button size="small" onClick={() => acceptAiSuggestion({ date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:00' })}>Accept</Button>
          </Paper>
          <Paper sx={{ p: 2, mb: 1, bgcolor: 'grey.100' }}>
            <Typography variant="subtitle2">Suggestion 2: Follow-up {reminderType}</Typography>
            <Typography variant="body2">Date: {new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}, Time: 02:00 PM</Typography>
            <Button size="small" onClick={() => acceptAiSuggestion({ date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:00' })}>Accept</Button>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAiSuggestionsClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={confirmDeleteOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
