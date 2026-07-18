import Badge from "./Badge";

type Column<T> = {
  key: keyof T;
  label: string;
  badge?: boolean;
};

export default function DataGrid<T extends Record<string, string | number>>({
  columns,
  data,
}: {
  columns: Column<T>[];
  data: T[];
}) {
  const badgeColor = (value: string) => {
    if (["Payée", "Validé", "Présent", "Disponible", "Livrée"].includes(value)) {
      return "green";
    }

    if (["En attente", "À déclarer", "Congé", "Stock faible"].includes(value)) {
      return "yellow";
    }

    if (["En retard", "Critique"].includes(value)) {
      return "red";
    }

    return "cyan";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 text-left text-sm text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="p-4">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t border-slate-100 hover:bg-slate-50">
              {columns.map((column) => {
                const value = row[column.key];

                return (
                  <td key={String(column.key)} className="p-4">
                    {column.badge ? (
                      <Badge color={badgeColor(String(value))}>
                        {String(value)}
                      </Badge>
                    ) : (
                      <span className="font-medium text-slate-700">
                        {String(value)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
