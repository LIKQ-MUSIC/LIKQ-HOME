import { ApiEndpoint } from '@/components/common/ApiDocViewer/ApiDocViewer'

export const PDF_API_DOCS: ApiEndpoint[] = [
  {
    id: 'pdf-preview',
    method: 'POST',
    path: '/pdf/preview',
    title: 'Preview PDF',
    description: 'Generate a preview PDF blob from HTML content.',
    authentication: true,
    permissions: ['documents:read'],
    bodyParams: [
      {
        name: 'html',
        type: 'string',
        required: true,
        description: 'Raw HTML content to convert to PDF'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'PDF binary stream',
        example: '<Binary PDF Data>'
      },
      {
        status: 400,
        description: 'Invalid input',
        example: { error: 'Invalid HTML content' }
      }
    ]
  },
  {
    id: 'pdf-save',
    method: 'POST',
    path: '/pdf/save',
    title: 'Save PDF',
    description: 'Generate a PDF from HTML and upload it to storage.',
    authentication: true,
    permissions: ['documents:upload'],
    bodyParams: [
      {
        name: 'html',
        type: 'string',
        required: true,
        description: 'Raw HTML content to convert to PDF'
      },
      {
        name: 'filename',
        type: 'string',
        required: false,
        description: 'Optional filename for the uploaded file'
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        description:
          'Type of document (e.g. "contract", "quotation"). Determines storage path prefix.'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'PDF generated and uploaded successfully',
        example: {
          success: true,
          url: 'https://storage.example.com/contracts/contract-123.pdf'
        }
      }
    ]
  }
]
