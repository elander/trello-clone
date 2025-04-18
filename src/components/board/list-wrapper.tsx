interface ListWrapperProps {
  children: React.ReactNode;
}

export function ListWrapper({ children }: ListWrapperProps) {
  return (
    <div className="h-full w-[272px] shrink-0 select-none">
      {children}
    </div>
  );
}
