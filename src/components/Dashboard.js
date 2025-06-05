import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Avatar, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const Dashboard = ({ pets, addPet, userId, appointments }) => {
  const [open, setOpen] = useState(false);
  const [recommendedAppointments, setRecommendedAppointments] = useState([]);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'dog',
    avatar: ''
  });
  
  // Generate appointment recommendations based on pets
  useEffect(() => {
    // Recommended appointments based on pet type and health needs
    const sampleRecommendations = [
      {
        id: 101,
        petId: 1,
        petName: 'pop',
        recommendationType: 'annual-checkup',
        dueDate: '2025-08-20',
        reason: 'Annual wellness exam due in 2 months',
        priority: 'medium'
      },
      {
        id: 102,
        petId: 1,
        petName: 'pop',
        recommendationType: 'dental-cleaning',
        dueDate: '2025-07-05',
        reason: 'Regular dental cleaning recommended',
        priority: 'high'
      }
    ];
    
    setRecommendedAppointments(sampleRecommendations);
  }, [pets]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet({
      ...newPet,
      [name]: value,
      avatar: name === 'name' && value ? value.charAt(0).toLowerCase() : newPet.avatar
    });
  };

  const handleSubmit = () => {
    if (newPet.name) {
      addPet(newPet);
      setNewPet({ name: '', type: 'dog', avatar: '' });
      handleClose();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          bgcolor: '#5D54C4', 
          color: 'white',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <PetsIcon sx={{ mr: 1 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            Pet Health Hub
          </Typography>
          <PetsIcon sx={{ ml: 1 }} />
        </Box>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Track Vitals, Manage Records, Get AI Insights & Connect
        </Typography>
        <Typography variant="body1" align="center">
          Your User ID: {userId}
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PetsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 'bold' }}>
            My Pets
          </Typography>
        </Box>

        {pets.map(pet => (
          <Link to={`/pet/${pet.id}/vitals`} key={pet.id} style={{ textDecoration: 'none' }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: '#E6E6FA',
                borderRadius: 3,
                '&:hover': {
                  bgcolor: '#D8D8F0',
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: '#8B80F9', 
                  color: 'white', 
                  width: 50, 
                  height: 50,
                  fontSize: '1.5rem'
                }}
              >
                {pet.avatar}
              </Avatar>
              <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
                {pet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({pet.type})
              </Typography>
            </Paper>
          </Link>
        ))}

        <Button 
          variant="contained" 
          color="success" 
          fullWidth 
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ 
            mt: 2, 
            py: 1.5, 
            borderRadius: 3,
            fontSize: '1rem'
          }}
        >
          Add New Pet
        </Button>
      </Paper>

      {/* Upcoming Appointments Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventNoteIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" color="secondary" sx={{ fontWeight: 'bold' }}>
            Upcoming Appointments
          </Typography>
        </Box>
        
        {appointments.length === 0 ? (
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#666', mb: 2 }}>
            No upcoming appointments scheduled.
          </Typography>
        ) : (
          appointments.map(appointment => (
            <Paper 
              key={appointment.id}
              elevation={1}
              sx={{ 
                p: 2, 
                mb: 2, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                borderLeft: '4px solid #9c27b0',
                borderRadius: 2,
                bgcolor: '#faf5ff'
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {new Date(appointment.date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})} at {appointment.time}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <b>{appointment.appointmentType.charAt(0).toUpperCase() + appointment.appointmentType.slice(1)}</b> for <b>{appointment.petName}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.veterinarian} • {appointment.location}
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                color="secondary"
                size="small"
                component={Link}
                to={`/pet/${appointment.petId}/appointments`}
                sx={{ mt: { xs: 2, sm: 0 }, minWidth: '100px' }}
              >
                Details
              </Button>
            </Paper>
          ))
        )}
        
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<EventNoteIcon />}
          component={Link}
          to={`/pet/${pets[0]?.id || 1}/appointments`}
          sx={{ 
            py: 1.5, 
            mt: 2,
            borderRadius: 3,
            fontSize: '1rem'
          }}
        >
          Manage All Appointments
        </Button>
      </Paper>
      
      {/* Recommended Appointments */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PetsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 'bold' }}>
            Appointment Recommendations
          </Typography>
        </Box>
        
        {recommendedAppointments.map(rec => (
          <Paper 
            key={rec.id}
            elevation={1}
            sx={{ 
              p: 2, 
              mb: 2, 
              borderLeft: rec.priority === 'high' ? '4px solid #f44336' : '4px solid #ff9800',
              borderRadius: 2,
              bgcolor: rec.priority === 'high' ? '#fff5f5' : '#fff8e1'
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {rec.recommendationType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              For <b>{rec.petName}</b> • Due by {new Date(rec.dueDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rec.reason}
            </Typography>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Button 
                variant="contained" 
                color={rec.priority === 'high' ? 'error' : 'warning'}
                size="small"
                component={Link}
                to={`/pet/${rec.petId}/appointments`}
                sx={{ mr: 1 }}
              >
                Schedule Now
              </Button>
              <Button 
                variant="text" 
                size="small"
                sx={{ color: '#666' }}
              >
                Remind Later
              </Button>
            </Box>
          </Paper>
        ))}
      </Paper>
      
      {/* Quick access buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ 
            py: 2, 
            flexGrow: 1,
            borderRadius: 3,
            fontSize: '1rem'
          }}
          startIcon={<SettingsIcon />}
          component={Link}
          to="/settings"
        >
          Settings
        </Button>
      </Box>

      {/* Add New Pet Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Pet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Pet Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPet.name}
            onChange={handleChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel id="pet-type-label">Pet Type</InputLabel>
            <Select
              labelId="pet-type-label"
              name="type"
              value={newPet.type}
              label="Pet Type"
              onChange={handleChange}
            >
              <MenuItem value="dog">Dog</MenuItem>
              <MenuItem value="cat">Cat</MenuItem>
              <MenuItem value="bird">Bird</MenuItem>
              <MenuItem value="fish">Fish</MenuItem>
              <MenuItem value="reptile">Reptile</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Add Pet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
