import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Avatar,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';

const PetProfile = ({ pets }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Find the current pet
  const pet = pets.find(p => p.id === parseInt(petId)) || { 
    name: 'Unknown Pet', 
    type: 'unknown',
    avatar: '?',
    breed: '',
    birthDate: '',
    weight: '',
    color: '',
    microchip: '',
    allergies: '',
    medications: ''
  };
  
  const [petDetails, setPetDetails] = useState({
    name: pet.name,
    type: pet.type,
    breed: pet.breed || '',
    birthDate: pet.birthDate || '',
    weight: pet.weight || '',
    color: pet.color || '',
    microchip: pet.microchip || '',
    allergies: pet.allergies || '',
    medications: pet.medications || ''
  });
  
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetDetails({
      ...petDetails,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    // Here you would normally update the pet profile in your state or database
    console.log('Updating pet profile:', petDetails);
    // Close dialog
    handleDialogClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Pet Profile
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              bgcolor: '#8B80F9', 
              color: 'white', 
              width: 100, 
              height: 100,
              fontSize: '2.5rem',
              mb: 2
            }}
          >
            {pet.avatar}
          </Avatar>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {pet.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
            {pet.breed ? ` • ${pet.breed}` : ''}
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PetsIcon sx={{ mr: 1 }} color="primary" />
                Basic Information
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Birth Date
                </Typography>
                <Typography variant="body1">
                  {pet.birthDate || 'Not specified'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="body1">
                  {pet.weight ? `${pet.weight} lbs` : 'Not specified'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body1">
                  {pet.color || 'Not specified'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Microchip ID
                </Typography>
                <Typography variant="body1">
                  {pet.microchip || 'Not specified'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PetsIcon sx={{ mr: 1 }} color="primary" />
                Health Information
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Allergies
                </Typography>
                <Typography variant="body1">
                  {pet.allergies || 'None known'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Medications
                </Typography>
                <Typography variant="body1">
                  {pet.medications || 'None'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleDialogOpen}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EventIcon />}
            onClick={() => navigate(`/pet/${petId}/appointments`)}
            sx={{ borderRadius: 2 }}
          >
            Manage Appointments
          </Button>
        </Box>
      </Paper>
      
      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile for {pet.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Pet Name"
            type="text"
            fullWidth
            variant="outlined"
            value={petDetails.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="pet-type-label">Pet Type</InputLabel>
            <Select
              labelId="pet-type-label"
              name="type"
              value={petDetails.type}
              label="Pet Type"
              onChange={handleInputChange}
            >
              <MenuItem value="dog">Dog</MenuItem>
              <MenuItem value="cat">Cat</MenuItem>
              <MenuItem value="bird">Bird</MenuItem>
              <MenuItem value="fish">Fish</MenuItem>
              <MenuItem value="reptile">Reptile</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="breed"
            label="Breed"
            type="text"
            fullWidth
            variant="outlined"
            value={petDetails.breed}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="birthDate"
            label="Birth Date"
            type="date"
            fullWidth
            variant="outlined"
            value={petDetails.birthDate}
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
            value={petDetails.weight}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="color"
            label="Color"
            type="text"
            fullWidth
            variant="outlined"
            value={petDetails.color}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="microchip"
            label="Microchip ID"
            type="text"
            fullWidth
            variant="outlined"
            value={petDetails.microchip}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="allergies"
            label="Allergies"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={petDetails.allergies}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="medications"
            label="Current Medications"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={petDetails.medications}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PetProfile;
