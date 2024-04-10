import aosCss from 'aos/dist/aos.css';
import React from 'react';
import emotionStyled from '@emotion/styled';
import AOS from 'aos';
import {Box, Button, Grid, Typography} from '@mui/material';
import {MainFeatureCard} from './components/MainFeatureCard';
import {UserIcon} from '~/assets/icons/UserIcon';
import {SubFeatureCard} from './components/SubFeatureCard';
import {LinksFunction} from '@remix-run/node';

export default function Index() {
  React.useEffect(() => {
    AOS.init({
      once: true,
    })
  }, [])

  return (
    <div>
      <main>
        <Box>
          <Box bgcolor={`rgb(243, 246, 255)`} position={`relative`}>
            <HeadingContainer>
              <Grid container marginTop={`-32px`} marginLeft={`-32px`} width={`calc(100% + 32px)`} spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box data-aos="fade-right">
                    <Typography marginBottom={`16px`} variant='h2' fontWeight={700}>
                      The bug tracker tool to manage all your projects
                    </Typography>
                    <Typography marginBottom={`24px`} fontSize={`1.25rem`} lineHeight={1.6}>
                      Easily track all your tasks andbugs between an unlimited amount of projects.
                    </Typography>
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
            <ClipBackground preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' x={`0px`} y={`0px`} viewBox='0 0 1921 273'>
              <polygon fill='#fff' points='0,273 1921,273 1921,0'/>
            </ClipBackground>
          </Box>
          <LayoutBox>
            <Box>
              <Grid container marginTop={`-16px`} marginLeft={`-16px`} width={`calc(100% + 16px)`} spacing={2}>
                <Grid item xs={12} md={4}>
                  <MainFeatureCard
                    icon={<UserIcon/>}
                    title='Responsive user-friendly UI'
                    description='Simple and easy to understand user-interface which is also responsive to be used on any screen size.'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MainFeatureCard
                    icon={<UserIcon/>}
                    title='Lorum Ipsum'
                    description='Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum '
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MainFeatureCard
                    icon={<UserIcon/>}
                    title='Lorum Ipsum'
                    description='Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum'
                  />
                </Grid>
              </Grid>
            </Box>
          </LayoutBox>
          <LayoutBox>
            <Box>
              <Box marginBottom={`32px`}>
                <Typography fontWeight={500} textTransform={`uppercase`} color={`rgb(86, 89, 115)`} textAlign={`center`} marginBottom={`0.35rem`}>
                  Features
                </Typography>
                <Typography variant='h3' marginBottom={`0.35rem`}>
                  The powerful and flexible tool for managing projects
                </Typography>
                <Typography fontSize={`1.25rem`} textAlign={`center`} color={`rgb(86, 89, 115)`}>
                  Manage a limitless amount of projects and many more!
                </Typography>
              </Box>
              <Box marginTop={`48px`}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<UserIcon/>}
                      title='Analytics'
                      description='View analytics for all your projects at the same time and get an understanding as to which ones need more focus on.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<UserIcon/>}
                      title='Assigning Users'
                      description='Assign users to tickets and projects to simply allow them to focus on specific task needed to be done.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<UserIcon/>}
                      title='Manage User Roles'
                      description='Give users their own roles to limit the features they have access to in the team.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<UserIcon/>}
                      title='Advanced Ticket Filter'
                      description='Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<UserIcon/>}
                      title='Lorum Ipsum'
                      description='Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<UserIcon/>}
                      title='Lorum Ipsum'
                      description='Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum Lorum Ipsum'
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </LayoutBox>
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

const LayoutBox = emotionStyled(Box)({
  margin: `0 auto`,
  padding: `0 16px`,

  '@media (min-width: 0px)': {
    paddingTop: 32,
    paddingBottom: 32,
  },

  '@media (min-width: 600px)': {
    maxWidth: 720,
    paddingTop: 48,
    paddingBottom: 48,
  },
  
  '@media (min-width: 900px)': {
    maxWidth: 1236,
    paddingTop: 64,
    paddingBottom: 64,
  },
})

const HeadingContainer = emotionStyled(LayoutBox)({
  width: `100%`,
  position: `relative`,
  zIndex: 2,
})

const HeadingImage = emotionStyled(`img`)({
  height: '100%',
  width: '100%',
  boxShadow: 'rgba(140, 152, 164, 0.125) 0px 6px 24px 0px',
  borderRadius: '16px',
  maxWidth: '600px',
})