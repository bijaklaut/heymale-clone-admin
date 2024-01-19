const SidebarLoading = () => {
  return (
    <aside
      data-theme={"nord"}
      className="fixed left-0 right-0 top-0 z-10 h-[50px] w-full px-5 py-8 sm:right-auto sm:h-screen sm:w-[4rem] sm:min-w-[4rem] sm:px-2 sm:pb-2 sm:pt-8 lg:sticky"
    >
      <div className="skeleton absolute left-1/2 top-1/2 h-10 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:hidden"></div>
      <div className="hidden h-full sm:flex sm:flex-col sm:items-center sm:justify-between">
        <div>
          <div className="skeleton mx-auto h-7 w-[50px]"></div>
          <div className="mt-14 w-full">
            <div className="mt-5 flex flex-col items-center gap-y-5">
              <div className="skeleton h-8 w-8 rounded-md"></div>
              <div className="skeleton h-8 w-8 rounded-md"></div>
              <div className="skeleton h-8 w-8 rounded-md"></div>
            </div>
          </div>
          <div className="mt-14 w-full">
            <div className="mt-5 flex flex-col items-center gap-y-5">
              <div className="skeleton h-8 w-8 rounded-md"></div>
              <div className="skeleton h-8 w-8 rounded-md"></div>
              <div className="skeleton h-8 w-8 rounded-md"></div>
              <div className="skeleton h-8 w-8 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    </aside>
  );
};

export default SidebarLoading;
