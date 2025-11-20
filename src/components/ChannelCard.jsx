import React from 'react';
import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { demoProfilePicture, demoChannelID, demoChannelTitle } from '../utils/constants';

const styles  = {
  boxShadow: 'none',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: { xs: '356px', md: '320px' },
  height: '326px',
  margin: 'auto',
}



const ChannelCard = ({ channelDetail, marginTop }) => {
  const channelId = channelDetail?.id?.channelId || channelDetail?.id || demoChannelID;
  const snippet = channelDetail?.snippet || {};
  const title = snippet?.title || demoChannelTitle;
  const thumbnail = snippet?.thumbnails?.high?.url || demoProfilePicture;

  return (
  <Box sx={ { ...styles, marginTop } }>
    <Link to={`/channel/${channelId}`}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff' }}>
        <CardMedia
          image={thumbnail}
          alt={title}
          sx={{ borderRadius: '50%', height: '180px', width: '180px', mb: 2, border: '1px solid #e3e3e3' }}
        />
        <Typography variant="h6">
          {title}{' '}
          <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray', ml: '5px' }} />
        </Typography>
        {channelDetail?.statistics?.subscriberCount && (
          <Typography sx={{ fontSize: '15px', fontWeight: 500, color: 'gray' }}>
            {parseInt(channelDetail?.statistics?.subscriberCount).toLocaleString('en-US')} Subscribers
          </Typography>
        )}
      </CardContent>
    </Link>
  </Box>
);
};

export default ChannelCard;
