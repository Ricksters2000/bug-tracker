import 'aos/dist/aos.css';
import React from 'react';
import emotionStyled from '@emotion/styled';
import AOS from 'aos';
import {Box, Grid, Typography} from '@mui/material';
import {MainFeatureCard} from './components/MainFeatureCard';
import {SubFeatureCard} from './components/SubFeatureCard';
import {LinksFunction} from '@remix-run/node';
import {cssBundleHref} from '@remix-run/css-bundle';
import {LandingPageButtonGroup} from './components/buttons/LandingPageButtonGroup';
import {Footer} from '~/components/Footer';
import {PeopleIcon} from '~/assets/icons/PeopleIcon';
import {AccountTreeIcon} from '~/assets/icons/AccountTreeIcon';
import {AnalyticsIcon} from '~/assets/icons/AnalyticsIcon';
import {EngineeringIcon} from '~/assets/icons/EngineeringIcon';
import {BugReportIcon} from '~/assets/icons/BugReportIcon';
import {InterfaceIcon} from '~/assets/icons/InterfaceIcon';
import {FilterAltIcon} from '~/assets/icons/FilterAltIcon';
import {ImageList} from './components/ImageList';
import backgroundUrl from '~/assets/bg.jpeg';
import dashboardUrl from '~/assets/previewWorkspaceImages/dashboard.png';
import projectListUrl from '~/assets/previewWorkspaceImages/projectList.png';
import projectPageUrl from '~/assets/previewWorkspaceImages/projectPage.png'
import ticketListUrl from '~/assets/previewWorkspaceImages/ticketList.png';
import userListUrl from '~/assets/previewWorkspaceImages/userList.png';

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref
      ? [{rel: `stylesheet`, href: cssBundleHref}]
      : []
    )
  ]
}

export default function Index() {
  React.useEffect(() => {
    AOS.init({
      once: true,
      easing: `ease-in-out`,
      duration: 500,
      delay: 50,
    })
  }, [])

  return (
    <div>
      <main>
        <Box>
          <LandingPageBackground>
            <HeadingContainer>
              <Grid container marginTop={`-32px`} marginLeft={`-32px`} width={`calc(100% + 32px)`} spacing={4}>
                <Grid item xs={12} md={4} height={`100vh`} display={`flex`} flexDirection={`column`} justifyContent={`center`}>
                  <Box data-aos="fade-right">
                    <Typography marginBottom={`16px`} variant='h2' fontWeight={700} color={`#fff`}>
                      The bug tracker tool to manage all your projects
                    </Typography>
                    <Typography marginBottom={`24px`} fontSize={`1.25rem`} lineHeight={1.6} color={`#fff`}>
                      Easily track all your tasks andbugs between an unlimited amount of projects.
                    </Typography>
                    <LandingPageButtonGroup/>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8} display={`flex`} flexWrap={`nowrap`}>
                  <ImageList urls={[dashboardUrl, userListUrl]}/>
                  <ImageList urls={[projectPageUrl, projectListUrl]}/>
                  <ImageList urls={[ticketListUrl]}/>
                </Grid>
              </Grid>
            </HeadingContainer>
          </LandingPageBackground>
          <LayoutBox>
            <Box>
              <Grid container marginTop={`-16px`} marginLeft={`-16px`} width={`calc(100% + 16px)`} spacing={2}>
                <Grid item xs={12} md={4}>
                  <MainFeatureCard
                    icon={<InterfaceIcon/>}
                    title='Responsive user-friendly UI'
                    description='Simple and easy to understand user-interface which is also responsive to be used on any screen size.'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MainFeatureCard
                    icon={<PeopleIcon/>}
                    title='Develop Together'
                    description='Manage and coordinate your team to work together and focus on the tasks needed to be done.'
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MainFeatureCard
                    icon={<AccountTreeIcon/>}
                    title='Manage Projects'
                    description='Create many projects while being able to assign users and create tickets for the projects.'
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
                      icon={<AnalyticsIcon/>}
                      title='Analytics'
                      description='View analytics for all your projects at the same time and get an understanding as to which ones need more focus on.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<PeopleIcon/>}
                      title='Assigning Users'
                      description='Assign users to tickets and projects to simply allow them to focus on specific task needed to be done.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<EngineeringIcon/>}
                      title='Manage User Roles'
                      description='Give users their own roles to limit the features they have access to in the team.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<FilterAltIcon/>}
                      title='Advanced Ticket Filter'
                      description='View tickets from all your projects with various filters to easily find that important ticket you want.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<AccountTreeIcon/>}
                      title='Create Projects'
                      description='Create many projects while being able to assign users and create tickets for the projects.'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <SubFeatureCard
                      icon={<BugReportIcon/>}
                      title='Create Tickets'
                      description='Make and assign tickets to devs while being able to track unassigned tickets for projects.'
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </LayoutBox>
          <Footer/>
        </Box>
      </main>
    </div>
  )
}

const LandingPageBackground = emotionStyled(Box)({
  backgroundImage: `url(${backgroundUrl})`,
  backgroundSize: `cover`,
  overflow: `hidden`,
  height: `100vh`,
  position: `relative`,
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
  height: `100vh`,
  zIndex: 2,
  paddingTop: `0 !important`,
  paddingBottom: `0 !important`,
})