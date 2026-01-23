import { ApiEndpoint } from '@/components/common/ApiDocViewer/ApiDocViewer'

const QUOTATION_OBJECT_EXAMPLE = {
  id: 'quo_01HK...',
  quotation_number: 'Q-2024-001',

  contact_person_id: 'party_01HK...',
  bill_to_party_id: 'party_02HK...',
  approver_id: 'user_01HK...',
  customer_signatory_id: 'party_03HK...',

  issued_date: '2024-01-18T00:00:00Z',
  valid_until_date: '2024-02-18T00:00:00Z',
  approved_date: '2024-01-19T00:00:00Z',
  accepted_date: '2024-01-20T00:00:00Z',

  status: 'Draft',
  total_amount: 50000.0,
  currency: 'THB',
  items: [{ description: 'Service Fee', quantity: 1, price: 50000.0 }],
  created_at: '2024-01-18T12:00:00Z',
  updated_at: '2024-01-18T12:00:00Z'
}

export const QUOTATION_API_DOCS: ApiEndpoint[] = [
  {
    id: 'get-quotations',
    method: 'GET',
    path: '/quotations',
    title: 'List Quotations',
    description:
      'Retrieve a list of quotations. Supports search and pagination.',
    authentication: true,
    permissions: ['quotations:read'],
    queryParams: [
      {
        name: 'search',
        type: 'string',
        required: false,
        description: 'Search by quotation number'
      },
      {
        name: 'page',
        type: 'number',
        required: false,
        description: 'Page number'
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Items per page'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Paginated response',
        example: {
          data: [QUOTATION_OBJECT_EXAMPLE],
          meta: {
            total: 10,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        }
      }
    ]
  },
  {
    id: 'get-quotation-by-id',
    method: 'GET',
    path: '/quotations/:id',
    title: 'Get Quotation by ID',
    description: 'Retrieve a single quotation by its ID.',
    authentication: true,
    permissions: ['quotations:read'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Quotation ID'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Quotation found',
        example: QUOTATION_OBJECT_EXAMPLE
      },
      {
        status: 404,
        description: 'Quotation not found',
        example: { error: 'Quotation not found' }
      }
    ]
  },
  {
    id: 'create-quotation',
    method: 'POST',
    path: '/quotations',
    title: 'Create Quotation',
    description: 'Create a new quotation.',
    authentication: true,
    permissions: ['quotations:create'],
    bodyParams: [
      {
        name: 'quotation_number',
        type: 'string',
        required: true,
        description: 'Unique quotation number'
      },
      {
        name: 'contact_person_id',
        type: 'string',
        required: false,
        description: 'ID of Contact Person (Party/User)'
      },
      {
        name: 'bill_to_party_id',
        type: 'string',
        required: false,
        description: 'ID of Bill To Party'
      },
      {
        name: 'approver_id',
        type: 'string',
        required: false,
        description: 'ID of Approver'
      },
      {
        name: 'customer_signatory_id',
        type: 'string',
        required: false,
        description: 'ID of Customer Signatory'
      },
      {
        name: 'issued_date',
        type: 'string',
        required: false,
        description: 'ISO Date string'
      },
      {
        name: 'valid_until_date',
        type: 'string',
        required: false,
        description: 'ISO Date string'
      },
      {
        name: 'approved_date',
        type: 'string',
        required: false,
        description: 'ISO Date string'
      },
      {
        name: 'accepted_date',
        type: 'string',
        required: false,
        description: 'ISO Date string'
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: "'Draft', 'Sent', etc."
      },
      {
        name: 'total_amount',
        type: 'number',
        required: true,
        description: 'Total amount'
      },
      {
        name: 'currency',
        type: 'string',
        required: false,
        description: 'Currency code (default THB)'
      },
      {
        name: 'items',
        type: 'array',
        required: false,
        description: 'Array of line items'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Quotation created',
        example: QUOTATION_OBJECT_EXAMPLE
      }
    ]
  },
  {
    id: 'update-quotation',
    method: 'PUT',
    path: '/quotations/:id',
    title: 'Update Quotation',
    description: 'Update an existing quotation.',
    authentication: true,
    permissions: ['quotations:update'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Quotation ID'
      }
    ],
    bodyParams: [
      {
        name: 'quotation_number',
        type: 'string',
        required: false,
        description: 'Unique quotation number'
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'New status'
      },
      {
        name: 'total_amount',
        type: 'number',
        required: false,
        description: 'Total amount'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Quotation updated',
        example: { ...QUOTATION_OBJECT_EXAMPLE, status: 'Accepted' }
      }
    ]
  },
  {
    id: 'delete-quotation',
    method: 'DELETE',
    path: '/quotations/:id',
    title: 'Delete Quotation',
    description: 'Delete a quotation.',
    authentication: true,
    permissions: ['quotations:delete'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Quotation ID'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Quotation deleted',
        example: { success: true }
      }
    ]
  }
]
