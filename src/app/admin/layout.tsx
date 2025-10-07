import ProtectedPage from "@/components/protected";
import Providers from "@/components/providers";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return (
    <ProtectedPage role="admin">
      <Providers sidebar>{children}</Providers>
    </ProtectedPage>
  );
};

export default Layout;
