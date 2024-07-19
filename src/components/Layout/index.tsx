import TopBar from "@/components/Layout/TopBar";

export interface ILayoutProps {
  children: JSX.Element;
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <div className="">
      <TopBar />
      <div>{children}</div>
    </div>
  );
}
