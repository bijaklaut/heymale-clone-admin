const SidebarLoading = () => {
  return (
    <aside
      data-theme={"nord"}
      className="fixed left-0 top-0 z-10 h-screen w-[17rem] px-5 py-7"
    >
      <div className="skeleton mx-auto h-14 w-[200px]"></div>
      <div className="mt-14 w-full">
        <div className="skeleton h-6 w-[150px] rounded-full"></div>
        <div className="mt-5 flex flex-col gap-y-5">
          <div className="skeleton h-6 w-full rounded-full"></div>
          <div className="skeleton h-6 w-full rounded-full"></div>
          <div className="skeleton h-6 w-full rounded-full"></div>
          <div className="skeleton h-6 w-full rounded-full"></div>
        </div>
      </div>
      <div className="mt-14 w-full">
        <div className="skeleton h-6 w-[150px] rounded-full"></div>
        <div className="mt-5 flex flex-col gap-y-5">
          <div className="skeleton h-6 w-full rounded-full"></div>
          <div className="skeleton h-6 w-full rounded-full"></div>
          <div className="skeleton h-6 w-full rounded-full"></div>
          <div className="skeleton h-6 w-full rounded-full"></div>
        </div>
      </div>
      <div className="absolute bottom-0 flex w-full items-center gap-x-4 pb-3">
        <div className="skeleton h-12 w-12 rounded-full"></div>
        <div className="skeleton h-6 w-[150px] rounded-full"></div>
      </div>
    </aside>
  );
};

export default SidebarLoading;
