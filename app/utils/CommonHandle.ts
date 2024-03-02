export type CommonHandle<T> = {
  breadcrumb?: (props: BreadcrumbProps<T>) => React.JSX.Element;
}

type BreadcrumbProps<T> = {
  params: Record<string, string | undefined>;
  data?: T | null;
}