function AnalyticsTable({ data }) {
    if (!data) return null;

    return (
        <div className="card bg-dark text-white mt-3">
            <div className="card-header">
                <h5>{data.title}</h5>
            </div>

            <div className="card-body">
                <table className="table table-dark table-hover">

                    <thead>
                        <tr>{/* Render table headers dynamically based on the columns in the data */}
                            {data.columns.map((column, index) => (
                                <th key={index}>
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                            {/* Render table rows dynamically based on the rows in the data */}
                        {data.rows.map((row, rowIndex) => (

                            <tr key={rowIndex}>

                                {row.map((cell, cellIndex) => (

                                    <td key={cellIndex}>
                                        {cell}
                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default AnalyticsTable;