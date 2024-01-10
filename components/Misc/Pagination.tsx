import { Fragment } from "react";

interface ThisProps {
  paginate: {
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
  pageHandler(page: number | null): void;
}

const Pagination = ({ paginate, pageHandler }: ThisProps) => {
  const firstPage = ({ paginate, pageHandler }: ThisProps) => {
    // 1 2(now) 3
    if (paginate.hasPrevPage && paginate.prevPage! - 1 == 1)
      return (
        <button className="btn join-item btn-sm" onClick={() => pageHandler(1)}>
          1
        </button>
      );

    // 1 2 3(now)
    if (paginate.hasPrevPage && paginate.prevPage! - 2 == 1)
      return (
        <>
          <button
            className="btn join-item btn-sm"
            onClick={() => pageHandler(1)}
          >
            1
          </button>
          <button
            className="btn join-item btn-sm"
            onClick={() => pageHandler(2)}
          >
            2
          </button>
        </>
      );

    // 1 ... 4 5
    if (paginate.hasPrevPage && paginate.prevPage != 1)
      return (
        <>
          <button
            className="btn join-item btn-sm"
            onClick={() => pageHandler(1)}
          >
            1
          </button>
          <button className="btn join-item btn-sm pointer-events-none opacity-60">
            ...
          </button>
        </>
      );
  };
  const lastPage = ({ paginate, pageHandler }: ThisProps) => {
    if (paginate.hasNextPage && paginate.nextPage! + 1 == paginate.totalPages)
      return (
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(paginate.totalPages)}
        >
          {paginate.totalPages}
        </button>
      );

    if (paginate.hasNextPage && paginate.nextPage! + 2 == paginate.totalPages)
      return (
        <>
          <button
            className="btn join-item btn-sm"
            onClick={() => pageHandler(paginate.totalPages - 1)}
          >
            {paginate.totalPages - 1}
          </button>
          <button
            className="btn join-item btn-sm"
            onClick={() => pageHandler(paginate.totalPages)}
          >
            {paginate.totalPages}
          </button>
        </>
      );

    if (paginate.hasNextPage && paginate.nextPage != paginate.totalPages)
      return (
        <>
          <button className="btn join-item btn-sm pointer-events-none opacity-60">
            ...
          </button>
          <button
            className="btn join-item btn-sm"
            onClick={() => pageHandler(paginate.totalPages)}
          >
            {paginate.totalPages}
          </button>
        </>
      );
  };
  const prevPage = ({ paginate, pageHandler }: ThisProps) => {
    if (paginate.hasPrevPage)
      return (
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(paginate.prevPage)}
        >
          {paginate.prevPage}
        </button>
      );
  };
  const nextPage = ({ paginate, pageHandler }: ThisProps) => {
    if (paginate.hasNextPage)
      return (
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(paginate.nextPage)}
        >
          {paginate.nextPage}
        </button>
      );
  };

  return (
    <Fragment>
      {paginate.totalPages > 1 ? (
        <div className="mt-3 flex w-full justify-center">
          <div
            data-theme={"nord"}
            className="join items-center justify-center gap-x-2 bg-transparent first:rounded-l-lg last:rounded-r-lg"
          >
            {firstPage({ paginate, pageHandler })}
            {prevPage({ paginate, pageHandler })}
            <button className="btn btn-primary join-item btn-sm pointer-events-none text-white">
              {paginate.page}
            </button>
            {nextPage({ paginate, pageHandler })}
            {lastPage({ paginate, pageHandler })}
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Pagination;
