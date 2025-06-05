import React, { useState } from 'react';
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
  Grid,
  IconButton,
  Tooltip, // Added for delete button tooltip
  DialogContentText // Added for confirmation dialog
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DeleteIcon from '@mui/icons-material/Delete'; // Added for delete button

const Activity = ({ pets }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(2);
  const [openDialog, setOpenDialog] = useState(false);
  const [behaviorInput, setBehaviorInput] = useState('');
  const [behaviorAnalysis, setBehaviorAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    date: new Date().toISOString().split('T')[0],
    activityType: 'walk',
    duration: '',
    intensity: 'moderate',
    notes: ''
  });

  // State for delete confirmation
  const [confirmDeleteOpenActivity, setConfirmDeleteOpenActivity] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  // Delete handlers
  const handleDeleteClickActivity = (activityId) => {
    setActivityToDelete(activityId);
    setConfirmDeleteOpenActivity(true);
  };

  const handleDeleteConfirmActivity = () => {
    if (activityToDelete) {
      setActivities(prevActivities => prevActivities.filter(activity => activity.id !== activityToDelete));
    }
    setConfirmDeleteOpenActivity(false);
    setActivityToDelete(null);
  };

  const handleDeleteCancelActivity = () => {
    setConfirmDeleteOpenActivity(false);
    setActivityToDelete(null);
  };
  
  // Find the current pet
  const pet = pets.find(p => p.id === parseInt(petId)) || { name: 'Unknown Pet' };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Prevent navigation when clicking the current tab
    if (newValue === 2 && window.location.pathname === `/pet/${petId}/activity`) {
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
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: value
    });
  };
  
  const handleBehaviorInputChange = (e) => {
    setBehaviorInput(e.target.value);
  };

  const handleBehaviorAnalysis = async () => {
    if (!behaviorInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await GeminiService.analyzeBehavior(pet.type, behaviorInput);
      setBehaviorAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      setBehaviorAnalysis('Sorry, there was an error processing your request. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAddActivity = () => {
    // Create a new activity entry with a unique ID
    const newEntry = {
      ...newActivity,
      id: Date.now(), // Use timestamp as a simple unique ID
      createdAt: new Date().toISOString()
    };
    
    // Add to activities state array
    setActivities([...activities, newEntry]);
    
    console.log('Added new activity:', newEntry);
    
    // Reset form and close dialog
    setNewActivity({
      date: new Date().toISOString().split('T')[0],
      activityType: 'walk',
      duration: '',
      intensity: 'moderate',
      notes: ''
    });
    handleDialogClose();
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <DirectionsRunIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1" color="primary">
            Activity Log for {pet.name}
          </Typography>
        </Box>
        
        {activities.length === 0 ? (
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
              No activity records for {pet.name} yet.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ mb: 3 }}>
            {activities.map((activity) => (
              <Paper 
                key={activity.id} 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  mb: 2,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Grid container alignItems="flex-start" justifyContent="space-between">
                  <Grid item xs={10} sm={11}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {new Date(activity.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Activity Type</Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{activity.activityType}</Typography>
                      </Grid>
                      {activity.duration && (
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Duration</Typography>
                          <Typography variant="body1">{activity.duration} min</Typography>
                        </Grid>
                      )}
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Intensity</Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{activity.intensity}</Typography>
                      </Grid>
                    </Grid>
                    {activity.notes && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        <strong>Notes:</strong> {activity.notes}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ textAlign: 'right', pt: 1 }}>
                    <Tooltip title="Delete Activity">
                      <IconButton onClick={() => handleDeleteClickActivity(activity.id)} size="small" color="error" aria-label="delete activity">
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
          color="warning"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
          sx={{ py: 1.5, mb: 3, borderRadius: 8 }}
        >
          Add New Activity
        </Button>
        
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" component="h2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PsychologyIcon sx={{ mr: 1 }} />
            Gemini AI Behavioral Analysis ✨
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Describe a behavior your pet is exhibiting to get an AI analysis and tips. 
            <Typography component="span" sx={{ color: 'error.main' }}>
              {' '}Disclaimer: Not a substitute for professional advice.
            </Typography>
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="E.g., 'My dog barks excessively at the mailman every day.'"
            multiline
            rows={3}
            value={behaviorInput}
            onChange={handleBehaviorInputChange}
            sx={{ mb: 2, bgcolor: '#E6E9FD' }}
          />
          
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            disabled={!behaviorInput.trim() || isAnalyzing}
            onClick={handleBehaviorAnalysis}
          >
            {isAnalyzing ? 'Analyzing...' : 'Get Gemini Behavior Analysis'}
          </Button>
          
          {behaviorAnalysis && (
            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Gemini Analysis:
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                {behaviorAnalysis}
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>
      
      {/* New Activity Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Activity for {pet.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newActivity.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="activity-type-label">Activity Type</InputLabel>
            <Select
              labelId="activity-type-label"
              name="activityType"
              value={newActivity.activityType}
              label="Activity Type"
              onChange={handleInputChange}
            >
              <MenuItem value="walk">Walk</MenuItem>
              <MenuItem value="run">Run</MenuItem>
              <MenuItem value="play">Play</MenuItem>
              <MenuItem value="swim">Swim</MenuItem>
              <MenuItem value="training">Training</MenuItem>
              <MenuItem value="socialization">Socialization</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="duration"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="outlined"
            value={newActivity.duration}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="intensity-label">Intensity</InputLabel>
            <Select
              labelId="intensity-label"
              name="intensity"
              value={newActivity.intensity}
              label="Intensity"
              onChange={handleInputChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newActivity.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddActivity} color="primary" variant="contained">
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting Activity */}
      <Dialog
        open={confirmDeleteOpenActivity}
        onClose={handleDeleteCancelActivity}
        aria-labelledby="alert-dialog-title-activity"
        aria-describedby="alert-dialog-description-activity"
      >
        <DialogTitle id="alert-dialog-title-activity">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-activity">
            Are you sure you want to delete this activity log? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelActivity} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmActivity} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Activity;
