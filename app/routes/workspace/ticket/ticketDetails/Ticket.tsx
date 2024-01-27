import emotionStyled from "@emotion/styled";
import {Box, Chip, Stack, TextField} from "@mui/material";
import {LoaderFunction, json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {Breadcrumbs} from "~/components/Breadcrumbs";
import {ExternalLabelCard} from "~/components/cards/ExternalLabelCard";
import {TicketInfo, findTicketById} from "~/server/db/ticketDb";
import {BodyText, H1} from "~/typography";
import {CardSubInfo} from "../../components/CardSubInfo";

export const loader: LoaderFunction = async ({params}) => {
  const {ticketId} = params
  if (!ticketId) {
    return json(`Error`)
  }
  const ticket = await findTicketById(ticketId)
  if (!ticket) {
    return json(`Error`)
  }
  return ticket
}

export default function Ticket() {
  const ticket = useLoaderData<TicketInfo>()
  
  return (
    <div>
      <H1>{ticket.title}</H1>
      <Breadcrumbs paths={[`e`, `E`]}/>
      <Container>
        <ExternalLabelCard label="Details">
          <Box display={`flex`}>
            <Description>{ticket.content}</Description>
            <Stack flex={1}>
              <CardSubInfo label="Priority" details={<Chip size="medium" label={ticket.priority}/>}/>
              <CardSubInfo label="Created Date" details={ticket.createdDate}/>
              {ticket.dueDate && <CardSubInfo label="Due Date" details={ticket.dueDate}/>}
            </Stack>
          </Box>
        </ExternalLabelCard>
        <Box display={`flex`} gap={`40px`}>
          <CommentsCard label="Comments">
            <Stack spacing={`20px`}>
              <ScrollContainer></ScrollContainer>
              <TextField
                variant="filled"
                placeholder="Comment here..."
                multiline
                rows={5}
              />
            </Stack>
          </CommentsCard>
          <HistoryCard label="History">
            <ScrollContainer></ScrollContainer>
          </HistoryCard>
        </Box>
      </Container>
    </div>
  )
}

const Description = emotionStyled(BodyText)({
  flex: 3,
})

const Container = emotionStyled.div({
  display: `flex`,
  gap: `40px`,
  flexDirection: `column`,
})

const CommentsCard = emotionStyled(ExternalLabelCard)({
  flex: 3,
})

const HistoryCard = emotionStyled(ExternalLabelCard)({
  flex: 1,
})

const ScrollContainer = emotionStyled.div({
  minHeight: `100px`,
  height: `100%`,
  maxHeight: `450px`,
  overflowY: `auto`,
})