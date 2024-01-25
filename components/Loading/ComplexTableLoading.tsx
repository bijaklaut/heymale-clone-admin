import { Fragment } from "react";

const ComplexTableLoading = () => {
  const skeletonCell = "skeleton mx-auto h-8 w-auto rounded-full";

  return (
    <div className="max-w-[1920px]">
      <table data-theme={"nord"} className="table w-full rounded-md">
        <thead>
          <tr className="[&>td:last-of-type]:hidden [&>td:last-of-type]:md:table-cell [&>td]:pt-8">
            <td>
              <div className={skeletonCell}></div>
            </td>
            <td>
              <div className={skeletonCell}></div>
            </td>
            <td>
              <div className={skeletonCell}></div>
            </td>
            <td>
              <div className={skeletonCell}></div>
            </td>
          </tr>
        </thead>
        <tbody className="[&>tr:last-of-type>td]:pb-8 ">
          {[1, 2].map((num, count) => {
            return (
              <Fragment key={count}>
                <tr>
                  <td colSpan={4}>
                    <div className="skeleton mx-auto h-8 w-[95%] rounded-full"></div>
                  </td>
                </tr>
                {[1, 2, 3].map((num, i) => {
                  return (
                    <tr
                      key={i}
                      className="[&>td:last-of-type]:hidden [&>td:last-of-type]:md:table-cell"
                    >
                      <td>
                        <div className={skeletonCell}></div>
                      </td>
                      <td>
                        <div className={skeletonCell}></div>
                      </td>
                      <td>
                        <div className={skeletonCell}></div>
                      </td>
                      <td>
                        <div className={skeletonCell}></div>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComplexTableLoading;
