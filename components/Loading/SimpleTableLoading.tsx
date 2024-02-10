const SimpleTableLoading = () => {
  return (
    <div className="w-full">
      <table data-theme={"nord"} className="table w-full rounded-md">
        <thead className="[&>tr>td:last-of-type]:max-sm:hidden [&>tr>td]:pt-8">
          <tr>
            <td>
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
            <td>
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
            <td>
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
          </tr>
        </thead>
        <tbody className="[&>tr:last-of-type>td]:pb-8 [&>tr>td:last-of-type]:max-sm:hidden">
          {[1, 2, 3, 4, 5].map((num, i) => {
            return (
              <tr key={i}>
                <td>
                  <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
                </td>
                <td>
                  <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
                </td>
                <td>
                  <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTableLoading;
