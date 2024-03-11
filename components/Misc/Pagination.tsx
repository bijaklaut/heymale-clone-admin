import { Fragment, InputHTMLAttributes } from "react";
import { PaginationTypes } from "../../services/types";

interface ThisProps extends InputHTMLAttributes<HTMLButtonElement> {
  paginate: PaginationTypes;
}

const Pagination = ({ paginate, onClick }: ThisProps) => {
  return (
    <Fragment>
      {paginate.totalPages > 1 ? (
        <div className="mt-3 flex w-full justify-center">
          <div
            data-theme={"skies"}
            className="join items-center justify-center gap-x-2 bg-transparent first:rounded-l-lg last:rounded-r-lg"
          >
            {firstPage({ paginate, onClick })}
            {prevPage({ paginate, onClick })}
            <button className="btn btn-primary join-item btn-sm pointer-events-none text-white">
              {paginate.page}
            </button>
            {nextPage({ paginate, onClick })}
            {lastPage({ paginate, onClick })}
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

const firstPage = ({ paginate, onClick }: ThisProps) => {
  // 1 2(now) 3
  if (paginate.hasPrevPage && paginate.prevPage! - 1 == 1)
    return (
      <button className="btn join-item btn-sm" data-page={1} onClick={onClick}>
        1
      </button>
    );

  // 1 2 3(now)
  if (paginate.hasPrevPage && paginate.prevPage! - 2 == 1)
    return (
      <>
        <button
          className="btn join-item btn-sm"
          data-page={1}
          onClick={onClick}
        >
          1
        </button>
        <button
          className="btn join-item btn-sm"
          data-page={2}
          onClick={onClick}
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
          data-page={1}
          onClick={onClick}
        >
          1
        </button>
        <button className="btn join-item btn-sm pointer-events-none opacity-60">
          ...
        </button>
      </>
    );
};
const lastPage = ({ paginate, onClick }: ThisProps) => {
  if (paginate.hasNextPage && paginate.nextPage! + 1 == paginate.totalPages)
    return (
      <button
        className="btn join-item btn-sm"
        data-page={paginate.totalPages}
        onClick={onClick}
      >
        {paginate.totalPages}
      </button>
    );

  if (paginate.hasNextPage && paginate.nextPage! + 2 == paginate.totalPages)
    return (
      <>
        <button
          className="btn join-item btn-sm"
          data-page={paginate.totalPages - 1}
          onClick={onClick}
        >
          {paginate.totalPages - 1}
        </button>
        <button
          className="btn join-item btn-sm"
          data-page={paginate.totalPages}
          onClick={onClick}
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
          data-page={paginate.totalPages}
          onClick={onClick}
        >
          {paginate.totalPages}
        </button>
      </>
    );
};
const prevPage = ({ paginate, onClick }: ThisProps) => {
  if (paginate.hasPrevPage)
    return (
      <button
        className="btn join-item btn-sm"
        data-page={paginate.prevPage}
        onClick={onClick}
      >
        {paginate.prevPage}
      </button>
    );
};
const nextPage = ({ paginate, onClick }: ThisProps) => {
  if (paginate.hasNextPage)
    return (
      <button
        className="btn join-item btn-sm"
        data-page={paginate.nextPage}
        onClick={onClick}
      >
        {paginate.nextPage}
      </button>
    );
};

export default Pagination;
