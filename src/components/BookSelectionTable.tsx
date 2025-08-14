import React from 'react';
import { Book } from '../types.ts';

interface BookSelectionTableProps {
  title: string;
  books: Book[];
  selection1: string | null;
  selection2: string | null;
  onSelect1: (code: string) => void;
  onSelect2: (code: string) => void;
}

const BookSelectionTable: React.FC<BookSelectionTableProps> = ({
  title,
  books,
  selection1,
  selection2,
  onSelect1,
  onSelect2,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-slate-700 mb-4">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full bg-white">
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Título do Livro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Editora
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Código
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                1ª Opção
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                2ª Opção
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {books.map((book) => (
              <tr key={book.code} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{book.publisher}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{book.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <input
                    type="radio"
                    name={`${title}-1`}
                    className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    checked={selection1 === book.code}
                    onChange={() => onSelect1(book.code)}
                    disabled={selection2 === book.code}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <input
                    type="radio"
                    name={`${title}-2`}
                    className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    checked={selection2 === book.code}
                    onChange={() => onSelect2(book.code)}
                    disabled={selection1 === book.code}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookSelectionTable;
