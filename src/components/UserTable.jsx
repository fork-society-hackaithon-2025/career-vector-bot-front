import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Search,
  Filter,
  Eye
} from 'lucide-react'
import { formatDate, getCategoryClass, getStatusInfo, formatUserName } from '../utils/formatters'

function UserTable({ users }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
        cell: ({ getValue }) => (
          <span className="font-mono text-sm text-gray-500">
            #{getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'username',
        header: 'User',
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatUserName(user)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {user.telegram_id}
                </div>
              </div>
            </div>
          )
        },
        enableSorting: true,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 80,
        cell: ({ getValue }) => (
          <span className="text-gray-600 dark:text-gray-400">
            {getValue()} years
          </span>
        ),
      },
      {
        accessorKey: 'language',
        header: 'Language',
        size: 80,
        cell: ({ getValue }) => {
          const flags = { ru: '🇷🇺', en: '🇺🇸', kz: '🇰🇿' }
          const lang = getValue()
          return (
            <span className="text-sm">
              {flags[lang] || '🌐'} {lang?.toUpperCase()}
            </span>
          )
        },
      },
      {
        accessorKey: 'is_completed',
        header: 'Status',
        cell: ({ row }) => {
          const user = row.original
          const status = getStatusInfo(user.is_completed, user.choices_count)
          return (
            <span className={`${status.class} flex items-center gap-1`}>
              <span>{status.icon}</span>
              <span className="font-medium">{status.text}</span>
            </span>
          )
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
          if (value === 'all') return true
          if (value === 'completed') return row.original.is_completed
          if (value === 'in_progress') return !row.original.is_completed && row.original.choices_count > 0
          if (value === 'not_started') return !row.original.is_completed && row.original.choices_count === 0
          return true
        },
      },
      {
        accessorKey: 'total_score',
        header: 'Score',
        cell: ({ row }) => {
          const user = row.original
          if (!user.is_completed) {
            return <span className="text-gray-400">-</span>
          }
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {user.total_score}
              </span>
              <span className="text-gray-400 text-sm">
                /{user.max_score}
              </span>
            </div>
          )
        },
        enableSorting: true,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const user = row.original
          if (!user.is_completed) {
            return <span className="text-gray-400">-</span>
          }
          return (
            <span className={getCategoryClass(user.category)}>
              {user.category}
            </span>
          )
        },
        enableSorting: true,
        filterFn: (row, id, value) => {
          if (value === 'all') return true
          return row.original.category === value
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Registration Date',
        cell: ({ getValue }) => (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(getValue())}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className="flex items-center gap-2">
              {user.is_completed ? (
                <Link
                  to={`/user/${user.id}`}
                  className="btn-primary text-xs py-1 px-2"
                >
                  <Eye className="w-3 h-3" />
                  Report
                </Link>
              ) : (
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Waiting
                </span>
              )}
            </div>
          )
        },
        enableSorting: false,
      },
    ],
    []
  )

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const categories = ['all', '0-24', '25-49', '50-73', '74-98']
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'not_started', label: 'Not Started' },
  ]

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          👥 All Users ({users.length})
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Search users..."
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={table.getColumn('is_completed')?.getFilterValue() ?? 'all'}
          onChange={(e) =>
            table.getColumn('is_completed')?.setFilterValue(e.target.value === 'all' ? undefined : e.target.value)
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={table.getColumn('category')?.getFilterValue() ?? 'all'}
          onChange={(e) =>
            table.getColumn('category')?.setFilterValue(e.target.value === 'all' ? undefined : e.target.value)
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Categories</option>
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category} points
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left py-4 px-4 font-medium text-gray-900 dark:text-white"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none hover:text-blue-600' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="w-4 h-4" />
                            ) : (
                              <ArrowUpDown className="w-4 h-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="table-row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {globalFilter || columnFilters.length > 0 ? (
            <>
              🔍 Users not found
              <div className="mt-2">
                <button
                  onClick={() => {
                    setGlobalFilter('')
                    setColumnFilters([])
                  }}
                  className="text-blue-600 hover:text-blue-500"
                >
                  Reset filters
                </button>
              </div>
            </>
          ) : (
            '📭 No users yet'
          )}
        </div>
      )}

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="btn-secondary text-sm py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn-secondary text-sm py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
              <span>Page</span>
              <strong className="text-gray-900 dark:text-gray-100">
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn-secondary text-sm py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="btn-secondary text-sm py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTable


