import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetSelector from './PetSelector';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import StorageIcon from '@mui/icons-material/Storage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';

const Settings = ({ userId, pets }) => {
  const navigate = useNavigate();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    dataBackup: true,
    autoSync: true
  });
  const [userProfile, setUserProfile] = useState({
    name: 'Pet Owner',
    email: 'petowner@example.com',
    phone: '555-123-4567'
  });

  const handleToggleChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleProfileDialogOpen = () => {
    setOpenProfileDialog(true);
  };

  const handleProfileDialogClose = () => {
    setOpenProfileDialog(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    console.log('Saving user profile:', userProfile);
    handleProfileDialogClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PetSelector pets={pets} />
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
            Settings
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          User ID: {userId}
        </Typography>

        <List>
          <ListItem button onClick={handleProfileDialogOpen}>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="User Profile" 
              secondary="Update your personal information"
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <NotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Push Notifications" 
              secondary="Receive alerts for medication, appointments, etc." 
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.pushNotifications}
                onChange={() => handleToggleChange('pushNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <NotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Email Notifications" 
              secondary="Receive email summaries and alerts" 
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={() => handleToggleChange('emailNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemIcon>
              <StorageIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Backup" 
              secondary="Automatically backup your pet data" 
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.dataBackup}
                onChange={() => handleToggleChange('dataBackup')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CloudUploadIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Auto Sync" 
              secondary="Sync data across all your devices" 
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.autoSync}
                onChange={() => handleToggleChange('autoSync')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem button>
            <ListItemIcon>
              <LockIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Privacy & Security" 
              secondary="Manage your privacy settings and data" 
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <HelpIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Help & Support" 
              secondary="Get assistance with using the app" 
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <InfoIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="About" 
              secondary="App version, terms of service, privacy policy" 
            />
          </ListItem>
        </List>
      </Paper>

      {/* User Profile Dialog */}
      <Dialog open={openProfileDialog} onClose={handleProfileDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={userProfile.name}
            onChange={handleProfileChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={userProfile.email}
            onChange={handleProfileChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={userProfile.phone}
            onChange={handleProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileDialogClose} color="primary">
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

export default Settings;
