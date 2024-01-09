const ComplexTableLoading = () => {
  return (
    <div className=" max-w-5xl">
      <table data-theme={"nord"} className="table w-full rounded-md">
        <thead>
          <tr>
            <td className="pt-8">
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
            <td className="pt-8">
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
            <td className="pt-8">
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
            <td className="pt-8">
              <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
            </td>
          </tr>
        </thead>
        <tbody className="[&>tr:last-of-type>td]:pb-8 ">
          <tr>
            <td colSpan={4}>
              <div className="skeleton mx-auto h-8 w-[95%] rounded-full"></div>
            </td>
          </tr>
          {[1, 2, 3].map((num, i) => {
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
                <td>
                  <div className="skeleton mx-auto h-8 w-auto rounded-full"></div>
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={4}>
              <div className="skeleton mx-auto h-8 w-[95%] rounded-full"></div>
            </td>
          </tr>
          {[1, 2, 3].map((num, i) => {
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

export default ComplexTableLoading;
