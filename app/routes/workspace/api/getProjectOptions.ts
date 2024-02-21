import {ActionFunction, json} from "@remix-run/node";
import {findProjectOptionsByCompanyId} from "~/server/db/projectDb";

export const action: ActionFunction = async ({request}) => {
  const {companyId} = await request.json()
  const projectOptions = await findProjectOptionsByCompanyId(companyId)
  return json(projectOptions)
}