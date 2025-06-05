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
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Added for delete button

const Diet = ({ pets }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(3);
  const [openDialog, setOpenDialog] = useState(false);
  const [dietRecommendation, setDietRecommendation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietEntries, setDietEntries] = useState([]);
  const [newDiet, setNewDiet] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    foodType: '',
    amount: '',
    calories: '',
    notes: ''
  });

  // State for delete confirmation
  const [confirmDeleteOpenDiet, setConfirmDeleteOpenDiet] = useState(false);
  const [dietEntryToDelete, setDietEntryToDelete] = useState(null);

  // Delete handlers
  const handleDeleteClickDiet = (entryId) => {
    setDietEntryToDelete(entryId);
    setConfirmDeleteOpenDiet(true);
  };

  const handleDeleteConfirmDiet = () => {
    if (dietEntryToDelete) {
      setDietEntries(prevEntries => prevEntries.filter(entry => entry.id !== dietEntryToDelete));
    }
    setConfirmDeleteOpenDiet(false);
    setDietEntryToDelete(null);
  };

  const handleDeleteCancelDiet = () => {
    setConfirmDeleteOpenDiet(false);
    setDietEntryToDelete(null);
  };
  
  // Find the current pet
  const pet = pets.find(p => p.id === parseInt(petId)) || { name: 'Unknown Pet' };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Prevent navigation when clicking the current tab
    if (newValue === 3 && window.location.pathname === `/pet/${petId}/diet`) {
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
  
  const handleGetDietRecommendation = async () => {
    setIsGenerating(true);
    try {
      // Prepare pet info with relevant details for dietary recommendation
      const petInfo = {
        type: pet.type,
        age: pet.age,
        weight: pet.weight,
        weightUnit: 'lbs',
        healthConditions: pet.healthConditions || 'None',
        activityLevel: pet.activityLevel || 'Moderate'
      };
      
      const recommendation = await GeminiService.provideDietaryRecommendations(petInfo);
      setDietRecommendation(recommendation);
    } catch (error) {
      console.error('Error getting dietary recommendations:', error);
      setDietRecommendation('Sorry, there was an error processing your request. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiet({
      ...newDiet,
      [name]: value
    });
  };
  
  const handleAddDiet = () => {
    // Create a new diet entry with a unique ID
    const newEntry = {
      ...newDiet,
      id: Date.now(), // Use timestamp as a simple unique ID
      createdAt: new Date().toISOString()
    };
    
    // Add to the dietEntries state array
    setDietEntries([...dietEntries, newEntry]);
    
    console.log('Added new diet entry:', newEntry);
    
    // Reset form and close dialog
    setNewDiet({
      date: new Date().toISOString().split('T')[0],
      mealType: 'breakfast',
      foodType: '',
      amount: '',
      calories: '',
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
          <RestaurantIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1" color="primary">
            Diet Log for {pet.name}
          </Typography>
        </Box>
        
        {dietEntries.length === 0 ? (
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
              No diet records for {pet.name} yet.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ mb: 3 }}>
            {dietEntries.map((entry) => (
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
                <Grid container alignItems="flex-start" justifyContent="space-between">
                  <Grid item xs={10} sm={11}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {new Date(entry.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Meal Type</Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{entry.mealType}</Typography>
                      </Grid>
                      {entry.foodType && (
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Food Type</Typography>
                          <Typography variant="body1">{entry.foodType}</Typography>
                        </Grid>
                      )}
                      {entry.amount && (
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Amount</Typography>
                          <Typography variant="body1">{entry.amount}</Typography>
                        </Grid>
                      )}
                      {entry.calories && (
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Calories</Typography>
                          <Typography variant="body1">{entry.calories} kcal</Typography>
                        </Grid>
                      )}
                    </Grid>
                    {entry.notes && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        <strong>Notes:</strong> {entry.notes}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={2} sm={1} sx={{ textAlign: 'right', pt: 1 }}>
                    <Tooltip title="Delete Diet Entry">
                      <IconButton onClick={() => handleDeleteClickDiet(entry.id)} size="small" color="error" aria-label="delete diet entry">
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
          color="success"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
          sx={{ py: 1.5, mb: 3, borderRadius: 8 }}
        >
          Add New Diet Entry
        </Button>
        
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="h6" component="h2" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <RestaurantMenuIcon sx={{ mr: 1 }} />
            Gemini AI Dietary Recommendation ✨
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Get personalized diet suggestions for your pet based on their profile and diet history.
            <Typography component="span" sx={{ color: 'error.main' }}>
              {' '}Disclaimer: Not a substitute for professional advice.
            </Typography>
          </Typography>
          
          <Button
            variant="contained"
            color="inherit"
            fullWidth
            startIcon={<EditIcon />}
            sx={{ py: 1.5, bgcolor: '#E0E0E0', color: '#1F1F1F', '&:hover': { bgcolor: '#D0D0D0' } }}
            onClick={handleGetDietRecommendation}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Recommendation...' : 'Get Gemini Diet Recommendation'}
          </Button>
          
          {dietRecommendation && (
            <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Gemini Dietary Recommendation:
              </Typography>
              <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                {dietRecommendation}
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>
      
      {/* New Diet Entry Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Diet Entry for {pet.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newDiet.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="meal-type-label">Meal Type</InputLabel>
            <Select
              labelId="meal-type-label"
              name="mealType"
              value={newDiet.mealType}
              label="Meal Type"
              onChange={handleInputChange}
            >
              <MenuItem value="breakfast">Breakfast</MenuItem>
              <MenuItem value="lunch">Lunch</MenuItem>
              <MenuItem value="dinner">Dinner</MenuItem>
              <MenuItem value="snack">Snack</MenuItem>
              <MenuItem value="treat">Treat</MenuItem>
              <MenuItem value="medication">Medication with Food</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="foodType"
            label="Food Type/Brand"
            type="text"
            fullWidth
            variant="outlined"
            value={newDiet.foodType}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="amount"
            label="Amount (cups/grams)"
            type="text"
            fullWidth
            variant="outlined"
            value={newDiet.amount}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="calories"
            label="Calories (if known)"
            type="number"
            fullWidth
            variant="outlined"
            value={newDiet.calories}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="notes"
            label="Notes (appetite, reactions, etc.)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={newDiet.notes}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddDiet} color="primary" variant="contained">
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting Diet Entry */}
      <Dialog
        open={confirmDeleteOpenDiet}
        onClose={handleDeleteCancelDiet}
        aria-labelledby="alert-dialog-title-diet"
        aria-describedby="alert-dialog-description-diet"
      >
        <DialogTitle id="alert-dialog-title-diet">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-diet">
            Are you sure you want to delete this diet entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelDiet} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmDiet} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Diet;
