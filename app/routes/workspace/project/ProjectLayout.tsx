import {BreadcrumbLink} from '~/typography';
import {CommonHandle} from '~/utils/CommonHandle';

export const handle: CommonHandle<null> = {
  breadcrumb: ({params, data}) => {
    const {userId} = params
    if (!userId) throw new Error(`Unexpected user id is undefined`)
    return <BreadcrumbLink to={`/workspace/${userId}/project`}>{`Project`}</BreadcrumbLink>
  }
}