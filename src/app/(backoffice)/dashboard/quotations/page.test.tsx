import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import QuotationsPage from './page'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { revalidateQuotations } from './actions'

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn()
}))

jest.mock('./actions', () => ({
  revalidateQuotations: jest.fn()
}))

// Use relative paths to avoid alias resolution issues in Jest
jest.mock('../../../../components/dashboard/PermissionGate', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

jest.mock('../../../../hooks/use-pagination', () => ({
  usePagination: jest.fn().mockReturnValue({
    page: 1,
    limit: 10,
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    setPage: jest.fn(),
    setLimit: jest.fn()
  })
}))

jest.mock('../../../../ui/Button', () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
    className
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}))

jest.mock('../../../../utils/date', () => ({
  formatDateShort: (date: string) => date
}))

jest.mock('../../../../lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    delete: jest.fn()
  }
}))

// Mock other UI components if needed. DataTable renders children so let's try not mocking first.
// If actual DataTable fails due to imports, mock it.
jest.mock('../../../../components/dashboard/DataTable', () => {
  const ActualDataTable = jest.requireActual(
    '../../../../components/dashboard/DataTable'
  )
  return {
    ...ActualDataTable,
    // Mock subcomponents if necessary, or just rely on actual if they are simple
    // If DataTable imports complex stuff, might need mocking.
    // Let's mock DataTable completely for simpler unit test of PAGE logic.
    DataTable: ({
      column,
      data,
      emptyMessage,
      errorMessage,
      isLoading,
      error,
      headerActions,
      searchSlot
    }: any) => {
      if (isLoading) return <div>Loading...</div>
      if (error) return <div>{errorMessage}</div>
      if (!data || data.length === 0) return <div>{emptyMessage}</div>
      return (
        <div>
          <div>Quotations</div>
          {headerActions}
          {searchSlot}
          <table>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.quotation_number}</td>
                  <td>{item.status}</td>
                  <td>{item.total_amount}</td>
                  <td>
                    <button
                      title="Delete"
                      onClick={() => {
                        // Simulate delete call.
                        // The page passes handleDelete to ActionButton.
                        // Here we simulate clicking the delete button in ActionButton
                        // But ActionButton is inside Columns definition which is passed to DataTable.
                        // Since we mocked DataTable to NOT use columns prop for rendering rows (simplified above),
                        // we can't easily click the delete button defined in columns.
                        // Better approach: Test columns definition separately or mock DataTable to render columns?
                        // Actually, testing the page logic requires interacting with the delete button.
                        // So I should render the actual DataTable or at least enough of it.
                        // Let's try mocking ActionButton instead?
                        // If I use real DataTable, I need to mock its dependencies.
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    ActionButton: ({ onClick, title }: any) => (
      <button onClick={onClick} title={title}>
        {title}
      </button>
    ),
    StatusBadge: ({ status }: any) => <span>{status}</span>
  }
})

// Actually, mocking DataTable to render columns properly is hard.
// Instead, let's mock DataTable to EXPOSE the delete function or render the columns provided.
// Or just import the real DataTable.
// If real DataTable works (simple prop rendering), better use it.
// Let's trust `simple.test.tsx` passed, so imports work if paths are correct.
// I'll try using REAL DataTable (unmocked) but mocking its sub-dependencies?
// No, let's mock DataTable to a simple implementation that renders the data and actions using the columns prop if possible.
// But `columns` is a prop.
// Simpler: Mock `DataTable` to just render `data` in a way we can assert, and expose a 'delete' button for each item if we can access the delete handler.
// But `handleDelete` is internal to `QuotationsPage`. It's passed to `columns`.
// If we mock `DataTable`, we can't easily execute `columns` render functions unless we implement that logic.
// So let's try strict unit testing: test `DataTable` separately, and test `QuotationsPage` by verifying it passes correct props to `DataTable`.
// But user wants "test for this feature". Integration test is better.
// I will attempt to use the REAL DataTable by NOT mocking it initially.
// If it fails, I'll fallback to mock.
jest.unmock('../../../../components/dashboard/DataTable')

const mockQuotations = [
  {
    id: '1',
    quotation_number: 'QT-2023-001',
    status: 'sent',
    total_amount: 1000,
    currency: 'THB',
    issued_date: '2023-01-01',
    valid_until_date: '2023-01-15',
    items: []
  },
  {
    id: '2',
    quotation_number: 'QT-2023-002',
    status: 'draft',
    total_amount: 500,
    currency: 'USD',
    issued_date: '2023-02-01',
    valid_until_date: '2023-02-15',
    items: []
  }
]

describe('QuotationsPage', () => {
  const mockInvalidateQueries = jest.fn()
  const mockMutate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries
    })
    ;(useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate
    })
  })

  it('renders loading state correctly', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    })

    render(<QuotationsPage />)
    const elements = screen.getAllByText('Quotations')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('renders data correctly', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockQuotations,
        meta: {
          total: 2,
          limit: 10,
          page: 1,
          pages: 1
        }
      },
      isLoading: false,
      isError: false
    })

    render(<QuotationsPage />)

    expect(screen.getAllByText('QT-2023-001')[0]).toBeInTheDocument()
    expect(screen.getAllByText('QT-2023-002')[0]).toBeInTheDocument()
    // Check formatted price. formatCurrency uses Intl, which might output non-breaking spaces.
    // Use regex to be safe.
    expect(screen.getAllByText(/1,000/)[0]).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    })

    render(<QuotationsPage />)

    expect(
      screen.getAllByText('Failed to load quotations. Please try again.')[0]
    ).toBeInTheDocument()
  })

  it('renders empty state correctly', () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { data: [], meta: { total: 0, limit: 10, page: 1, pages: 1 } },
      isLoading: false,
      isError: false
    })

    render(<QuotationsPage />)

    expect(
      screen.getAllByText(
        'No quotations found. Create your first quotation to get started.'
      )[0]
    ).toBeInTheDocument()
  })

  it('handles search input', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { data: [], meta: { total: 0 } },
      isLoading: false,
      isError: false
    })

    render(<QuotationsPage />)
    // There's only one search slot passed to DataTable, and DataTable renders it once in "filter-bar"
    // Wait, let's check DataTable. Search slot is rendered once: {searchSlot && <div className="filter-bar">{searchSlot}</div>}
    // So getByPlaceholderText should be fine.
    const searchInput = screen.getByPlaceholderText(
      'Search by quotation number...'
    )
    fireEvent.change(searchInput, { target: { value: 'test-query' } })

    expect(searchInput).toHaveValue('test-query')

    // Verify useQuery called with new key
    // Since verify happen after render, last call should have search query
    expect(useQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['test-query'])
      })
    )
  })

  it('handles delete action', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockQuotations,
        meta: { total: 2 }
      },
      isLoading: false,
      isError: false
    })

    // Mock window.confirm
    const confirmSpy = jest
      .spyOn(window, 'confirm')
      .mockImplementation(() => true)

    render(<QuotationsPage />)

    // Delete button usually has title "Delete" in ActionButton
    const deleteButtons = screen.getAllByTitle('Delete')

    // In actual DataTable, ActionButton renders a button or link.
    // If real DataTable is used, and ActionButton renders valid HTML button, this works.
    fireEvent.click(deleteButtons[0])

    expect(confirmSpy).toHaveBeenCalled()
    expect(mockMutate).toHaveBeenCalledWith('1')

    confirmSpy.mockRestore()
  })
})
