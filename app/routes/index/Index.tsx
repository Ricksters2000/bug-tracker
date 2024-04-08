import 'aos/dist/aos.css';
import React from 'react';
import emotionStyled from '@emotion/styled';
import AOS from 'aos';
import {Box, Button, Grid, Typography} from '@mui/material';

export default function Index() {
  React.useEffect(() => {
    AOS.init({
      once: true,
    })
  }, [])

  return (
    <div>
      <main>
        <Box bgcolor={`rgb(243, 246, 255)`} position={`relative`}>
          <HeadingContainer>
            <Grid container marginTop={`-32px`} marginLeft={`-32px`} width={`calc(100% + 32px)`} spacing={4}>
              <Grid item xs={12} md={6}>
                <Box data-aos="fade-right">
                  <Typography marginBottom={`16px`} variant='h2'>Easily manage your projects with Project Flow</Typography>
                  <Typography marginBottom={`24px`}>Description for thing</Typography>
                  <Box>
                    <Button variant='outlined'>Start Now</Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item container justifyContent={`center`} xs={12} md={6} alignContent={`center`} data-aos="fade-left">
                <HeadingImage/>
              </Grid>
            </Grid>
          </HeadingContainer>
          <ClipBackground>
            <polygon fill='#fff' points='0,273 1921,273 1921,0'/>
          </ClipBackground>
        </Box>
      </main>
    </div>
  )
}

const ClipBackground = emotionStyled(`svg`)({
  position: `absolute`,
  width: `100%`,
  left: 0,
  bottom: 0,
  right: 0,
  zIndex: 1,
  height: `35%`,  
})

const HeadingContainer = emotionStyled(Box)({
  width: `100%`,
  margin: `0 auto`,
  padding: `0 16px`,
  position: `relative`,
  zIndex: 2,

  '@media (min-width: 900px)': {
    maxWidth: 1236,
    paddingTop: 64,
    paddingBottom: 64,
  },

  '@media (min-width: 600px)': {
    maxWidth: 720,
    paddingTop: 48,
    paddingBottom: 48,
  }
})

const HeadingImage = emotionStyled(`img`)({
  height: '100%',
  width: '100%',
  boxShadow: 'rgba(140, 152, 164, 0.125) 0px 6px 24px 0px',
  borderRadius: '16px',
  maxWidth: '600px',
})