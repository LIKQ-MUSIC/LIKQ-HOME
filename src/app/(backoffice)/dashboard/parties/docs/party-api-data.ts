import { ApiEndpoint } from '@/components/common/ApiDocViewer/ApiDocViewer'

const PARTY_OBJECT_EXAMPLE = {
  id: 'party_01HK...',
  party_type: 'Legal',
  legal_name: 'LiKQ Music Co., Ltd.',
  display_name: 'LiKQ Music',
  tax_id: '012555...',
  address: '123 Music Ave, Bangkok',
  bank_info: {
    bank_name: 'KBANK',
    account_number: '123-4-56789-0',
    account_name: 'LiKQ Music'
  },
  created_at: '2024-01-18T12:00:00Z',
  updated_at: '2024-01-18T12:00:00Z'
}

export const PARTY_API_DOCS: ApiEndpoint[] = [
  {
    id: 'get-parties',
    method: 'GET',
    path: '/parties',
    title: 'List Parties',
    description: 'Retrieve a list of parties. Supports search and pagination.',
    authentication: true,
    permissions: ['parties:read'],
    queryParams: [
      {
        name: 'search',
        type: 'string',
        required: false,
        description: 'Search by legal name, display name, or tax ID'
      },
      {
        name: 'page',
        type: 'number',
        required: false,
        description: 'Page number for pagination'
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of items per page'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Paginated response',
        example: {
          data: [PARTY_OBJECT_EXAMPLE],
          meta: {
            total: 15,
            page: 1,
            limit: 10,
            totalPages: 2
          }
        }
      },
      {
        status: 200,
        description: 'List response (no pagination params)',
        example: [PARTY_OBJECT_EXAMPLE]
      }
    ]
  },
  {
    id: 'get-party-by-id',
    method: 'GET',
    path: '/parties/:id',
    title: 'Get Party by ID',
    description: 'Retrieve a single party by its ID.',
    authentication: true,
    permissions: ['parties:read'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'The ID of the party'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Party found',
        example: PARTY_OBJECT_EXAMPLE
      },
      {
        status: 404,
        description: 'Party not found',
        example: {
          error: 'Party not found'
        }
      }
    ]
  },
  {
    id: 'create-party',
    method: 'POST',
    path: '/parties',
    title: 'Create Party',
    description: 'Create a new party (Individual or Legal entity).',
    authentication: true,
    permissions: ['parties:create'],
    bodyParams: [
      {
        name: 'party_type',
        type: 'string',
        required: true,
        description: "'Individual' or 'Legal'"
      },
      {
        name: 'legal_name',
        type: 'string',
        required: true,
        description: 'Full legal name'
      },
      {
        name: 'display_name',
        type: 'string',
        required: false,
        description: 'Short or display name'
      },
      {
        name: 'tax_id',
        type: 'string',
        required: false,
        description: 'Tax Identification Number'
      },
      {
        name: 'address',
        type: 'string',
        required: false,
        description: 'Full address'
      },
      {
        name: 'bank_info',
        type: 'object',
        required: false,
        description: 'Bank account details (JSON)'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Party created successfully',
        example: PARTY_OBJECT_EXAMPLE
      }
    ]
  },
  {
    id: 'update-party',
    method: 'PUT',
    path: '/parties/:id',
    title: 'Update Party',
    description: 'Update an existing party details.',
    authentication: true,
    permissions: ['parties:update'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'The ID of the party to update'
      }
    ],
    bodyParams: [
      {
        name: 'party_type',
        type: 'string',
        required: false,
        description: "'Individual' or 'Legal'"
      },
      {
        name: 'legal_name',
        type: 'string',
        required: false,
        description: 'Full legal name'
      },
      {
        name: 'display_name',
        type: 'string',
        required: false,
        description: 'Short or display name'
      },
      {
        name: 'tax_id',
        type: 'string',
        required: false,
        description: 'Tax Identification Number'
      },
      {
        name: 'address',
        type: 'string',
        required: false,
        description: 'Full address'
      },
      {
        name: 'bank_info',
        type: 'object',
        required: false,
        description: 'Bank account details (JSON)'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Party updated successfully',
        example: { ...PARTY_OBJECT_EXAMPLE, display_name: 'Updated Name' }
      },
      {
        status: 404,
        description: 'Party not found',
        example: { error: 'Party not found' }
      }
    ]
  },
  {
    id: 'delete-party',
    method: 'DELETE',
    path: '/parties/:id',
    title: 'Delete Party',
    description: 'Delete a party permanently.',
    authentication: true,
    permissions: ['parties:delete'],
    pathParams: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'The ID of the party to delete'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Party deleted successfully',
        example: { success: true }
      },
      {
        status: 404,
        description: 'Party not found',
        example: { error: 'Party not found' }
      }
    ]
  }
]
