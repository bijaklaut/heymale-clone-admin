import { Dispatch, Fragment, SetStateAction } from "react";
import { pageHandler } from "../../services/helper";
import { PaginationTypes } from "../../services/types";

interface ThisProps {
  paginate: PaginationTypes;
  setPage: Dispatch<SetStateAction<number>>;
  // pageHandler?: (page: number | null)=> void;
}

const firstPage = ({ paginate, setPage }: ThisProps) => {
  // 1 2(now) 3
  if (paginate.hasPrevPage && paginate.prevPage! - 1 == 1)
    return (
      <button
        className="btn join-item btn-sm"
        onClick={() => pageHandler(1, setPage)}
      >
        1
      </button>
    );

  // 1 2 3(now)
  if (paginate.hasPrevPage && paginate.prevPage! - 2 == 1)
    return (
      <>
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(1, setPage)}
        >
          1
        </button>
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(2, setPage)}
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
          onClick={() => pageHandler(1, setPage)}
        >
          1
        </button>
        <button className="btn join-item btn-sm pointer-events-none opacity-60">
          ...
        </button>
      </>
    );
};
const lastPage = ({ paginate, setPage }: ThisProps) => {
  if (paginate.hasNextPage && paginate.nextPage! + 1 == paginate.totalPages)
    return (
      <button
        className="btn join-item btn-sm"
        onClick={() => pageHandler(paginate.totalPages, setPage)}
      >
        {paginate.totalPages}
      </button>
    );

  if (paginate.hasNextPage && paginate.nextPage! + 2 == paginate.totalPages)
    return (
      <>
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(paginate.totalPages - 1, setPage)}
        >
          {paginate.totalPages - 1}
        </button>
        <button
          className="btn join-item btn-sm"
          onClick={() => pageHandler(paginate.totalPages, setPage)}
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
          onClick={() => pageHandler(paginate.totalPages, setPage)}
        >
          {paginate.totalPages}
        </button>
      </>
    );
};
const prevPage = ({ paginate, setPage }: ThisProps) => {
  if (paginate.hasPrevPage)
    return (
      <button
        className="btn join-item btn-sm"
        onClick={() => pageHandler(paginate.prevPage!, setPage)}
      >
        {paginate.prevPage}
      </button>
    );
};
const nextPage = ({ paginate, setPage }: ThisProps) => {
  if (paginate.hasNextPage)
    return (
      <button
        className="btn join-item btn-sm"
        onClick={() => pageHandler(paginate.nextPage!, setPage)}
      >
        {paginate.nextPage}
      </button>
    );
};

const Pagination = ({ paginate, setPage }: ThisProps) => {
  return (
    <Fragment>
      {paginate.totalPages > 1 ? (
        <div className="mt-3 flex w-full justify-center">
          <div
            data-theme={"nord"}
            className="join items-center justify-center gap-x-2 bg-transparent first:rounded-l-lg last:rounded-r-lg"
          >
            {firstPage({ paginate, setPage })}
            {prevPage({ paginate, setPage })}
            <button className="btn btn-primary join-item btn-sm pointer-events-none text-white">
              {paginate.page}
            </button>
            {nextPage({ paginate, setPage })}
            {lastPage({ paginate, setPage })}
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Pagination;
