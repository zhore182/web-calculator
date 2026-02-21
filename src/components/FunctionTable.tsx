// Function table component showing x/y value pairs
export interface FunctionTableProps {
  data: Array<{ x: number; y: number | null }>;
  visible: boolean;
}

export function FunctionTable({ data, visible }: FunctionTableProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="function-table">
      <div className="function-table__container">
        <table>
          <thead>
            <tr>
              <th>x</th>
              <th>f(x)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.x.toFixed(2)}</td>
                <td className={row.y === null ? 'function-table__cell--undefined' : ''}>
                  {row.y === null ? 'undefined' : row.y.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
