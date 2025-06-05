import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';

const PetSelector = ({ pets }) => {
  const { petId } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Find the current pet based on petId
  const currentPet = pets.find(p => p.id === parseInt(petId)) || pets[0];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'pet-popover' : undefined;

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 1, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        mb: 2,
        bgcolor: '#f5f5fa'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <IconButton color="primary" size="small" sx={{ mr: 1 }}>
            <HomeIcon />
          </IconButton>
        </Link>
        <PetsIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          Pet Health Hub
        </Typography>
      </Box>
      
      <Button 
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ 
          textTransform: 'none', 
          bgcolor: '#e6e6fa', 
          color: '#333',
          '&:hover': { bgcolor: '#d8d8f0' },
          borderRadius: 2,
          px: 1.5
        }}
      >
        <Avatar 
          sx={{ 
            width: 28, 
            height: 28, 
            mr: 1,
            bgcolor: '#8B80F9', 
            fontSize: '0.8rem'
          }}
        >
          {currentPet?.avatar || 'P'}
        </Avatar>
        <Typography variant="body1">
          {currentPet?.name || 'Select Pet'}
        </Typography>
      </Button>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ width: 250, maxHeight: 300, overflow: 'auto', p: 0 }}>
          {pets.map((pet) => (
            <ListItem 
              key={pet.id} 
              component={Link} 
              to={`/pet/${pet.id}/vitals`} 
              onClick={handleClose}
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                '&:hover': { bgcolor: '#f0f0f8' },
                bgcolor: pet.id === currentPet?.id ? '#e8e8f5' : 'transparent'
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#8B80F9' }}>{pet.avatar}</Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={pet.name} 
                secondary={pet.type} 
              />
            </ListItem>
          ))}
          <ListItem 
            component={Link} 
            to="/" 
            onClick={handleClose}
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              borderTop: '1px solid #eee',
            }}
          >
            <ListItemText 
              primary="Manage All Pets" 
              primaryTypographyProps={{ 
                color: 'primary', 
                sx: { textAlign: 'center' } 
              }} 
            />
          </ListItem>
        </List>
      </Popover>
    </Paper>
  );
};

export default PetSelector;
