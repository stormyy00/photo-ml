import Providers from "@/components/providers";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return <Providers sidebar>{children}</Providers>;
};

export default Layout;
